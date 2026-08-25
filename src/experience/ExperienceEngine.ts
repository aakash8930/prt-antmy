import * as THREE from "three";
import type { RootState } from "@react-three/fiber";
import { createMotorcycle, PART_LABELS, type PartName } from "./Motorcycle";
import { SceneManager } from "./SceneManager";
import { CameraController, emptyPointer, type PointerState } from "./CameraController";
import { ExplodedViewController } from "./ExplodedViewController";
import { LightingController } from "./LightingController";
import { ParticleSystem } from "./ParticleSystem";
import { ShaderController } from "./ShaderController";
import { MotorcycleController } from "./MotorcycleController";
import {
  experienceStore,
  getExperience,
} from "./ExperienceStore";
import { audioController } from "@/audio/AudioController";
import { clamp, damp } from "@/utils/math";
import { getAct } from "@/animation/MasterTimeline";

/**
 * ExperienceEngine — the orchestrator. It owns every individual system and
 * advances them from the same `experienceProgress`, so the scene, post FX,
 * audio, DOM overlay and sequence renderer always stay in lockstep.
 */
export class ExperienceEngine {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private gl!: THREE.WebGLRenderer;
  private sceneManager: SceneManager | null = null;
  private debugObjects: THREE.Object3D[] = [];
  private debugWireframe = false;
  private debugBounds = false;
  private debugCameraPath = false;
  private debugComponentNames = false;
  private paused = false;
  private cameraController = new CameraController();
  private lighting = new LightingController();
  private particles: ParticleSystem | null = null;
  private shaders: ShaderController | null = null;
  private exploded: ExplodedViewController | null = null;
  private motor: MotorcycleController | null = null;
  private model: ReturnType<typeof createMotorcycle> | null = null;
  private pointer: PointerState = emptyPointer();
  private raycaster = new THREE.Raycaster();
  private ndc = new THREE.Vector2();
  private hovered: PartName | "" = "";
  private focused: PartName | "" = "";
  private temp = new THREE.Vector3();
  private attached = false;
  private distortionMix = 0;
  private motorSpeed = 0;

  get isAttached() {
    return this.attached;
  }

  attach = (state: RootState) => {
    this.scene = state.scene;
    this.camera = state.camera as THREE.PerspectiveCamera;
    const gl = state.gl;
    this.gl = gl;
    const { size } = state;

    this.model = createMotorcycle();
    this.scene.add(this.model.group);

    this.sceneManager = new SceneManager(gl, this.scene, this.camera, size);
    this.sceneManager.attach({});

    this.exploded = new ExplodedViewController(this.model);
    this.motor = new MotorcycleController(this.model);
    this.lighting.build(this.scene);
    this.particles = new ParticleSystem(this.scene);
    this.shaders = new ShaderController(this.scene);

    this.bindPointer(gl.domElement);
    this.attached = true;
  };

  private bindPointer = (dom: HTMLCanvasElement) => {
    const updateNdc = (e: PointerEvent | MouseEvent) => {
      const rect = dom.getBoundingClientRect();
      const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
      const y = clamp((e.clientY - rect.top) / rect.height, 0, 1);
      this.pointer.x = x * 2 - 1;
      this.pointer.y = -(y * 2 - 1);
      this.ndc.set(this.pointer.x, this.pointer.y);
    };

    dom.addEventListener("pointermove", updateNdc);
    dom.addEventListener("mousemove", updateNdc);

    dom.addEventListener("pointerdown", (e) => {
      updateNdc(e);
      this.pointer.dragging = false;
      this.pointer.dragStartX = e.clientX;
      this.pointer.dragStartY = e.clientY;
    });

    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - this.pointer.dragStartX;
      const dy = e.clientY - this.pointer.dragStartY;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) this.pointer.dragging = true;
      if (this.pointer.dragging) {
        this.pointer.manualYaw += dx * 0.004;
        this.pointer.manualPitch = clamp(
          this.pointer.manualPitch + dy * 0.003,
          -0.5,
          0.7,
        );
        this.pointer.dragStartX = e.clientX;
        this.pointer.dragStartY = e.clientY;
      }
    };
    dom.addEventListener("pointermove", onMove);

    const end = () => {
      if (!this.pointer.dragging && this.pointer.x !== 0) {
        this.handleClick();
      }
      this.pointer.dragging = false;
      this.pointer.manualYaw = 0;
      this.pointer.manualPitch = 0;
    };
    dom.addEventListener("pointerup", end);
    dom.addEventListener("pointerleave", end);
  };

  private handleClick = () => {
    const progress = getExperience().progress;
    const act = getAct(progress);
    const inspection = act.index >= 3 && act.index <= 4;
    if (!inspection) return;
    this.hovered = this.raycastPart();
    if (this.hovered) {
      this.focused = this.hovered;
      const pos = this.temp;
      this.model?.parts[this.focused].getWorldPosition(pos);
      this.cameraController.setFocus(pos);
      this.distortionMix = 0.4;
    }
  };

  returnToExperience = () => {
    this.focused = "";
    this.cameraController.setFocus(null);
    this.pointer.dragging = false;
    this.pointer.manualYaw = 0;
    this.pointer.manualPitch = 0;
  };

  private raycastPart(): PartName | "" {
    if (!this.model) return "";
    this.raycaster.setFromCamera(this.ndc, this.camera);
    const groups = Object.values(this.model.parts);
    const hits = this.raycaster.intersectObjects(groups, true);
    if (!hits.length) return "";
    let obj: THREE.Object3D | null = hits[0].object;
    while (obj && obj.parent && obj.parent !== this.model?.group) {
      obj = obj.parent;
      if (obj && groups.includes(obj as THREE.Group)) {
        return (obj as THREE.Group).name as PartName;
      }
    }
    return "";
  }

  debugPauseToggle = () => {
    this.paused = !this.paused;
  };

  isWireframe = () => this.debugWireframe;
  isBounds = () => this.debugBounds;
  isCameraPath = () => this.debugCameraPath;

  debugJumpTo = (progress: number) => {
    window.dispatchEvent(new CustomEvent("volt:jump", { detail: progress }));
  };

  update = (delta: number, time: number) => {
    if (this.paused) return;
    if (!this.attached || !this.model || !this.sceneManager) return;
    const store = experienceStore.get();
    const progress = store.progress;
    const velocity = store.scrollVelocity;

    // Camera is the primary choreography subject; everything else is a child.
    this.cameraController.update(this.camera, progress, this.pointer, time * 1000);
    this.exploded?.update(progress, time);
    this.motor?.update(progress, time, velocity);
    this.lighting.update(progress, time);
    this.particles?.update(progress, time, velocity);
    this.shaders?.update(progress, time, this.camera, velocity);

    // Hovering only within the inspection window; cleared afterwards.
    const act = getAct(progress);
    const inspection = act.index >= 3 && act.index <= 4;
    const hovered = inspection ? this.raycastPart() : "";
    if (hovered !== this.hovered) {
      this.hovered = hovered;
      if (!this.focused && !hovered) {
        this.cameraController.setFocus(null);
      }
    }

    const currentSpeed =
      (progress > 0.77 ? (progress - 0.77) / 0.12 : 0) * 220 + velocity * 12;
    this.motorSpeed = damp(this.motorSpeed, currentSpeed, 1.6, delta);

    if (
      store.hoveredPart !== this.hovered ||
      Math.abs(store.motorSpeed - this.motorSpeed) > 0.05
    ) {
      experienceStore.setEngineValues(this.hovered, this.motorSpeed);
    }

    audioController.update(progress, velocity, this.motorSpeed / 60);

    // Focus reset when leaving the inspection window.
    const focusOpen = inspection && this.focused;
    if (!focusOpen && this.distortionMix === 0) {
      this.cameraController.setFocus(null);
    }
    this.distortionMix = Math.max(0, this.distortionMix - delta * 0.8);

    this.sceneManager.update(
      time,
      this.shaders?.getDistortion() ?? 0,
      this.distortionMix * 0.5,
    );
    this.sceneManager.render();
  };

  setSize = (w: number, h: number) => this.sceneManager?.setSize(w, h);

  // ---------- DEBUG ----------
  setDebugWireframe = (on: boolean) => {
    this.debugWireframe = on;
    this.model?.group.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        const mats = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
        mats.forEach((m) => {
          if (m instanceof THREE.Material) (m as { wireframe?: boolean }).wireframe = on;
        });
      }
    });
    this.particles?.setWireframe(on);
  };

  setDebugBounds = (on: boolean) => {
    this.debugBounds = on;
    this.removeDebug("bounds");
    if (on && this.model) {
      const helper = new THREE.Box3Helper(
        new THREE.Box3().setFromObject(this.model.group),
        new THREE.Color(0x9fe8dd),
      );
      helper.name = "bounds";
      this.scene.add(helper);
      this.debugObjects.push(helper);
    }
  };

  setDebugCameraPath = (on: boolean) => {
    this.debugCameraPath = on;
    this.removeDebug("camera-path");
    if (on) {
      const points = this.cameraController.getPathPoints(160);
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(
        geo,
        new THREE.LineBasicMaterial({ color: 0x9fe8dd, transparent: true, opacity: 0.8 }),
      );
      line.name = "camera-path";
      this.scene.add(line);
      this.debugObjects.push(line);
    }
  };

  setDebugComponentNames = (on: boolean) => {
    this.debugComponentNames = on;
    experienceStore.setEngineValues(
      on ? "LIST" : experienceStore.get().hoveredPart,
      this.motorSpeed,
    );
  };

  getDebugComponentNames = () => this.debugComponentNames;

  private removeDebug = (name: string) => {
    const found = this.debugObjects.filter((o) => o.name === name);
    found.forEach((o) => {
      (o as THREE.Box3Helper).dispose?.();
      this.scene.remove(o);
    });
    this.debugObjects = this.debugObjects.filter((o) => o.name !== name);
  };

  getStats = () => {
    const info = this.gl?.info;
    return {
      calls: info?.render.calls ?? 0,
      triangles: info?.render.triangles ?? 0,
      textures: info?.memory.textures ?? 0,
      geometries: info?.memory.geometries ?? 0,
      programs: info?.programs?.length ?? 0,
      memoryUsed: 0,
    };
  };

  getPointer = () => this.pointer;

  dispose = () => {
    this.attached = false;
    this.particles?.dispose();
    this.shaders?.dispose();
    this.model?.dispose();
    this.sceneManager?.dispose();
  };

  getPartLabel = () => (this.hovered ? PART_LABELS[this.hovered] : "");
}
