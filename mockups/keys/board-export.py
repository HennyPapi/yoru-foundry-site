"""Crop the footer keyboard renders and record where each linked word sits.
Usage: python3 board-export.py <render dir> <repo root>
Reads base.png (unlit), lit.png and <id>-h.png / <id>-p.png (hover / pressed, both lit) from render-board.js.
Writes src/static/assets/footer-board/*.webp and the boxes in src/static/data/footer-board.json."""
import json, sys
from PIL import Image, ImageChops
src, root = sys.argv[1], sys.argv[2]
out = root + '/src/static/assets/footer-board'
data_path = root + '/src/static/data/footer-board.json'
data = json.load(open(data_path))
base = Image.open(src + '/base.png'); lit = Image.open(src + '/lit.png')
bb = base.getbbox(); m = 16
crop = (bb[0] - m, bb[1] - m, bb[2] + m, bb[3] + m)
B = base.crop(crop); L = lit.crop(crop); W, H = B.size
B.save(out + '/board.webp', quality=86, method=6); L.save(out + '/board-lit.webp', quality=86, method=6)
boxes = json.load(open(src + '/boxes.json'))
pct = lambda x0, y0, x1, y1: [round(x0 / W * 100, 3), round(y0 / H * 100, 3), round((x1 - x0) / W * 100, 3), round((y1 - y0) / H * 100, 3)]
data['w'], data['h'] = W, H
for id, key in data['keys'].items():
    x0, y0, x1, y1 = boxes[id]
    key['hit'] = pct(x0 - crop[0], y0 - crop[1], x1 - crop[0], y1 - crop[1])
    for st in 'hp':
        im = Image.open(f'{src}/{id}-{st}.png').crop(crop)
        d = ImageChops.difference(im, L).convert('L').point(lambda v: 255 if v > 3 else 0).getbbox()
        d = (max(0, d[0] - 6), max(0, d[1] - 6), min(W, d[2] + 6), min(H, d[3] + 6))
        im.crop(d).save(f'{out}/{id}-{st}.webp', quality=86, method=6)
        key[st] = pct(*d)
json.dump(data, open(data_path, 'w'), indent=2)
print('board', W, H, 'keys', len(data['keys']))
