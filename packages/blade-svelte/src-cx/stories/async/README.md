# Async

`packages/blade/components/async/Async.svelte`: renders `children(value)`
once `promise` resolves, `failed(error)` if it rejects, and a pending state in
between — but only after `pendingDelay` ms (the default when unset;
blade 150), so a fast load never flashes it.

| Prop | Notes |
| --- | --- |
| `promise` | The effect is keyed on it alone: the same promise is never re-awaited, a new one starts over and the old can no longer land |
| `pending` | Replaces the `asyncPending` snippet (blade: `lines` shimmer lines) |
| `pendingLabel` | Localized; the wait is a `role="status"` named by it |
| `failed` | Without it a failure renders nothing |
| `onError` | Also reported to `adapters.captureError` |
