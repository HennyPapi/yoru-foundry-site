"""Crop row-key renders to shared boxes and print layout data. Usage: crop.py <render dir> <out dir>"""
import json, sys
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
meta = {}
for line in open(f'{src}/meta.txt'):
    if not line.startswith('errors'):
        n, j = line.split(' ', 1); meta[n] = json.loads(j)
K, OUT = 168 / 1221, 2          # CSS px per render px (header-key scale); export at 2x
keys = sorted({n.split('-')[0] for n in meta})
states = ['', '-hover', '-press']
ims = {k + s: Image.open(f'{src}/{k}{s}.png') for k in keys for s in states}
bbs = {n: i.getbbox() for n, i in ims.items()}
top = min(b[1] for b in bbs.values()) - 12; bot = max(b[3] for b in bbs.values()) + 12   # shared plate line
caps = {}
for k in keys:
    x0 = min(bbs[k + s][0] for s in states) - 12; x1 = max(bbs[k + s][2] for s in states) + 12
    w, h = x1 - x0, bot - top
    for s in states:
        ims[k + s].crop((x0, top, x1, bot)).resize((round(w * K * OUT), round(h * K * OUT)), Image.LANCZOS).save(f'{dst}/{k}{s}.webp', quality=86)
    b = meta[k]['base']
    f = {s or 'idle': [round((meta[k + s]['face'][3][0] - x0) / w * 100, 2), round((meta[k + s]['face'][3][1] - top) / h * 100, 2)] for s in states}
    caps[k] = dict(w=round(w * K, 1), bl=round((b[0] - x0) * K, 1), br=round((x1 - b[1]) * K, 1), f=f)
print(json.dumps(caps))
