# Alert

An inline message: an icon, an optional title, a description, and a dismiss
button. Blade's Alert in its full-width form, less `actions`: it spans its
container (a width is the caller's `class`), and from 768px the content
centres on the row.

| Prop | Notes |
| --- | --- |
| `description` | Required. Text, or a snippet (a Link at most) |
| `title` | Optional heading line: text, or a snippet in the title's box |
| `color` | `neutral` (default), `information`, `positive`, `notice`, `negative`, `primary`. `negative` and `notice` announce as `role="alert"` (`notice` politely), the rest as `role="status"` |
| `emphasis` | `subtle` (default: the colour's tinted fill, gray text) or `intense` (the colour's solid fill, white everything) |
| `icon` | A glyph token before the text, e.g. `WalletIcon` from `@razorpay/blade-svelte/icons`; defaults to the colour's (`InfoIcon`, `CheckCircleIcon`, `AlertTriangleIcon`, `AlertOctagonIcon`) |
| `isDismissible`, `onDismiss` | Default `true`: a dismiss button that reports, then closes the alert |
| `isOpen` | Bindable, default `true`. Dismissing sets it `false` and slides the alert shut (none under reduced motion); set it back to show it again |
| `closeLabel` | The dismiss button's name; default `Dismiss alert` |
| `class`, `testID` | As everywhere |

## Why `icon` is a prop

The alert places the icon itself, because Blade DSL's full-width Alert
(Figma) spaces it apart from the text: the 16px icon sits in a 20px box, so
it lines up with the title's first line (2px down), 8px before the text
column, and the text column ends 12px before the dismiss button. The box
pads 12px all round.

| | Spacing |
| --- | --- |
| Edge → icon | 12px (2px lower than the text with a title) |
| Icon → text | 8px |
| Text → dismiss | 12px |
| Without an icon | none: every colour has one, so the slot is never empty |

A field's own error line is not an Alert: TextInput and the Form own that.

API parity with Blade React: see `src-cx/API-PARITY.md`.
