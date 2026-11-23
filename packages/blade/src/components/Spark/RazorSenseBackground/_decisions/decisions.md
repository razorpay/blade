# RazorSenseBackground (Default Paused 2.0)

The login page's big RazorSense as its own piece: the RazorSense system's 'login · big piece · big frame' tabs (light and dark, each its own tuning), played as the login mirror plays them. Razorsensation's pack: `send/razorsense-blade/default-paused` (its README has every number).

## Why a component of its own

- None of the five 2.0 components can play it. `RazorSenseLoader` is a splash that plays once and leaves; `RazorSenseChatBackground` wraps a chat input and sizes itself round it. This is a page-sized piece that keeps playing, with nothing inside it.
- Named after its sibling `RazorSenseChatBackground`: the chat background sits behind a chat input, this one behind a page. The 2.0 twin of the old `RazorSense` full-page background, so its story, Default Paused 2.0, sits under Default Paused. The story that had that name (the chat background) is now Default Paused 2.0 (Chat Background).
- Props: the ones every 2.0 component takes (`isPaused`, `scale`, `onLoad`, `onError`, `className`, `style`, `testID`) and `width` / `height`, as the loader has. Decorative, so it's hidden from screen readers.

## How it plays

- The comps are the tabs, cut to the 3802 x 4070 comp px the piece reaches over its 12 s (Razorsensation's pack). The one layer that draws nothing, a hidden 'Glyph matte · video' with its image, is dropped. Blade's engine draws the pack's document within 0.04/255 of its reference frames (mean, light and dark, 0-9 s; at most 1 level off at the 99.9th percentile), with that layer or without it.
- The login mirror's play values: its alive adds, drift and band size are put on the comps when they're made (`make_blade_fresh.py`); what only the page runs (the loop a -> b, the alive clock's speed, the colour loop on a clock of its own, each drifting comp's opacity) is the component's clock (`backgroundClock.ts`, nothing made per frame, no React state).
- **The loop's crossfade, on one canvas.** The mirror lays a second player (a second WebGL context) at the loop's start over its last 0.7 s. Here every comp is in the comp again on a 'fade' page, drawn at the loop's start and laid over on the page's own ground (an engine patch, `group(name, { ground: true })`), so laid over at weight w it's exactly (1 - w) x the picture + w x the loop's start: within 0.16/255 of that blend (mean, max 2 levels from rounding). At weight 0 the fade page isn't drawn at all.
- Each copy on the fade page draws with its twin's GPU state (an engine patch: a stack entry's `rc`), so its layers aren't made twice: the piece's GPU memory 57.7 -> 51 MB, the crossfade unchanged.

## What it draws

- The piece is placed as the login page has it: its tab's 3024 x 1724 comp cover-fitted to the box (0.5 CSS px per comp px on a 1512 x 862 box), then the mirror's X / Y / Scale / Rotation round the box's middle.
- **Only the box's part of it is drawn.** Its canvas is the box's corners taken back into the piece's frame (`placePiece.ts`), and the engine draws just that region of the comp (an engine patch, `region()`, for a box that changes size). On a 1512 x 862 box: 1756 x 1072 CSS px, not the piece's whole 1901 x 2035.
- **At 1 device px per CSS px.** The piece is soft all over (its shapes blurred 220-840 comp px). Against the device's own 2x, 1x is 0.2-0.3/255 off on average, light and dark; what differs is the flutes' hard edges, a line one device pixel wide a little softer. 0.75x is about the same (0.25), but it's not worth it. A whole 2x canvas of the piece would be 3802 x 4070 px, about 60 MB a buffer.
- GPU memory on a 1512 x 862 box at 2x: about 51 MB (light and dark), against 41 MB for Default Paused 2.0 (Chat Background) at its own size. Most of it is two 1756 x 1072 buffers: one each comp is drawn into, one the fade page is put together in.
- Its frames on an M-series Mac in Chrome: 60 drawn at the screen's 120, worst frame 11 ms, no long tasks. First frames in about 1.1 s in Storybook, as the chat background's.

## Still and reduced motion

- Its still is the whole piece at its loop's first frame, made by the engine itself (`make_blade_stills.py`, a page of its own: the box shows only part of the piece, so Storybook can't capture it all), at half its CSS size, as WebP: 7 KB light, 5 KB dark. It's laid where the piece goes, turned and scaled with it: within 1/255 of the live first frame (mean).
- Reduced motion: the engine draws that first frame and holds it.
- Everything else every 2.0 component has covers it as it is: the start queue, the engine made a step at a time, the canvas hidden till its first frame, off-screen sleep and wake, the weak-device tier (its lower sharpness is 1.2, so on this one only the every-other-frame step changes anything), the 60 fps cap and the shared target pool. No new shader: nothing new for Direct3D's specialised copies.

## Its pixel budget (2026-11-24)

- A big screen's box doesn't make a bigger canvas: its canvas is at most 2.2 million pixels (`BACKGROUND_PIXELS`), its sharpness lowered to fit, down to 0.5 (the engine's floor). Against the device's own 2x, 0.75x is 0.21-0.32/255 off on average, 0.6x 0.22-0.33, 0.5x 0.22-0.34 (light and dark): the blur hides it.
- Measured (Chrome, M-series Mac): 1512 x 862 box at 2x, canvas 1756 x 1072 (1x), 51 MB; 2560 x 1440 at 2x, 1908 x 1153 (0.64x), 56 MB; 3840 x 2140 at 1x, 2227 x 1334 (0.5x, the floor), 68 MB. Without it, the 2560 box would have drawn about 5.3 million pixels.
