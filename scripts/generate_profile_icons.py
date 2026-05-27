#!/usr/bin/env python3
"""Generate profile and site icon sizes from images/logo/profile-512x512.png."""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "images" / "logo" / "profile-512x512.png"
FAVICON_SRC = ROOT / "images" / "tolove.jpg"
LOGO_DIR = ROOT / "images" / "logo"
IMAGES_DIR = ROOT / "images"


def save_resize(im: Image.Image, path: Path, size: int) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    out = im.resize((size, size), Image.Resampling.LANCZOS)
    out.save(path, optimize=True)


def main() -> None:
    im = Image.open(SRC).convert("RGBA")

    for size in (16, 32, 64, 96, 128, 144, 180, 192, 256):
        save_resize(im, LOGO_DIR / f"profile-{size}x{size}.png", size)

    fav = Image.open(FAVICON_SRC).convert("RGBA")
    for name, size in {"favicon-16x16.png": 16, "favicon-32x32.png": 32}.items():
        save_resize(fav, IMAGES_DIR / name, size)
    ico_images = [
        fav.resize((s, s), Image.Resampling.LANCZOS) for s in (16, 32, 48)
    ]
    ico_images[0].save(
        IMAGES_DIR / "favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
    )

    site_files = {
        "mstile-144x144.png": 144,
        "apple-touch-icon.png": 180,
        "android-chrome-192x192.png": 192,
        "android-chrome-512x512.png": 512,
    }
    for name, size in site_files.items():
        save_resize(im, LOGO_DIR / name, size)

    print("Done profile:", SRC)
    print("Done favicon:", FAVICON_SRC)


if __name__ == "__main__":
    main()
