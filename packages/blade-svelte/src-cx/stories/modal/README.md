# Modal

The component is `packages/blade/components/modal/Modal.svelte` over the
`createDialog` model. Its styles (`components/modal/styles.ts`) own the
`placement`, `size` and `pace` axes, the enter/exit transitions and the close icon.
`size` is the desktop width: a fixed column by default, or `full` to span the
`LayerHost` frame. On mobile every panel spans the viewport.

## Bottom sheet

`<BottomSheet>` is Modal with `look={bottomSheetLook}` (`components/bottom-sheet/styles.ts`;
`look` is a library-internal prop that replaces the modal's resolver, not an axis): the same modal — model, layer
stack, focus, Escape, back — anchored to the bottom edge with a handle, and
dragged down to dismiss. It has one resting height (no snap points): a
release dismisses after a downward fling or past half the sheet's height,
otherwise it settles back; `onDismiss` reports the source `'drag'`. A sheet
with `isDismissible={false}` resists and settles. It is always at the
bottom — `placement` applies to a modal with no look. The drag zone is the
handle strip plus the header (the close button stays outside it, and a press
on something interactive in a custom title still clicks); the gesture maths is the pure `createSheetDrag` in `runes/layer`.
On native the platform sheet does its own drag and handle.

`adaptive` makes it that sheet on phones and a modal on desktop: one
surface, switched at the styles' breakpoint (the `d:` screen). Above it the
handle is hidden and the drag zone is plain content — the styles hand the
core the media query the drag is confined to. The desktop modal is centred,
fading and shrinking in place instead of sliding; `placement="bottom"` keeps
it on the bottom edge instead, a handle-less panel rising from the host's
foot (the payment sheet). The phone field's country picker opens the centred
one (`openModal({ look: bottomSheetLook, adaptive: true })`).

## Behaviour props

| Prop | Notes |
| --- | --- |
| `isOpen` | Bindable; the modal closes itself on a dismiss, then reports it |
| `onDismiss` | `(source)` — `cross`, `blur`, `escape`, `back` or `programmatic`; not fired when the host sets `isOpen = false` |
| `isDismissible` | `false` ignores the backdrop, Escape and back; the close button still closes |
| `onBack` | The content may own back: `true` handled, `false` cede (closes even when not dismissible), `undefined` no opinion |
| `role` | `modal` (default) or `alertdialog` |
| `title`, `header` | `title` is a string or a snippet and names the modal either way; `header` is the rest of the header under it (a subtitle). Both sit in the component's padded header |
| `body`, `children` | `body` renders in the component's padded, scrolling container; `children` render raw, owning their box, and win when both are given. Each receives `{ close }` for the content's own actions |
| `footer` | The component's padded footer: actions in a row |
| `closeLabel` | The close button's localized name — the library ships no copy. No label, no button |
| `accessibilityLabel`, `testID`, `class` | The only escape hatches; `class` is merged last onto the panel |

## Layers

Open modals register on the layer stack. One Escape listener
reaches only the top layer, lower layers go `inert`, and the app's back
handler calls `globalLayers.back()` (or the `provideLayers()` instance) before
its own navigation.

Mount one `<LayerHost />` inside the frame modals must stay within (the
checkout modal card). Modals render into it, and everything beside the host
is `inert` while a modal is open. The host owns the one scrim under every
open modal: stacked modals share it, it fades in with the first panel and
out with the last, and a tap on it closes the top modal only. Without a
host a modal renders in place, unscrimmed.

## Web and native

`Modal.svelte` touches no DOM. Presence, the portal, focus and the Tab trap
live in `components/layer/Surface.svelte`; on native `Surface.native.svelte`
renders the platform's `native-bottom-sheet`, which owns all of that itself and
reports a user dismissal as a request the modal model decides.

## Why not `<modal>`

The top layer is viewport-level, so a native modal dialog would escape the
checkout card on desktop; it also needs Safari 15.4 and cannot mix with the
z-index overlays v2 still renders. The focus trap, host and Escape wiring are
internal to the component, so a later swap changes no props.

## Presence

Svelte's `transition:` keeps the node mounted until the exit ends and reverses
an interrupted open. The visuals are the component's CSS transitions keyed on the
root's `data-state`; the core only flips that attribute and reports the
longest computed transition, so `motion-reduce:transition-none` unmounts
immediately.

## Opening from code: `openModal`

Flows that live in `.ts` files cannot render markup, so they open a modal
imperatively. `openModal` renders the same `Modal` — layer stack, inert
page, focus, presence, the bottom-sheet drag and the native sheet all come
with it; there is no `zIndex`, stacking is open order.

```ts
const handle = openModal(RedirectNotice, {
  props: { bank },
  title: $t('redirecting'),
  closeLabel: $t('close'),
  look: bottomSheetLook,
});
const proceed = await handle.result; // true, or undefined when dismissed
```

Mount `<ModalStack />` once, beside `<LayerHost />`.

| | |
| --- | --- |
| `openModal(component, options)` | `component` may be a **promise** (a dynamic `import()` works as is): the modal opens at once and shows its shimmer (`ModalPending.svelte`) until it arrives. A failed load closes it, calls `onLoadError` and the `captureError` adapter |
| options | `props`, `title`, `closeLabel`, `pendingLabel`, `isDismissible`, `onBack`, `onDismiss(source)`, `onLoadError`, `role`, `accessibilityLabel`, `testID`, `class`, plus Modal's style props (`placement`, `size`, `pace`), `look` (`bottomSheetLook`) and the sheet's `adaptive` |
| the component | gets one extra prop, `modal: { close(result?) }` |
| handle | `close(result?)`, `result` (settles once: the close value, `undefined` on a dismiss), `update(props)` |
| `provideOverlays()` / `getOverlays()` | A stack of its own for an embedded surface or a test; `openModal` uses the page's global one |

An entry leaves the DOM when its exit transition ends (Modal's new
`onClosed`), not after a guessed timeout. Nothing closes an open modal when
the code that opened it goes away: the handle is the owner.

## Placement and pace

`placement`: `center`, `bottom`, `top`, `left`, `right`, `full` — each parks
the closed panel off its own edge. `pace="snappy"` is v2's quick-buy drawer
timing (250ms, expo-out); the default is 300ms ease-out. On native every
placement but `full` is the platform's bottom sheet.
