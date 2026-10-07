"""Crop the hub renders and write the cable centreline for the LED bead.
Usage: python3 hub-export.py <render dir> <repo root>
Reads hub-on.png, hub-off.png, hub-glow.png and path.json from render-hub.js; writes src/static/assets/hub/*.webp
and src/static/data/hub.json (frame size, hub-only height, cable path in frame pixels)."""
import json, sys
from PIL import Image
src, root = sys.argv[1], sys.argv[2]
out = root + '/src/static/assets/hub'
on = Image.open(src + '/hub-on.png'); off = Image.open(src + '/hub-off.png'); glow = Image.open(src + '/hub-glow.png').convert('RGB')
hub_only = Image.open(src + '/hub-on.png').getchannel('A')
bb = on.getbbox(); m = 12
c = (bb[0] - m, max(0, bb[1] - m), bb[2] + m, on.size[1])
# hub-only height: the lowest row of the hub body (the plug sits at the bottom right; the cable hangs below it)
# hub-only height: the lowest solid row on the left third (the cable hangs on the right; the soft shadow is not solid)
a = hub_only.crop((c[0], c[1], c[0] + (c[2] - c[0]) // 3, c[3])).point(lambda v: 255 if v > 220 else 0)
hub_bottom = c[1] + a.getbbox()[3]
W, H = c[2] - c[0], c[3] - c[1]
# saved at 900px wide: the hub shows at most 440 CSS px, so this covers 2x screens. hub.json keeps the full-frame
# size, which the page uses only as the drawing's coordinate space.
for n, im in [('hub-on', on), ('hub-off', off), ('hub-glow', glow)]:
    im = im.crop(c); im.resize((900, round(im.height * 900 / im.width)), Image.LANCZOS).save(f'{out}/{n}.webp', quality=86, method=6)
P = json.load(open(src + '/path.json'))
d = 'M' + ' L'.join(f'{round(x - c[0], 1)} {round(y - c[1], 1)}' for x, y in P['path'])
json.dump({'w': W, 'h': H, 'hubH': hub_bottom + m - c[1], 'd': d}, open(root + '/src/static/data/hub.json', 'w'))
print('frame', W, H, 'hub', hub_bottom + m - c[1])
