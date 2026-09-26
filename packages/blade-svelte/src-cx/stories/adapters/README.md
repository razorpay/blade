# Adapters

`packages/blade/adapters.ts` declares `BladeAdapters`. Styling is
not here: structural classes bind at build time through the theme condition
and runtime theming is CSS variables only.

| Adapter | Called by |
| --- | --- |
| `track(event, payload)` | Form on submit (`form_submit`), fields on first touch (`field_change`) |
| `haptics.warning` / `haptics.medium` | Button feedback on blocked and accepted presses |
| `fieldStore` | Fields mirror their value into it when present |
| `revealField(handle, name)` | Form after a failed submit, with the first invalid field's handle |
| `captureError(error)` | Anything the models reject with |

Call `provideAdapters` during init of a component above the Form; there is
no global registration.
