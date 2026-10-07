# NavStack

`packages/blade/components/nav-stack/`: `NavStack.svelte` (the host) and
`NavScreen.svelte` (the platform leaf: presence, the slide, focus;
`NavScreen.native.svelte` is its twin), over `packages/blade/runes/nav-stack/nav.ts`
(the stack, over `createLayerStack`). Screens only — overlays are
`openModal`/`ModalStack`.

## Pushing

```ts
const handle = pushScreen(import('./Otp.svelte'), {
  props: { phone },
  name: 'otp',
  meta: { title: 'Verify' },
});
handle.result.then((otp) => …); // what the screen popped with
```

| API | Notes |
| --- | --- |
| `push(component \| Promise, { props, name, meta, onBack, onLoadError })` | Returns `{ result, pop, popAfter, close, onBack, update }` |
| `replace(…)` | Pushes, then drops every other screen once the new one can render |
| `pop()`, `popTo(name)`, `clear()` | `pop` keeps the root screen |
| `back()` | Open layers answer first, then the top screen's `onBack`, then the stack pops; `false` at the root |
| `entries`, `direction` | Signals; the app's header, breadcrumbs and analytics read them |
| `provideNav()` / `getNav()` / `globalNav` | An embedded surface provides its own; `pushScreen` uses the global one |

The pushed component gets a `screen` prop: `pop(result?)`, `popAfter()`,
`close()`, and `onBack(handler)` for a veto it owns (answer `true`, pop later).

One screen is mounted at a time, so a covered screen's local state is gone when
it returns. A promised screen joins the stack at once but shows only when it
has loaded: the current screen stays (`aria-busy` on the root) and there is one
slide. A failed load removes the entry and goes to `onLoadError` and
`adapters.captureError`.

## What stays in the app

The header and its back button, titles (`meta`), breadcrumbs, `popstate` and the
SDK back bridge (both call `nav.back()`), and what back means at the root.

## Motion

The core stamps `data-state` and `data-side="ahead" | "behind"` on the two
screens of a change, the direction read when the transition starts. Blade: a
full slide on mobile, a 20px drift with a fade from the `d` breakpoint; 400ms
in, 350ms out. The first screen on show does not slide.

## Screen

Style-only blade components: `Screen` is the scrolling, width-capped page
(`isDisabled`, `padding`, a `footer` snippet pinned under the scrolling
content: a `BottomBar` in this story).
