# Badge

A small status label: Blade's Badge.

| Prop | Notes |
| --- | --- |
| `color` | `neutral` (default), `information`, `positive`, `notice`, `negative`, `primary` |
| `emphasis` | `subtle` (default: tinted, medium weight) or `intense` (filled, white, regular weight) |
| `size` | `xsmall` (14px), `small` (16px), `medium` (20px, default), `large` (24px) |
| `icon` | Icon data before the label, in its colour: 8px up to `small`, 12px above |
| `children` | The label: text |
| `class`, `testID` | As everywhere |

The label is one line. When its container cuts it off, it carries the full
text as a `title`, as Blade's does.

API parity with Blade React: see `src-cx/API-PARITY.md`.
