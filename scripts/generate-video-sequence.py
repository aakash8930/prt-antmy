#!/usr/bin/env python3
"""Turn the four supplied 24 FPS clips into a cleaned 30 FPS WebP sequence.

Dependencies (kept outside the Next.js app):
    python -m pip install av pillow opencv-python-headless numpy

The source clips are expected at public/video/v1.mp4 through v4.mp4. The
fixed lower-right sparkle in the authorized supplied footage is inpainted
before each frame is written to public/sequence/frame_0000.webp through
frame_1199.webp.
"""

from __future__ import annotations

import argparse
import shutil
from pathlib import Path

import av
import cv2
import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "public" / "video"
OUTPUT_DIR = ROOT / "public" / "sequence"
SOURCE_NAMES = ("v1.mp4", "v2.mp4", "v3.mp4", "v4.mp4")
OUTPUT_FPS = 30
FRAMES_PER_CLIP = 300
EXPECTED_SIZE = (1920, 1080)
WATERMARK_CENTER = (1740, 900)
WATERMARK_RADIUS = 54


def watermark_mask() -> np.ndarray:
    mask = np.zeros((EXPECTED_SIZE[1], EXPECTED_SIZE[0]), dtype=np.uint8)
    cv2.ellipse(
        mask,
        WATERMARK_CENTER,
        (WATERMARK_RADIUS, WATERMARK_RADIUS),
        0,
        0,
        360,
        255,
        -1,
    )
    return mask


def clean_frame(frame: av.VideoFrame, mask: np.ndarray) -> np.ndarray:
    rgb = frame.to_ndarray(format="rgb24")
    if (rgb.shape[1], rgb.shape[0]) != EXPECTED_SIZE:
        raise ValueError(
            f"Expected {EXPECTED_SIZE[0]}x{EXPECTED_SIZE[1]} frames, "
            f"got {rgb.shape[1]}x{rgb.shape[0]}"
        )
    return cv2.inpaint(rgb, mask, 3, cv2.INPAINT_TELEA)


def render_clip(source_path: Path, first_output_index: int, quality: int, mask: np.ndarray) -> int:
    container = av.open(str(source_path))
    stream = container.streams.video[0]
    source_fps = float(stream.average_rate or 24)
    decoder = container.decode(video=0)
    decoded_index = -1
    current_clean: np.ndarray | None = None
    written = 0

    try:
        for local_index in range(FRAMES_PER_CLIP):
            # The supplied clips are 24 FPS / 10 seconds. Sampling by time
            # produces exactly 300 frames per clip at the required 30 FPS.
            desired_source_index = min(
                stream.frames - 1,
                int(local_index * source_fps / OUTPUT_FPS + 0.5),
            )
            while decoded_index < desired_source_index:
                try:
                    source_frame = next(decoder)
                except StopIteration as error:
                    raise RuntimeError(
                        f"{source_path.name} ended before source frame "
                        f"{desired_source_index}"
                    ) from error
                decoded_index += 1
                current_clean = clean_frame(source_frame, mask)

            if current_clean is None:
                raise RuntimeError(f"Could not decode {source_path.name}")

            output_path = OUTPUT_DIR / f"frame_{first_output_index + local_index:04d}.webp"
            Image.fromarray(current_clean, mode="RGB").save(
                output_path,
                format="WEBP",
                quality=quality,
                method=4,
            )
            written += 1
            if written % 50 == 0 or written == FRAMES_PER_CLIP:
                print(f"  {source_path.name}: {written:03d}/{FRAMES_PER_CLIP}", flush=True)
    finally:
        container.close()

    return written


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--quality",
        type=int,
        default=60,
        help="WebP quality from 0 to 100; 60 keeps the sequence web-friendly.",
    )
    args = parser.parse_args()
    if not 1 <= args.quality <= 100:
        raise SystemExit("--quality must be between 1 and 100")

    sources = [SOURCE_DIR / name for name in SOURCE_NAMES]
    missing = [str(path) for path in sources if not path.exists()]
    if missing:
        raise SystemExit("Missing source videos:\n" + "\n".join(missing))

    if OUTPUT_DIR.exists():
        shutil.rmtree(OUTPUT_DIR)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    mask = watermark_mask()
    total = 0
    print(f"Rendering {len(sources) * FRAMES_PER_CLIP} frames at {OUTPUT_FPS} FPS...")
    for clip_index, source_path in enumerate(sources):
        total += render_clip(source_path, clip_index * FRAMES_PER_CLIP, args.quality, mask)

    expected = len(sources) * FRAMES_PER_CLIP
    actual = len(list(OUTPUT_DIR.glob("frame_*.webp")))
    if total != expected or actual != expected:
        raise RuntimeError(f"Expected {expected} frames, wrote {total} ({actual} on disk)")
    print(f"Done: {actual} frames in {OUTPUT_DIR} ({sum(p.stat().st_size for p in OUTPUT_DIR.glob('*.webp')) / 1024 / 1024:.1f} MiB)")


if __name__ == "__main__":
    main()
