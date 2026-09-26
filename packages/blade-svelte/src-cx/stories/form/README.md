# Form

`packages/blade/components/form/Form.svelte` creates the `createForm`
model and provides it through context. Fields call `setupField` to register;
Buttons read the model to validate and submit.

## Props

| Prop | Notes |
| --- | --- |
| `name` | Form name, also the analytics payload key |
| `validator` | `(data) => errors`, sync or async, merged with declarative constraint errors |
| `onSubmit` | Runs after validation passes; a returned promise drives `submitting` |
| `onValidationFailed` | `(errors)` — a submit or validate attempt found errors, from any button inside or the Enter key; the first invalid field is revealed either way |
| `onInput` | Receives the data on every field edit |
| `formatConstraintError` | Maps `required` / `pattern` / `email` to copy (the app passes `$t`) |
| `children` | Snippet receiving the live `FormState` |

## Submission paths

A submit Button drives the model itself and cancels the native submit.
Enter in a field is the only path through the form element's `submit` event,
and it reaches the same `form.submit` with `source: 'enter'`.
