# Icon button

A button whose whole content is one glyph. It is a separate component from
`Button`, not `Button` without children, for three reasons: the accessible
name must be **required** (the glyph is decorative), the look has different
axes (a glyph, optionally in a box), and by default a press leaves the enclosing Form
alone (`type="button"`).

The behaviour is Button's, shared through
`runes/button/press.svelte.ts`: async `onClick` keeps it busy, a busy
button stays focusable and swallows presses, `type="submit"` submits the Form
(`validateForm` only validates it), and a blocked press shakes.

| Prop | Notes |
| --- | --- |
| `icon` | An icon import, e.g. `CloseIcon` from `@razorpay/blade-svelte/icons`. The button sizes it |
| `accessibilityLabel` | Required, localized |
| `onClick` | May return a promise: busy until it settles |
| `isLoading`, `isDisabled` | As on Button |
| `type`, `validateForm` | `button` (default) or `submit`; `validateForm` as on Button |
| `loadingAnnouncement` | Localized; announced while busy |
| `variant` | Style axis: `plain` (default) or `boxed` (v2's MiniButton) |
| `size` | Style axis: `small`/`medium`/`large` — 12/16/20px glyphs; the button is the glyph unless highlighted |
| `class`, `testID` | As everywhere |

The box is always larger than the glyph so the tap target is never just the
drawing. Where the box should not take room (a close button flush with a
corner), pull it in with a negative margin through `class`.
| `emphasis` | `intense` (default: a gray glyph, for light surfaces) or `subtle` (white, for dark ones): the two Blade DSL's Icon Button (Figma) draws |
| `size` | The glyph: `small` 12px, `medium` 16px (default), `large` 20px |
| `isHighlighted` | A box behind the glyph on hover and focus: 24px round at 8px (small) or 32px round at 12px (medium), as Figma; not at `large` |

API parity with Blade React: see `src-cx/API-PARITY.md`.
