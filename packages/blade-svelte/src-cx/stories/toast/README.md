# Toast

`packages/blade/components/toast/`: `toasts.ts` (`showToast`, the queue
over `createToasts`, in `packages/blade/runes/toast/`),
`ToastStack.svelte` (the host) and `Toast.svelte` (one toast;
`Toast.native.svelte` is its twin).

```ts
const toast = showToast({ message: 'Card removed', color: 'neutral',
  action: { label: 'Undo', onPress: restore } });
toast.dismissed.then((reason) => …); // timeout | dismiss | evicted | cleared
```

| Option | Notes |
| --- | --- |
| `message` | Or pass a string to `showToast` |
| `color` | Style axis (the shared intents); `negative` is a `role="alert"`, the rest `status` |
| `duration` | ms; `0` stays until dismissed; the default (blade 4000) when omitted |
| `icon` | Decorative |
| `action` | One inline button; pressing it dismisses |
| `closeLabel` | The dismiss button's localized name — the library ships no copy. No label, no button; with one, a hairline and the cross follow the action |
| `onDismiss(reason)` | Same reason the handle's promise settles with |

Mount one `<ToastStack placement accessibilityLabel />` beside the `LayerHost`.
The stack brings the default numbers (capacity 3, duration), so `showToast`
before it mounts shows nothing. Hover or focus inside the stack holds every
timer.

The motion is Blade's. A toast slides in from the stack's edge over 480ms
(entrance curve) and out over 280ms (exit curve), fading both ways. The
newest toast sits in front at the edge; on desktop up to three stack edge to
edge with a 12px gutter, and past that the older ones collapse behind the
front one — each peeking 12px, 5% smaller, cropped to the front toast's
height, three deep — until a hover expands them; on a phone the stack
collapses past one toast and a tap expands it. Either also holds the timers.
Every move takes 480ms on the standard curve (`layoutToastStack` in `runes/toast/stack-layout.ts`
does the maths; the numbers are `resolveToastStack`'s). Native flows the
toasts in a column instead. Toasts render into the LayerHost — over open modals — but push no
layer: nothing goes inert, focus stays where it is, Escape is not theirs.
`provideToasts()` gives an embedded surface its own queue.
