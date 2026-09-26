# Icon button

A button whose whole content is one glyph. It is a separate component from
`Button`, not `Button` without children, for three reasons: the accessible
name must be **required** (the glyph is decorative), the look has different
axes (a box around a glyph), and by default a press leaves the enclosing Form
alone (`type="button"`).

The behaviour is Button's, shared through
`runes/button/press.svelte.ts`: async `onClick` keeps it busy, a busy
button stays focusable and swallows presses, `type="submit"` submits the Form
(`validateForm` only validates it), and a blocked press shakes.

| Prop | Notes |
| --- | --- |
| `icon` | Icon data: `icons.close`, or any `?raw` SVG. The button sizes it |
| `accessibilityLabel` | Required, localized |
| `onClick` | May return a promise: busy until it settles |
| `isLoading`, `isDisabled` | As on Button |
| `type`, `validateForm` | `button` (default) or `submit`; `validateForm` as on Button |
| `loadingAnnouncement` | Localized; announced while busy |
| `variant` | Style axis: `plain` (default) or `boxed` (v2's MiniButton) |
| `size` | Style axis: `small`/`medium`/`large` — 24/32/40px boxes around 12/16/20px glyphs |
| `class`, `testID` | As everywhere |

The box is always larger than the glyph so the tap target is never just the
drawing. Where the box should not take room (a close button flush with a
corner), pull it in with a negative margin through `class`.
