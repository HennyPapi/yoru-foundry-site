"""Crop cable renders to one shared band at header scale; write webps and the LED path. Usage: export.py <scratch> <out dir>"""
import json, sys
from PIL import Image
S, D = sys.argv[1], sys.argv[2]
m = json.load(open(S + '/cable/cable-meta.json'))
ims = {n: Image.open(f'{S}/cable/{n}.png') for n in ['tile', 'coil', 'plug']}
top = min(i.getbbox()[1] for i in ims.values()) - 6; bot = max(i.getbbox()[3] for i in ims.values()) + 6
C = 120 / 504                  # CSS px per render px: the tile (12 braid periods) is exactly 120 CSS px
dims = {}
for n in ['tile', 'coil', 'plug']:
    for g in ['', '-glow']:
        if n == 'plug' and g: continue
        c = Image.open(f'{S}/cable/{n}{g}.png').crop((m[n]['x0'], top, m[n]['x1'], bot))
        w, h = round(c.width * C * 2), round(c.height * C * 2)
        c = c.resize((w, h), Image.LANCZOS)
        if g: c = c.convert('RGB')   # glow: black is neutral under a screen blend
        c.save(f'{D}/{n}{g}.webp', quality=86); dims[n] = (w / 2, h / 2)
keytop = min(Image.open(f'{S}/row/{k}{s}.png').getbbox()[1] for k in ['d1.25', 'd1.5', 'd1.75', 'd2', 'd6.25', 's2.25'] for s in ['', '-hover', '-press']) - 12
K = 168 / 1221
offset = round((m['keyGroundY'] - keytop) * K - (m['tile']['groundY'] - top) * C, 1)
axis = round((m['tile']['axisY'] - top) * C, 1)
pts = m['coil']['path']; x0 = m['coil']['x0']; ay = m['coil']['axisY']; n = len(pts)
i = 0
while i < n and abs(pts[i][1] - ay) <= 1.5: i += 1
j = n - 1
while j >= 0 and abs(pts[j][1] - ay) <= 1.5: j -= 1
coil = [[round((pts[k][0] - x0) * C, 1), round((pts[k][1] - top) * C, 1), 1 if (k < i or k > j) else pts[k][2]] for k in list(range(0, n, 4)) + [n - 1]]
json.dump({'dims': dims, 'offset': offset, 'axis': axis, 'collar': round(5.5 * 15 * C, 1), 'coil': coil}, open(S + '/cable/led-path.json', 'w'))
print(dims, offset, axis)
