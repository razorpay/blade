# Alert

An inline message: an icon, an optional title, a description, and a dismiss
button. Blade's Alert in its full-width form, less `actions`: it spans its
container (a width is the caller's `class`), and from 768px the content
centres on the row.

| Prop | Notes |
| --- | --- |
| `description` | Required. Text, or a snippet (a Link at most) |
| `title` | Optional heading line |
| `color` | `neutral` (default), `information`, `positive`, `notice`, `negative`, `primary`. `negative` and `notice` announce as `role="alert"` (`notice` politely), the rest as `role="status"` |
| `emphasis` | `subtle` (default: the colour's tinted fill, gray text) or `intense` (the colour's solid fill, white everything) |
| `icon` | Icon data before the text; defaults to the colour's (info, check-circle, alert-triangle, alert-octagon) |
| `isDismissible`, `onDismiss` | Default `true`: a dismiss button that reports, then closes the alert |
| `isOpen` | Bindable, default `true`. Dismissing sets it `false` and slides the alert shut (none under reduced motion); set it back to show it again |
| `closeLabel` | The dismiss button's name; default `Dismiss alert` |
| `class`, `testID` | As everywhere |

A field's own error line is not an Alert: TextInput and the Form own that.

API parity with Blade React: see `src-cx/API-PARITY.md`.
