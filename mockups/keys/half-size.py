"""Write half-size copies (<name>-1x.webp) of rendered images, for 1x screens and phones.
Usage: python3 half-size.py <dir> [<dir> ...]   (skips files that are already -1x copies)"""
import sys, glob
from PIL import Image
for d in sys.argv[1:]:
    for f in sorted(glob.glob(d + '/*.webp')):
        if f.endswith('-1x.webp'): continue
        im = Image.open(f); im.load()
        im.resize((max(1, round(im.width / 2)), max(1, round(im.height / 2))), Image.LANCZOS).save(f[:-5] + '-1x.webp', quality=84, method=6)
