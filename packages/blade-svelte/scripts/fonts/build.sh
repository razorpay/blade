#!/usr/bin/env bash
# Rebuilds Blade's faces in src-cx/fonts/ (declared in src-cx/fonts.css), from
# blade-core's variable fonts pinned to the static cuts checkout ships:
#   tasa.woff2            TASA Orbiter wght 600 / opsz 60 (Display SemiBold), plus rupee.py's ₹
#   inter-{regular,medium,semibold}.woff2   Inter wght 400 / 500 / 600
# each cut by subset.py. Needs python3 with fontTools, FontForge, and node (wawoff2).
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
pkg="$(cd "$here/../.." && pwd)"
core="$pkg/../blade-core/fonts"
out="$pkg/src-cx/fonts"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT
cd "$pkg"

woff2() { node -e 'require("wawoff2")[process.argv[1]](require("fs").readFileSync(process.argv[2])).then((b) => require("fs").writeFileSync(process.argv[3], b))' "$@"; }
instance() { python3 -c 'import sys, json; from fontTools.ttLib import TTFont; from fontTools.varLib import instancer
instancer.instantiateVariableFont(TTFont(sys.argv[1]), json.loads(sys.argv[3])).save(sys.argv[2])' "$@"; }

# TASA Orbiter Display SemiBold, with a drawn ₹
woff2 decompress "$core/tasa-orbiter.woff2" "$work/tasa-vf.ttf"
instance "$work/tasa-vf.ttf" "$work/instance.ttf" '{"wght": 600, "opsz": 60}'
(cd "$work" && fontforge -lang=py -script "$here/rupee.py" >/dev/null 2>&1)
python3 "$here/subset.py" "$work/instance.ttf" "$work/tasa.ttf" 'TASA Orbiter Display SemiBold' TASAOrbiterDisplay-SemiBold 600 --rupee "$work/rupee-ff.ttf"
woff2 compress "$work/tasa.ttf" "$out/tasa.woff2"

# Inter Regular, Medium, SemiBold
woff2 decompress "$core/inter-variable/inter-latin-blade.woff2" "$work/inter-vf.ttf"
for cut in regular:400:Regular medium:500:Medium semibold:600:SemiBold; do
  IFS=: read -r file weight style <<<"$cut"
  instance "$work/inter-vf.ttf" "$work/inter-$file-instance.ttf" "{\"wght\": $weight, \"slnt\": 0}"
  python3 "$here/subset.py" "$work/inter-$file-instance.ttf" "$work/inter-$file.ttf" "Inter $style" "Inter-$style" "$weight"
  woff2 compress "$work/inter-$file.ttf" "$out/inter-$file.woff2"
done
ls -l "$out"
