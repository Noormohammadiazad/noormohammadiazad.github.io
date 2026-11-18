#!/usr/bin/env bash
# Regenerates the raster images from their SVG sources.
#
# macOS only: it uses QuickLook (`qlmanage`) as the rasteriser and `sips` to
# crop and re-encode, both of which ship with the OS. Nothing in the normal
# build depends on this — the outputs are committed, so `npm run build` and
# CI never need to rasterise anything.
#
#   ./tools/make-images.sh
#
# Note: the SVG sources are authored on a square canvas because QuickLook
# rescales non-square SVGs; the real artwork is the centre band, cropped out
# below.
set -euo pipefail
cd "$(dirname "$0")/.."

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

# ── Social card: 1200x1200 canvas -> centre 1200x630 -> JPEG ──────────────
qlmanage -t -s 1200 -o "$tmp" src/assets/og.svg >/dev/null 2>&1
cp "$tmp/og.svg.png" "$tmp/og.png"
sips -c 630 1200 "$tmp/og.png" >/dev/null
sips -s format jpeg -s formatOptions 82 "$tmp/og.png" --out src/assets/og.jpg >/dev/null

# ── Apple touch icon: 180x180, full bleed ─────────────────────────────────
qlmanage -t -s 180 -o "$tmp" src/assets/apple-touch-icon.svg >/dev/null 2>&1
cp "$tmp/apple-touch-icon.svg.png" src/assets/apple-touch-icon.png

echo "regenerated:"
ls -lh src/assets/og.jpg src/assets/apple-touch-icon.png | awk '{print "  " $9 "  " $5}'
