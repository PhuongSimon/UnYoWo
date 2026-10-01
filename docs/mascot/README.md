# Mascot – Bé Hộp (bunny-box)

A shy white bunny hiding in a cardboard box, built for [page-mascot](https://github.com/nilbuild/page-mascot).

| File | What it is |
|---|---|
| `generate.mjs` | Draws both 3×3 sprite sheets as SVG/PNG. The box is projected in 3D so head turns show its side, top and bottom; the feet never move (they are the anchor). |
| `characters/bunny-box/*.png` | Source sheets (1200×1200, transparent) fed to the page-mascot build. |
| `apps/web/public/mascots/bunny-box-*.webp` | Built atlases used by `<BunnyMascot />`. |

## Redraw and rebuild

```bash
# 1. Draw the sheets (needs @resvg/resvg-js available to node)
node docs/mascot/generate.mjs docs/mascot/characters/bunny-box

# 2. Build + verify with the page-mascot skill scripts (Python: pillow, numpy, scipy)
MASCOT_SRC=docs/mascot/characters MASCOT_DEST=apps/web/public/mascots \
  python3 <page-mascot>/scripts/build.py bunny-box --anchor shoulders --no-vignette
MASCOT_DEST=apps/web/public/mascots python3 <page-mascot>/scripts/verify.py bunny-box
```

`--no-vignette` matters: the character is drawn whole (feet included), so the default
bottom fade would blur the feet away.
