# RazorSense 2.0's engine

The RazorSense 2.0 components (`RazorSenseLoader`, `RazorSenseChatBackground`, `RazorSenseChat`, `RazorSenseThinking`,
`RazorSenseBottomWave`) draw with one engine: `src/components/Spark/RazorSenseEngine/freshEngine.ts`. It's built here, not
written by hand.

- `source/` is the RazorSense system's own engine, as Razorsensation (its studio) runs it: `01-core.js` and `02-gl.js` (the
  document and the WebGL2 renderer), `player.js` (the player for an exported comp), and `gpu_raster.js` (its GPU speed-ups).
- `buildFreshEngine.js` patches that source, as text, into a factory (`createFreshEngine`) that mounts one comp on one canvas,
  with no studio page, saving or globals, and with its shaders compiled off the page's thread. Each patch names the text it
  expects; if the source moves on and a patch no longer fits, the build stops and says which.

```sh
yarn build:razorsense-engine   # writes freshEngine.ts from source/ (and lints it)
yarn check:razorsense-engine   # fails if the committed freshEngine.ts isn't what source/ builds, or doesn't lint
```

The engine is the studio's code, so it isn't held to Blade's style rules or type checks inside; the build lints it for the
mistakes that break code (undefined names, unreachable code, duplicate keys and the like). Its boundary is typed: the
components only reach it through `createFreshEngine`'s signature and the types in `RazorSenseEngine/types.ts`.

## The comps and the stills

What each component plays (`comps.ts`) and the still frames it falls back to (`stills/`) are design data, not code: they're
exported from Razorsensation, where RazorSense's motion is designed, and each file says where it came from. To change how
RazorSense looks, change it there and export again; to change how the engine draws, change `source/` or a patch here and build.
