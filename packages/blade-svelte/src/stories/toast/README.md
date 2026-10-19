# Toast

`src/components/toast/`: `toasts.ts` (`showToast`, `createToasts`,
`getToasts`), `ToastContainer.svelte` (Blade's ToastContainer: the stack,
rendered once by the app) and `Toast.svelte` (one toast, not exported). The queue and the model are runes:
`createToastQueue` and `createToastsModel` in `src/runes/toast/`.

```svelte
<BladeProvider>
  <App />
  <ToastContainer />
</BladeProvider>
```

```ts
const request = createCancel();
const reason = await showToast(
  {
    content: 'Card removed',
    color: 'neutral',
    leading: { image: bankLogo, alt: 'HDFC Bank' },
    // A returned promise shows the action busy until it settles.
    action: { text: 'Undo', onClick: async () => { await restore(); request.cancel(); } },
  },
  { cancelled: request.cancelled }, // resolving it dismisses the toast
); // timeout | dismiss | evicted | cleared
```

| Option                 | Notes                                                                                                                                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content`              | What it says. Or pass a string to `showToast`                                                                                                                                                                 |
| `color`                | Style axis (the shared intents); `negative` is a `role="alert"` (assertive), the rest `status` (polite)                                                                                                       |
| `duration`             | ms; default the stack's (`defaults.ToastContainer.duration`), 4000                                                                                                                                            |
| `autoDismiss`          | `false`: it stays until dismissed                                                                                                                                                                             |
| `leading`              | Before the content, as data: an icon (`IconSource`) in place of the colour's default glyph, or an image (`{ image, alt? }`, a bank's logo, 20px), as Figma's leading item is an icon or an asset. Without it, the colour's glyph |
| `action`               | One inline button (`{ text, onClick }`); an `onClick` returning a promise shows it busy until it settles (a rejection goes to `adapters.reportError`). Pressing it does not dismiss — resolve `cancelled` |
| `closeLabel`           | The dismiss button's name, default `Dismiss toast`                                                                                                                                                            |
| `onDismissButtonClick` | The dismiss button was pressed                                                                                                                                                                                |
| `onDismiss(reason)`    | Same reason `showToast`'s promise resolves with                                                                                                                                                               |

`showToast(toast, { cancelled }?)` returns a `Promise<ToastDismissReason>`
that never rejects. `cancelled` is a plain `Promise<void>` (no
`AbortSignal`: older engines lack one, and it can't cross a bridge);
`createCancel()` gives `{ cancelled, cancel(), isCancelled }`. Its resolving
dismisses the toast (`dismiss`), once; one resolved already is dismissed on
the next microtask, before it paints, so check `isCancelled` and don't show
it at all.

`showToast` adds to the page's queue (`globalToasts`). The public `Toasts`
type is just `{ showToast }`. A queue of the app's own (`createToasts()`)
goes in as BladeProvider's `adapters.toasts`, and the app calls its
`showToast`; an object of the app's own with a `showToast` goes in the same
way, and a ToastContainer renders nothing for it (the app shows its toasts
its own way). `getToasts()` reads the nearest provider's, else the page's.
The app renders a ToastContainer once, inside BladeProvider, as Blade
React's: it shows the queue `getToasts()` finds when it mounts, its
`accessibilityLabel` (default `Notifications`) names the region and
`placement` (or `defaults={{ ToastContainer: { placement } }}`) places it.
Toasts that should land on a nested provider's own queue need a
ToastContainer under that provider; two containers on one queue show it
twice. Without a ToastContainer, no toast code ships: BladeProvider does
not import it. The stack brings its numbers (capacity 3, duration 4000). A
toast shown before any container mounts waits, its timer held, and shows
once one does. Hover or focus inside the stack holds every timer.

The motion is Blade's. A toast slides in from the stack's edge over 480ms
(entrance curve) and out over 280ms (exit curve), fading both ways. The
newest toast sits in front at the edge; on desktop up to three stack edge to
edge with a 12px gutter, and past that the older ones collapse behind the
front one — each peeking 12px, 5% smaller, cropped to the front toast's
height, three deep — until a hover expands them; on a phone the stack
collapses past one toast and a tap expands it. Either also holds the timers.
Every move takes 480ms on the standard curve (`layoutToastStack` in `runes/toast/stack-layout.ts`
does the maths; the numbers are `resolveToastContainer`'s). Toasts render into the overlay host — over open modals — but push no
layer: nothing goes inert, focus stays where it is, Escape is not theirs.

## Why `leading` is an option

The toast lays out one row itself, spaced as Blade DSL's Toast (Figma): 12px
in at the sides and 8px above and below, the leading item (an icon, or an
asset in its place) 8px before the content, and the content 12px before the
action or the dismiss cross, which sit 12px apart. `leading` is one option
with two shapes, both data (a toast is shown from a `.ts` call, so it takes
no snippet), and the toast places each: an icon draws as its glyph, an
image goes in the glyph's place.

|                             | Spacing |
| --------------------------- | ------- |
| Edge → leading item         | 12px    |
| Leading item → content      | 8px     |
| Content → action (or cross) | 12px    |
| Action → cross              | 12px    |
