# Modal

Five overlays, each its own component with its own props and provider
defaults, over the same runes (`createOverlay`, over the `createDialog`
model): the layer stack, focus, Escape, back and presence. There is no base
component and no `layout` switch: Modal, BottomSheet and Drawer render a
surface on the layer stack, Popover and Menu a panel by their trigger.

| Component     | Shape                                                                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Modal`       | The centred dialog. `size` is its desktop width: a fixed column by default, or `full` to span the overlay host's frame. On mobile it spans the viewport |
| `BottomSheet` | On the bottom edge, with a handle and a drag down to dismiss                                                                                            |
| `Drawer`      | Full height on an edge: `side` is `right` (default) or `left`                                                                                           |
| `Popover`     | A non-modal panel by its trigger (`children`), with an arrow                                                                                                       |
| `Menu`        | Menu's look by its trigger (`children`), with no close button                                                                                                      |

There is no `variant`: the component is the shape. Each owns its styles
(`resolveModal`, `resolveBottomSheet`, `resolveDrawer`, `resolvePopover`,
`resolveMenu`); `components/modal/styles.ts` holds what the surfaces share
(the pace, the chrome, the close buttons).

Every overlay binds `isOpen` and reports `onOpenChange({ isOpen })` for
the opens and closes it makes itself — Popover's and Menu's trigger, a
dismissal, `close` — not for a change its owner makes to `isOpen`.

## Sheet and drawer

`BottomSheet` is Blade's BottomSheet: the same modal (model, layer stack,
focus, Escape, back), anchored to the bottom edge with a handle and dragged
down to dismiss. It has one resting height (no snap points): a release
dismisses after a downward fling or past half the sheet's height, otherwise it
settles back; `onDismiss` reports the source `'drag'`. A sheet with
`isDismissible={false}` resists; a fling still reports `'drag'`, and it
settles back unless the handler calls `close`. The drag zone is the handle
strip plus the header (something interactive in the header still clicks: the
drag captures only once it moves); the gesture maths is the pure
`createSheetDrag` in `runes/layer`.

`Drawer` is Blade's Drawer: full height on the right edge (`side="left"`: the
left), sliding in from it, 24px short of the screen's width on phones and
380px on desktop (`d`, 62.5rem), as Blade DSL's Drawer (Figma). `isDraggable`
drags it toward its edge.

Each reads only its own provider defaults (`Modal`, `BottomSheet`, `Drawer`,
…): a provider's Modal defaults never turn a BottomSheet into anything else.
Within a component, the desktop differences are `d:` classes (62.5rem and up).

## Trigger

Modal, BottomSheet and Drawer have no trigger: they open from code — a
bound `isOpen` (the app's Button sets it), or an opener such as libui's
`openModal()`. Closing returns focus to whatever had it when the overlay
opened, the button that opened it included.

Popover and Menu hang from theirs, so they need one: `children` is a
snippet with the control that opens the panel — a Button, an IconButton —
in a wrapper that opens it on a click (and, for a menu, on ArrowDown or
ArrowUp), so the control wires nothing; it receives `isOpen` to read (a
chevron that flips). The wrapper stamps `aria-haspopup` (`dialog`),
`aria-expanded` and, while open, `aria-controls` on the control. Closing
returns focus to it; `isDisabled` keeps it from opening.

**Click only.** Nothing opens on hover: hover has no touch counterpart, and
checkout is mobile first, so React's `openInteraction="hover"` is not
ported. Tooltip is the one overlay that shows on hover, and it opens on a
tap where there is no pointer.

Popover and Menu follow the rule that `children` is the trigger and
`content` what it reveals (as Tooltip, Collapsible and a CardGroupItem do).
Modal, BottomSheet and Drawer have no trigger, so `children` is their
content.

## Popover and menu

`Popover` is Blade's Popover: a non-modal panel by its trigger with an
arrow toward it, 16px round on the popup surface, at most 288px wide
(328px on desktop). The panel is a `dialog` named by its `title` (or
`accessibilityLabel`), with `leading` (a 20px glyph, or an asset), `body`
16px in, the close button in the title row (floating in the corner with no
title) and `footer`. `placement` defaults to `top`. Escape and a press
outside dismiss it (`onDismiss` with `escape` or `blur`); the page stays
live, with no scrim. `initialFocusRef` takes focus on open in place of
the close button.

`Menu` has Blade's Menu look: the panel by its trigger, 12px round, 240 to
400px wide, `placement` defaulting to `bottom-start`, with no close button.
ArrowDown or ArrowUp on the closed trigger opens it. The panel is a
`dialog`, and Modal is not coupled to what goes inside. An ActionList inside
is an ordinary choice list (radios, its own keyboard) whose `onPick` calls
the body's `close`. A link row closes it from its `onClick`. Opening lands
focus on the first focusable element, the list's tab stop. There is no
`MenuItem`: the rows are the app's content.

Both need a trigger (`children`): the panel hangs from it; raw content
that owns its box goes in `content`, in place of `body` and `footer`. `onOpenChange({ isOpen })`
reports every open and close, whoever asked. Neither takes `pace`; Menu
takes no `role` or `closeLabel` (it has no close button). A ButtonGroup
around either does not reach the Buttons inside the panel.

```svelte
<Menu accessibilityLabel="Card actions">
  {#snippet children()}<IconButton icon={MoreHorizontalIcon} accessibilityLabel="Card actions" />{/snippet}
  {#snippet body({ close })}
    <ActionList onPick={({ value }) => { act(value); close(); }}>
      <ActionListItem value="edit" title="Edit" leading={EditIcon} />
      <ActionListItem value="remove" title="Remove" intent="negative" />
    </ActionList>
  {/snippet}
</Menu>
```

**No select dropdown.** A field that opens a floating list of options
(React's SelectInput, Dropdown, AutoComplete) is not ported by decision:
it is not mobile friendly. A pick is an ActionList on the page, or in a
BottomSheet or a Menu.

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
(`absolute bottom-full`, an illustration) or over it (`absolute top-*`).

## Behaviour props

Modal, BottomSheet and Drawer take these, and their content is composed (see Parts):

| Prop                                    | Notes                                                                                                                                                                                                                                                                                                                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isOpen`                                | Bindable; written `false` whenever the overlay closes itself                                                                                                                                                                                                                                                                                                                 |
| `onClosed`                              | The exit finished and the overlay left the DOM, whoever closed it                                                                                                                                                                                                                                                                                                            |
| `initialFocusRef`                       | An element inside, bound with `bind:this`, that takes focus on open in place of the panel                                                                                                                                                                                                                                                                                    |
| `onDismiss`                             | `({ source, close })` on every dismissal — `source` is `cross`, `blur`, `escape`, `back` or `drag` — whether or not it is dismissible. Dismissible: it closes right after the handler, and nothing prevents it. Not dismissible: it stays open until the handler (or anything later) calls `close`. Not fired for a snippet's `close` or when the host sets `isOpen = false` |
| `isDismissible`                         | Default `true`. Whether a dismissal closes it by itself, and whether the close button shows                                                                                                                                                                                                                                                                                  |
| `role`                                  | `dialog` (default) or `alertdialog`                                                                                                                                                                                                                                                                                                                                          |
| `children({ close })`                   | The content: the overlay's header, body and footer parts, or anything that owns its box. `close` closes without a dismissal                                                                                                                                                                                                                                                  |
| `chrome({ close })`                     | Things that hang off the panel; see Chrome                                                                                                                                                                                                                                                                                                                                   |
| `closeLabel`                            | The close button's name, default `Close`. The button shows while the overlay is dismissible: level with the header's title, or floating at the top edge when there is no header                                                                                                                                                                                              |
| `accessibilityLabel`, `testID`, `class` | `accessibilityLabel` names an overlay whose header has no title; `class` is merged last onto the panel                                                                                                                                                                                                                                                                       |

Popover and Menu keep the content as props and snippets
(`title`, `subtitle`, `leading`, `titleSuffix`, `trailing`, `header`, `body`,
`footer`, `padding`, and the back button), drawn in the look of the layout that shows.

## Parts

Modal, BottomSheet and Drawer compose their content from parts, as Blade
React spells them. Each part is its own component over its own classes, and
the classes are exported apart:

| Overlay     | Parts                                                                                                                                                                                            | Classes                                                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Modal       | `ModalHeader` (`title`, `subtitle`, `leading`, `titleSuffix`, `trailing`), `ModalBody` (`padding`: `spacing.6` or `spacing.0`), `ModalFooter`                                                    | `resolveModalHeader()`, `resolveModalBody({ padding })`, `resolveModalFooter()`                                         |
| BottomSheet | `BottomSheetHeader` (Modal's, plus `showBackButton`, `onBackButtonClick`, `backLabel`, `children` under the row), `BottomSheetBody` (`padding`: `spacing.5` or `spacing.0`), `BottomSheetFooter` | `resolveBottomSheetHeader({ hasHandle })`, `resolveBottomSheetBody({ padding })`, `resolveBottomSheetFooter()`          |
| Drawer      | `DrawerHeader` (Modal's, plus `color`, `showDivider`, `children`), `DrawerBody` (`padding`: `spacing.6` or `spacing.0`, as ModalBody's; React's has none), `DrawerFooter` (`showDivider`)        | `resolveDrawerHeader({ color, showDivider })`, `resolveDrawerBody({ padding })`, `resolveDrawerFooter({ showDivider })` |

```svelte
<BottomSheet bind:isOpen>
  <BottomSheetHeader title="Confirm payment" subtitle="₹2,000" />
  <BottomSheetBody>…</BottomSheetBody>
  <BottomSheetFooter><Button>Pay</Button></BottomSheetFooter>
</BottomSheet>
```

- **Wiring.** Inside its overlay, a header names the overlay with its title
  and describes it with its subtitle, leaves room for the close button, and
  takes the drag on a draggable sheet or drawer. Without a header (or with
  one that draws nothing) the overlay keeps Blade's empty header, room under
  its floating close, and is named by its `accessibilityLabel`.
- **Your own part.** Build it from the classes, and wire a header with
  `useModalHeader()`, which returns `{ titleId, subtitleId, hasClose, hasHandle, dragZone, close }` and registers the header:

```svelte
<script>
  import { resolveBottomSheetHeader, useModalHeader } from '@razorpay/blade-svelte/components';
  const wiring = useModalHeader({ hasContent: () => true, hasTitle: () => true, hasSubtitle: () => false });
  const classes = $derived(resolveBottomSheetHeader({ hasHandle: wiring.hasHandle ?? true }));
</script>

<div class="{classes.root} {wiring.dragZone?.className ?? ''}" {@attach wiring.dragZone?.attach}>
  <div class="{classes.row} {wiring.hasClose ? classes.closeClearance : ''}">
    <p id={wiring.titleId} class={classes.title}>Pick a bank</p>
  </div>
</div>
```

- **Outside an overlay** a part is just its classes, with nothing wired.

### Why a header's `leading`, `titleSuffix` and `trailing` are props

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
handler asks them before its own navigation: `back()`, `true` when an
overlay handled it.

Each overlay's panel sets `--overlay-gutter`, its body's padding by layout:
20px on a modal or a drawer, 16px on a sheet, a popover or a menu (unset
outside an overlay; read it with a 0px fallback). Content on a bare body
(`padding="spacing.0"`) that scrolls to the panel's edge pads its rows by
it — ActionList's `inset="overlay"`, `px-[var(--overlay-gutter,0px)]` — and
follows the layout as it switches.

BladeProvider renders the overlay host after its content, so put it inside
the frame modals must stay within (the checkout modal card). Modals render
into it, and everything beside the host is `inert` while a modal is open.
The host owns the one scrim under every open modal: stacked modals share
it, it fades in with the first panel and out with the last, and a tap on it
closes the top modal only. Without a provider a modal renders in place,
unscrimmed.

## Surface

`Modal.svelte`, `BottomSheet.svelte` and `Drawer.svelte` resolve their
classes and render `components/layer/OverlaySurface.svelte` (internal): the
overlay on the layer stack and the surface with its close button. Presence, the portal, focus and the Tab trap live in
`components/layer/Surface.svelte`.

## Why not `<modal>`

The top layer is viewport-level, so a modal `<dialog>` would escape the
checkout card on desktop; it also needs Safari 15.4 and cannot mix with the
z-index overlays v2 still renders. The focus trap, host and Escape wiring are
internal to the component, so a later swap changes no props.

## Presence

Svelte's `transition:` keeps the node mounted until the exit ends and reverses
an interrupted open. The visuals are the component's CSS transitions keyed on the
root's `data-state`; the core only flips that attribute and reports the
longest computed transition, so `motion-reduce:transition-none` unmounts
immediately.

## Pace

Modal, BottomSheet and Drawer take `pace`: `snappy` is v2's quick-buy
drawer timing (expo-out); the default eases in. Both run Blade's `moderate`
duration (280ms). Popover and Menu have no `pace`.

## Placing a modal: `classes`

Modal, BottomSheet and Drawer take `classes`, in place of the layout's:

- `root`: where the panel sits in the host, its alignment and gutter
  (`items-center justify-center p-4` for a modal). `{ root: 'items-start justify-end p-6' }` puts it top right; any alignment and padding place it
  anywhere.
- `panel`: its look, size and enter/exit. A sheet's or a drawer's drag
  needs its transform at rest (`translate-y-0`, `translate-x-0`).

Each replaces the layout's part over the base that makes it work (the root
stays a positioned layer, the panel the pointer-taking column in the
overlay's fill and pace). A function, `(classes) => classes`, rewrites every
class. Popover and Menu are placed by their trigger, so they take none.

```svelte
<Modal bind:isOpen classes={{ root: 'items-start justify-end p-6' }}>
  <ModalHeader title="Fees" />
</Modal>
```

## What the app brings

Opening from code is the app's: a stack of opened components it renders
inside BladeProvider, on these public overlays. So is an overlay that switches
by screen: it composes these, on the query its `d:` uses. No
library component needs either. A library dropdown (PhoneNumberInput's
country list) renders under its field; an app shows it its own way through
`adapters.presentDropdown`.
