# Image

`packages/blade/components/image/Image.svelte`. The box is the root and has
no size of its own: pass it by `class`.

| Prop | Notes |
| --- | --- |
| `src` | A URL, SVG markup, or a promise of either (`import('./logo.svg?raw')`); `undefined` goes straight to the stand-in |
| `alt` | Required; empty for decoration. Its first character is the default stand-in, named by the whole `alt` |
| `fallback` | A snippet that replaces the initial |
| `isPendingShown` | Marks the wait for a promised source (blade: a shimmer) |
| `onLoad`, `onError` | A rejected promise is also reported to `adapters.captureError` |

Markup is rendered through a data-URI `<img>`, never as HTML, so a source the
app did not bundle cannot inject script — and it does not take `currentColor`.
A themed glyph is an `Icon`.
