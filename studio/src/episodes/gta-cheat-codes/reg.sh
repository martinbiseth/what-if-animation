#!/bin/sh
# Re-register the chapters that have shots: writes each index.tsx and the series index.ts.
cd "$(dirname "$0")"
imports=""; list=""
for c in c01 c02 c03 c04 c05 c06 c07; do
  [ -f $c/shots.tsx ] || continue
  C=$(echo $c | sed 's/c/C/')
  printf "import { defineEpisode, Timeline } from '../../../engine';\nimport timeline from './timeline.json';\nimport * as shots from './shots';\n\nexport const $c = defineEpisode(\"GtaCheatCodes$C\", { timeline: timeline as Timeline, shots });\n" > $c/index.tsx
  imports="${imports}import { $c } from './$c';\n"; list="${list}${list:+, }$c"
done
printf "${imports}\n// The chapters in order: the registry gives each its own composition, long.py renders and joins them.\nexport const gtaCheatCodesChapters = [$list];\n" > index.ts
