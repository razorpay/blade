# Badge

A small status label: Blade's Badge.

| Prop | Notes |
| --- | --- |
| `color` | `neutral` (default), `information`, `positive`, `notice`, `negative`, `primary` |
| `emphasis` | `subtle` (default: tinted, medium weight) or `intense` (filled, white, regular weight) |
| `size` | `small` (16px), `medium` (20px, default), `large` (24px): the sizes Blade DSL's Badge (Figma) draws |
| `icon` | A glyph token before the label, in its colour: 8px up to `small`, 12px above |
| `children` | The label: text |
| `class`, `testID` | As everywhere |

The label is one line. When its container cuts it off, it carries the full
text as a `title`, as Blade's does.

## Why `icon` is a prop

The badge places the icon itself, because Figma spaces it differently from
the label. The label's own side spacing (2px at small, 4px at medium and
large) is the icon-to-text gap, and also its inset when there is no icon. So:

| Size | Text only (left / right) | With an icon (icon inset / gap / right) |
| --- | --- | --- |
| small | 6 / 6 | 4 / 2 / 6 |
| medium | 8 / 8 | 4 / 4 / 8 |
| large | 12 / 12 | 8 / 4 / 12 |

A leading icon sits one gap closer to the edge than text would. That is an
optical correction CSS can't make for an icon placed in `children`, so the
icon has its own prop.

API parity with Blade React: see `src-cx/API-PARITY.md`.
