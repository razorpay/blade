# Alert

`packages/blade/components/alert/Alert.svelte` has a behaviour model behind it
since it dismisses and carries actions.

| Prop | Notes |
| --- | --- |
| `color` | Style axis: `neutral`, `information`, `positive`, `notice`, `negative`. `negative` and `notice` announce as `role="alert"`, the rest as `role="status"` |
| `isOpen` | Default `true`. Toggling it slides the alert open and shut (its own ms; none under reduced motion) — what v2's `ErrorMessage` and the callouts did by hand |
| `title` | Optional heading line |
| `children` | The description |
| `icon` | Icon data (`icons.info`, or any `?raw` SVG) before the text; decorative |
| `actions` | A snippet under the description: Links or Buttons |
| `closeLabel`, `onDismiss` | The dismiss button exists only when it has a name. It reports; the owner sets `isOpen` |
| `class`, `testID` | As everywhere |

A field's own error line is not an Alert: TextInput and the Form own that.
