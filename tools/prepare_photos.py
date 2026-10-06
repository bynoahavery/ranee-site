"""Resize original photos into the three web sizes the site serves, stripping
EXIF metadata (including GPS). Requires Pillow:  pip install Pillow

Usage:  python tools/prepare_photos.py <photo-id> <path-to-original.jpg>
Example: python tools/prepare_photos.py pool ~/Downloads/0M5A7099.jpg
Then add or update the matching entry in netlify/lib/content.mjs.
"""
import sys
from pathlib import Path
from PIL import Image, ImageOps

SIZES = {"sm": (800, 78), "md": (1600, 80), "full": (2560, 82)}
root = Path(__file__).resolve().parent.parent / "private" / "photos"

photo_id, src = sys.argv[1], sys.argv[2]
im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
for size, (width, quality) in SIZES.items():
    out = root / size / f"{photo_id}.jpg"
    out.parent.mkdir(parents=True, exist_ok=True)
    copy = im.copy()
    copy.thumbnail((width, width * 2), Image.LANCZOS)
    copy.save(out, "JPEG", quality=quality, optimize=True, progressive=True)
    print(f"wrote {out} ({out.stat().st_size // 1024} KB)")
