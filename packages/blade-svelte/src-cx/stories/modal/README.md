# Modal

The component is `packages/blade/components/modal/Modal.svelte` over the
`createDialog` model. Its styles (`components/modal/styles.ts`) own the
`variant`, `size` and `pace` axes, the enter/exit transitions and the close icon.
`size` is the desktop width: a fixed column by default, or `full` to span the
`OverlayStack` frame. On mobile every panel spans the viewport.

## Variants

`variant` is `modal` (default, centred), `sheet`, `drawer`, `left-drawer`,
`popover` or `menu`. The last two are anchored panels by a `trigger`
(below); the rest are surfaces on the layer stack. The sheet is Blade's
BottomSheet — the same modal (model, layer stack, focus, Escape, back),
anchored to the bottom edge with a handle and dragged down to dismiss. It
has one resting height (no snap points): a release dismisses after a
downward fling or past half the sheet's height, otherwise it settles back;
`onDismiss` reports the source `'drag'`. A sheet with
`isDismissible={false}` resists; a fling still reports `'drag'`, and it
settles back unless the handler calls `close`. The drag zone is the
handle strip plus the header (something interactive in the header still
clicks: the drag captures only once it moves); the gesture maths is the
pure `createSheetDrag` in `runes/layer`. On native the platform sheet does
its own drag and handle.

`variant` is the app's to pick: `sheet` or `modal` (centred, fading and
shrinking in place); no breakpoint switches it. Set it once for every Modal
through BladeProvider defaults (`{ Modal: { variant: 'sheet' } }`) — the
phone field's country picker follows them. Within a variant, the desktop
differences are `d:` classes (62.5rem and up).

`<BottomSheet>` is Modal with `variant` defaulting to `sheet`, passed
explicitly, so a provider's Modal defaults never change it. `drawer` is
Blade's Drawer: full height on the right edge, sliding in from it,
24px short of the screen's width on phones, 380px on desktop (`d`, 62.5rem) (`size` does not apply), as Blade DSL's Drawer (Figma);
`left-drawer` is the same on the left. `<Drawer>` is Modal with `variant`
defaulting to `drawer`.

## Trigger

`trigger` is a snippet with the control that opens the modal — a Button,
an IconButton — in a wrapper that opens it on a click (and, for a menu, on
ArrowDown or ArrowUp), so the control wires nothing; it receives `isOpen`
to read (a chevron that flips). The wrapper stamps `aria-haspopup`
(`dialog`, or `menu` for a menu), `aria-expanded` and, while open,
`aria-controls` on the control. Closing returns focus to it.

**Click only.** Nothing opens on hover: hover has no touch counterpart, and
checkout is mobile first, so React's `openInteraction="hover"` is not
ported. Tooltip is the one overlay that shows on hover, and it opens on a
tap where there is no pointer.

`trigger` is the exception to the rule that `children` is the trigger
(Tooltip's, Collapsible's): Modal's `children` is its raw body, as it was
before the anchored variants, and `openModal` renders it with no trigger.

## Popover and menu

`popover` is Blade's Popover: a non-modal panel by its trigger with an
arrow toward it, 16px round on the popup surface, at most 288px wide
(328px on desktop). The panel is a `dialog` named by its `title` (or
`accessibilityLabel`), with `leading` (a 20px glyph, or an asset), `body`
16px in, the close button in the title row (floating in the corner with no
title) and `footer`. `placement` defaults to `top`. Escape and a press
outside dismiss it (`onDismiss` with `escape` or `blur`); the page stays
live, with no scrim.

`menu` is Blade's Menu: the panel of actions by its trigger, 12px round,
240 to 400px wide, `placement` defaulting to `bottom-start`. The panel is
the `role="menu"`, and the ActionList inside it supplies the items: every
`ActionListItem` becomes a `menuitem` that acts and closes the menu, a
press reporting through the list's `onChange`; a link row navigates and
closes it; a `Divider` between rows is passed over by the keys. Opening
lands focus on the first row; arrows, Home and End move over the enabled
ones, typing jumps to a match, Enter or Space chooses. A menu has no close
button. There is no `Menu`, `MenuItem` or `Popover` component: these are
the variants.

Both need a `trigger`: the panel hangs from it. `size` does not apply.

```svelte
<Modal variant="menu" accessibilityLabel="Card actions">
  {#snippet trigger()}<IconButton icon={MoreHorizontalIcon} accessibilityLabel="Card actions" />{/snippet}
  {#snippet body()}
    <ActionList onChange={({ value }) => act(value)}>
      <ActionListItem value="edit" title="Edit" leading={EditIcon} />
      <ActionListItem value="remove" title="Remove" intent="negative" />
    </ActionList>
  {/snippet}
</Modal>
```

**No select dropdown.** A field that opens a floating list of options
(React's SelectInput, Dropdown, AutoComplete) is not ported by decision:
it is not mobile friendly. A pick is an ActionList on the page, or in a
`sheet` (or a `menu`, when the pick acts).

## Presentation

`presentation` is how `popover` and `menu` show: `anchored` (default),
floating by the trigger, or as a bottom `sheet`. It is a style prop, so
the app sets it once through BladeProvider defaults — the phone
presentation for every popover and menu, with no breakpoint logic in the
library (nothing reads the viewport):

```svelte
<BladeProvider defaults={{ Modal: { presentation: 'sheet' } }}>
```

As a sheet the same `trigger`, header, `body` and `footer` render through
the sheet surface — the scrim, the handle, drag to dismiss, the close
button — and `placement` is ignored. Semantics follow what shows: the
sheet is a `dialog`, and a menu's rows are plain buttons in it, not
`menuitem`s. Intent follows what was asked for: the trigger still promises
a `menu`, and the rows still act and close it. The other variants ignore
`presentation`.

## Dragging

`isDraggable` lets a sheet or a drawer be dragged away: a sheet down, by its
handle strip and header; a drawer toward its own edge, by its header (it has
no handle). A sheet shows its handle only while draggable, and without it
the close button sits where a modal's does. Defaults: `true` for `sheet`,
`false` for the drawers, as in Blade. It is a style prop, so BladeProvider
sets it too — `{ BottomSheet: { isDraggable: false }, Drawer: { isDraggable: true } }`, or `Modal` for every modal.

## Chrome

`chrome` is a full-width, zero-height box on the panel's top edge. The
panel does not clip it (its content box does the clipping, to the panel's
corners), and it moves with the panel through enter, exit and a drag. The
close button lives there, level with the title (or floating at the top edge
with no header), and so does a sheet's handle; the `chrome` snippet adds to
them, with `{ close }`. What goes in positions itself: above the panel
(`absolute bottom-full`, an illustration) or over it (`absolute top-*`). On
native the platform sheet draws its own handle and may clip what hangs above
it.

## Behaviour props

| Prop                                                          | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `trigger`, `placement`, `isDisabled`                          | See Trigger: the control that opens it, where a popover or menu sits against it, and whether it opens                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `isOpen`                                                      | Bindable; written `false` whenever the modal closes itself                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `onDismiss`                                                   | `({ source, close })` on every dismissal — `source` is `cross`, `blur`, `escape`, `back` or `drag` — whether or not it is dismissible. Dismissible: the modal closes right after the handler, and nothing prevents it. Not dismissible: it stays open until the handler (or anything later) calls `close`. Not fired for a snippet's `close` or when the host sets `isOpen = false`                                                                                                                                                                                                             |
| `isDismissible`                                               | Default `true`. Whether a dismissal closes it by itself, and whether the close button shows                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `role`                                                        | `modal` (default) or `alertdialog`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `title`, `subtitle`, `header`                                 | `title` is a string (Figma's Heading/SmallSemibold, 18/24, on a modal or drawer; Body/LargeSemibold, 16/24, on a sheet) or a snippet, and names the modal either way; `subtitle` is one muted line under it (Blade's body small) and describes the modal (`aria-describedby`); `header({ title, subtitle, close })` lays out the header: it receives the drawn title and subtitle as snippets and places them among its own content — a back button before the title, a badge beside it, a line under them. Render `title`, which names the modal. Without `header` the two render on their own |
| `chrome`                                                      | Things that hang off the panel; see Chrome                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `body`, `children`                                            | `body` renders in the component's padded, scrolling container; `children` render raw, owning their box, and win when both are given                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `footer`                                                      | The component's padded footer: actions in a row                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `showBackButton`, `onBackButtonClick({ close })`, `backLabel` | As in Blade's BottomSheetHeader, on every variant: a back button first in the header (a 20px chevron on the title line, 16px before what follows), named by `backLabel` (default `Back`). A step back, not a dismissal: no `onDismiss`. A header with only the back button still draws                                                                                                                                                                                                                                                                                                          |
| `{ close }`                                                   | `header`, `body`, `children`, `footer` and `chrome` all receive it for their own actions (Cancel, Done, a back button); it closes without a dismissal                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `closeLabel`                                                  | The close button's name, default `Close`. The button shows while the modal is dismissible, as in Blade: in the header, or floating at the top edge when there is none                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `accessibilityLabel`, `testID`, `class`                       | The only escape hatches; `class` is merged last onto the panel                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

| `leading` | Before the title, 8px from it: an icon (`leading={InfoIcon}`), drawn as a glyph on the title's 28px first line, or a snippet with an asset or avatar (Modal and BottomSheet) |
| `titleSuffix` | Beside the title, 8px from it: a Counter or a Badge |
| `trailing({ close })` | After the title block, 16px clear of it and of the close button: a Badge, text, a Link or an action (Modal and BottomSheet); a Link or an action (Drawer) |

### Why `leading`, `titleSuffix` and `trailing` are props

Blade DSL's headers (Figma's \_Modal Header, \_Bottom Sheet Header, \_Drawer
Header) space each part differently, so the header places them itself:

| Part                         | Gap  | Box                                                                                                    |
| ---------------------------- | ---- | ------------------------------------------------------------------------------------------------------ |
| leading item → title         | 8px  | an icon: a 20px glyph on the 28px title line; a snippet: Figma's 32px slot, centred on the title block |
| title → suffix               | 8px  | centred on the 28px title line                                                                         |
| title block → trailing item  | 16px | 28px tall                                                                                              |
| trailing item → close button | 16px | the close button is a 20px glyph in a 28px box, 24px from the top and the end                          |

The header itself is 20px above and beside, 16px above its hairline, at
every width on a modal, 12px under the handle strip on a sheet, and
20px all round with no hairline on a drawer. The footer's actions are 16px
under their hairline (20px on a drawer), 16px in (20px on desktop (`d`)). A Drawer's
leading item belongs to a detail block under its title, a pattern not
ported yet. A BottomSheet has no `size`: on desktop (`d`) it is the small column.

## Layers

Open modals register on the layer stack. One Escape listener
reaches only the top layer, lower layers go `inert`, and the app's back
handler calls `globalLayers.back()` before
its own navigation.

Mount one `<OverlayStack />` inside the frame modals must stay within (the
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
  variant: 'sheet',
});
const proceed = await handle.result; // true, or undefined when dismissed
```

`<OverlayStack />`, mounted once, renders them.

|                                 |                                                                                                                                                                                                                                          |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `openModal(component, options)` | `component` may be a **promise** (a dynamic `import()` works as is): the modal opens at once and shows its shimmer (`ModalPending.svelte`) until it arrives. A failed load closes it, calls `onLoadError` and the `captureError` adapter |
| options                         | `props`, `title`, `subtitle`, `closeLabel`, `pendingLabel`, `isDismissible`, `onDismiss({ source, close })`, `onLoadError`, `role`, `accessibilityLabel`, `testID`, `class`, plus Modal's style props (`variant`, `size`, `pace`)        |
| the component                   | gets one extra prop, `modal: { close(result?) }`                                                                                                                                                                                         |
| handle                          | `close(result?)`, `result` (settles once: the close value, `undefined` on a dismiss), `update(props)`                                                                                                                                    |

An entry leaves the DOM when its exit transition ends (Modal's new
`onClosed`), not after a guessed timeout. Nothing closes an open modal when
the code that opened it goes away: the handle is the owner.

## Pace

`pace="snappy"` is v2's quick-buy drawer timing (250ms, expo-out); the
default is 300ms ease-out. On native every variant is the platform's bottom
sheet; a `full`-size modal fills the screen.
