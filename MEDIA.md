# Adding photos, video and sound

Every photo, video and sound spot on the site already has its final size. Until a real file exists it shows an
honest placeholder; once you point it at a file, the file appears in the same space and nothing else moves.

1. Put the file in `src/static/media/` (folders below).
2. Point the matching setting at it (table below). Paths start with `/media/`, for example `/media/hero/forge-loop.mp4`.
3. Run `node build.js` and push. Check the Cloudflare preview after a hard refresh.

Anything still pointing at a `placeholder-…` file or at `silence-3s.mp3` counts as "no media yet" and shows the
placeholder.

## Where each file goes

| Spot | Folder | Where to set it |
|---|---|---|
| Homepage hero (video loop or photo) | `media/hero/` | `HOME_MEDIA` in `src/static/data/content.js`: `video` (or `image`), plus `poster` and `alt` |
| Homepage sound band (up to 4 recordings) | `media/sound/` | `HOME_SOUNDS` in `content.js`: one `{ label, file }` per recording |
| A build's main photo | `media/builds/` | that build's `heroImage` in `BUILDS` (`content.js`) |
| A build's archive thumbnail | `media/builds/` | that build's `images[0]` |
| A build's three detail photos | `media/builds/` | that build's `detailImages` |
| A build's sound test | `media/sound/` | that build's `audio` |
| Comparison players on Built to Taste | `media/sound/` | `SOUND_SAMPLES` in `content.js`: `file` |
| A guide step (Built to Taste, Trust the Process) | `media/guides/` | add the path as the 4th item of the step in `STORIES`: `["Title", "Label", "Text", "/media/guides/lube-before.mp4"]` |
| About: portrait and workbench photo | `media/about/` | the `src="…"` on the `<yf-media>` tags in `src/about.html` (also set `alt="…"`) |
| 75% page photos | `media/builds/` | the `src="…"` on the `<yf-media>` tags in `src/crafted-art-75.html` |

## Sizes and formats

| Kind | Shape | Size | Format |
|---|---|---|---|
| Hero video | 16:9 | 1920×1080, 8–15 s loop, under 8 MB | MP4 (H.264), **no audio track**; plus a poster frame as WebP |
| Hero / build main photo | 16:9 | 2400×1350 | WebP, quality ~80, under 500 KB |
| About portrait | 4:5 | 1600×2000 | WebP, under 500 KB |
| Workbench, guide steps | 16:9 or 3:2 | 1800 wide | WebP or MP4 (short silent loop) |
| Detail photos | 1:1 | 1500×1500 | WebP, under 400 KB |
| Archive / list thumbnails | 4:3 | 1200×900 | WebP, under 250 KB |
| Sound recordings | — | 10–20 s, same mic, desk and typing pattern every time | MP3 (192 kbps) or M4A, peaks around -1 dB |

Photos are cropped to their frame's shape, so keep the subject away from the edges.

## How video and sound behave

- Videos always play **muted**, loop, and never show sound controls by default. Visitors with "reduce motion" turned
  on see the first frame with a play button instead; nothing moves unless they ask.
- Sound never autoplays. Each recording has a normal player the visitor taps; this is the only reliable way on iPhone.
- Write a short `alt` for every photo that shows something specific (a build, your bench). The site leaves it empty
  for purely decorative frames.
