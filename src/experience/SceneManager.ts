import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { qualityManager, type QualitySettings } from "@/rendering/QualityManager";
import { makeDataTexture, textureCache } from "@/rendering/TextureCache";
import {
  distortionFragment,
  distortionUniforms,
  distortionVertex,
} from "@/shaders/Distortion";
import { postFragment, postUniforms, postVertex } from "@/shaders/Post";
import type { WebGLRenderer, WebGLRenderTarget } from "three";

export interface SceneManagerEvents {
  onQualityChange?: () => void;
}

/**
 * SceneManager — owns the WebGL configuration shared by the whole experience:
 * renderer tone mapping, a studio environment map generated in-memory, and an
 * evidence-based post pipeline (bloom + distortion + film grade) that adapts
 * to the active quality level.
 */
export class SceneManager {
  private gl: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private size: { width: number; height: number };
  private composer: EffectComposer | null = null;
  private renderPass: RenderPass | null = null;
  private bloom: UnrealBloomPass | null = null;
  private distortion: ShaderPass | null = null;
  private finalPass: ShaderPass | null = null;
  private quality: QualitySettings = qualityManager.get();
  private previousTexture: THREE.Texture | null = null;
  private env: THREE.Texture | null = null;
  private events: SceneManagerEvents = {};

  constructor(
    gl: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    size: { width: number; height: number },
  ) {
    this.gl = gl;
    this.scene = scene;
    this.camera = camera;
    this.size = size;
  }

  attach = (events: SceneManagerEvents) => {
    this.events = events;
    this.configure();
    this.setupEnvironment();
    this.rebuild();
    window.addEventListener("volt:quality", this.onQuality);
  };

  private configure = () => {
    this.gl.outputColorSpace = THREE.SRGBColorSpace;
    this.gl.toneMapping = THREE.ACESFilmicToneMapping;
    this.gl.toneMappingExposure = 1.02;
    this.gl.shadowMap.enabled = true;
    this.gl.shadowMap.type = THREE.PCFSoftShadowMap;
  };

  private setupEnvironment = () => {
    const pmrem = new THREE.PMREMGenerator(this.gl);
    const rt = pmrem.fromScene(new RoomEnvironment(), 0.04);
    this.scene.environment = rt.texture;
    this.env = rt.texture;
    pmrem.dispose();
  };

  private onQuality = () => {
    this.quality = qualityManager.get();
    this.rebuild();
    this.events.onQualityChange?.();
  };

  private rebuild = () => {
    this.destroyComposer();
    const w = this.size.width;
    const h = this.size.height;
    this.composer = new EffectComposer(this.gl);
    this.renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(this.renderPass);

    if (this.quality.post.enabled) {
      this.bloom = new UnrealBloomPass(
        new THREE.Vector2(w, h),
        0.22,
        0.8,
        0.88,
      );
      this.bloom.strength = this.quality.post.bloom * 0.45;
      this.composer.addPass(this.bloom);
    }

    this.distortion = new ShaderPass({
      uniforms: distortionUniforms(),
      vertexShader: distortionVertex,
      fragmentShader: distortionFragment,
    });
    this.distortion.uniforms.uStrength.value = 0;
    if (!textureCache.has("debug-black")) {
      textureCache.set("debug-black", makeDataTexture(1, () => [0, 0, 0, 1]));
    }
    this.distortion.uniforms.uPrevious.value = textureCache.get("debug-black")!;
    this.composer.addPass(this.distortion);

    this.finalPass = new ShaderPass({
      uniforms: postUniforms(),
      vertexShader: postVertex,
      fragmentShader: postFragment,
    });
    this.finalPass.uniforms.uVignette.value = this.quality.post.vignette;
    this.finalPass.uniforms.uNoise.value = this.quality.post.noise;
    this.composer.addPass(this.finalPass);
    this.composer.setSize(w, h);
    this.composer.setPixelRatio(Math.min(this.gl.getPixelRatio(), this.quality.dpr));
  };

  private destroyComposer = () => {
    this.distortion?.uniforms.uPrevious?.value?.dispose?.();
    this.composer?.dispose?.();
    this.composer = null;
  };

  setSize = (width: number, height: number) => {
    this.size = { width, height };
    if (!this.composer) return;
    this.composer.setSize(width, height);
    if (this.bloom) this.bloom.setSize(width, height);
  };

  /**
   * Called once per render frame with the master values. Drives the custom
   * shader passes: the distortion seam and the film grade.
   */
  update = (time: number, distortionStrength: number, distortionMix: number) => {
    if (this.finalPass) {
      this.finalPass.uniforms.uTime.value = time;
    }
    if (this.distortion) {
      this.distortion.uniforms.uTime.value = time;
      this.distortion.uniforms.uStrength.value = distortionStrength;
      this.distortion.uniforms.uMix.value = distortionMix;
    }
  };

  render = () => {
    if (this.quality.post.enabled && this.composer) {
      this.composer.render();
    } else {
      this.gl.render(this.scene, this.camera);
    }
  };

  setDistortionSource = (source: THREE.Texture | null) => {
    if (this.distortion && source) {
      this.distortion.uniforms.uPrevious.value = source;
      this.previousTexture = source;
    }
  };

  dispose = () => {
    window.removeEventListener("volt:quality", this.onQuality);
    this.destroyComposer();
    this.env?.dispose();
  };
}
