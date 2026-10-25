# Composing

## Description

How an app builds its own components on `@razorpay/blade-svelte`: a component of the app's package that composes Blade's parts, takes BladeProvider defaults by name, places Blade's parts with `class`, reads the app's services through `getAdapters()`, and imports only Blade's public entries. Read it before writing a component that wraps or combines Blade components, or an app package of them.

## When to compose

- **Use a Blade component as-is** when its props cover the case. A look its props don't have is not a reason to wrap it: there is no restyle through `class`, and a wrapper can't add one.
- **Compose** when the app repeats one arrangement of Blade's parts (an overlay that switches by screen, a confirmation with fixed actions, a searchable list), or needs a part Blade doesn't ship, built from Blade's classes (a header of its own inside an overlay).
- **Build a headless host** (an opener for overlays opened from code, a navigation stack, a form) on the `/runes` building blocks below and Blade's adapters. Blade ships UI parts; the hosts and flows around them are the app's.
- Never copy a Blade component's source into the app, and never import its internals: compose its public parts.

## The files

One folder per component, as blade-svelte lays out its own:

```
src/lib/ui/
  cx.ts                      # joins class lists (blade-svelte's own cx is not public)
  defaults.ts                # the app's components in ComponentStyleProps
  index.ts                   # the package's public entry
  responsive-dialog/
    ResponsiveDialog.svelte  # the component: typed $props(), Blade's parts
    styles.ts                # its style taxonomy and class map
    index.ts                 # re-exports the component, its axes, resolver and types
```

- **`Name.svelte`**: runes only, one typed `$props()` (`let { … }: Props = $props()`). Behaviour props by name, style props from `styles.ts`, callback props with a payload object, the value `$bindable` (`isOpen = $bindable(false)`), content as snippets. Spread the rest into the style props, not onto an element.
- **`styles.ts`**: the style taxonomy as data (`NAME_AXES`, `as const`), the `NameStyleProps` interface derived from it (`AxisValue<typeof NAME_AXES, 'axis'>`), the parts' classes as a literal map (`Record<Axis, string>`), and `resolveName(styleProps)` returning the classes. Every class is written in full, so UnoCSS sees it: keep `.ts` files in the app's Uno `content.pipeline.include`.
- **`index.ts`**: `export { default as Name } from './Name.svelte'` with the axes, the resolver and the types; the package's `index.ts` re-exports it (`export { Name } from './name'` or `export * from './name'`).
- **`cx.ts`**: a three-line join (`parts.filter(Boolean).join(' ')`). The class lint checks the string arguments of calls named `cx`, `cn`, `clsx`, `classNames` and `twMerge`.

## Provider defaults

`useComponentDefaults(name, () => props)` from `/components` fills the style props the caller left unset from the nearest BladeProvider's `defaults[name]`. Its `.current` is tracked; call it during component init. Add the component to Blade's `ComponentStyleProps` interface by declaration merging, so `useComponentDefaults('Name', …)` and `defaults={{ Name: … }}` are typed:

```ts
// src/lib/ui/defaults.ts
import type { ResponsiveDialogStyleProps } from './responsive-dialog/styles';

declare module '@razorpay/blade-svelte/components' {
  interface ComponentStyleProps {
    ResponsiveDialog: ResponsiveDialogStyleProps;
  }
}
```

Each component imports it for its type (`import type {} from '../defaults';`).

- `defaults` hold style props only; behaviour props are never defaulted. A prop the caller gives wins, then the nearest provider's entry, then the resolver's own default.
- BladeProvider's overall `size` reaches only Blade's own sized controls, never an app component's `size`.
- Pass a style prop that is still unset to a Blade part as `undefined`: the part then takes its own defaults (`{ Modal: { size: 'medium' } }`).

## Placing Blade's parts

- **Your own elements** are styled with Blade's token classes from `styles.ts` (`flex justify-end gap-blade-4`); see `Styling.md`.
- **A Blade part's `class` only places it** (margin, size, flex or grid item, position, `hidden`). Pass the caller's `class` through to the part that is your component's root; never add colour, padding, border, radius or font classes to a Blade component. `blade/no-restyle` reports them.
- **`classes`** is the overlays' layout override (`ModalClassesProp`): `{ root, panel }`, or a function from the resolved `ModalClasses` to new ones. Modal, BottomSheet and Drawer take it; type yours as `ModalClassesProp` and pass it through.
- **A part Blade doesn't ship** is built on its resolvers: `resolveModalHeader()`, `resolveBottomSheetHeader({ hasHandle })`, `resolveDrawerHeader({ color, showDivider })`, `resolveModalBody({ padding })`, `resolveModalFooter()`, `resolvePopoverHeader()`, `resolveMenuBody()` and the rest each return that part's classes (`OverlayHeaderClasses`: `root`, `row`, `title`, `subtitle`, `closeClearance`…; `OverlayBodyClasses`, `OverlayFooterClasses`: `root`). A header inside an overlay also calls `useModalHeader()`, which registers it with the overlay: its title names the overlay, the row leaves room for the close button, a sheet drags by it.
- The `*_AXES` exports (`MODAL_AXES`, `BUTTON_AXES`…) and the `*StyleProps` types let a component take a Blade part's style prop as its own (`size?: ModalStyleProps['size']`).
- Add your package to the class lint's `sources` so its components' `class` is checked like Blade's: `"blade/no-restyle": ["error", { "sources": ["@razorpay/blade-svelte/components", "$lib/ui"] }]` (exact import specifiers).

## The app's services

`getAdapters()` from `/components` returns the app's adapters (`BladeAdapters`: `track`, `navigate`, `vibrate`, `announce`, `locale`, `reportError`, `form`, `presentDropdown`, `readOTP`; see `Adapters.md`). Call it during component init and read an adapter when you use it: the object stays live, so a swapped adapter reaches mounted components. Every adapter is optional (`adapters.track?.(…)`).

## The runes entry

`@razorpay/blade-svelte/runes` holds the few runes an app builds its own hosts on, not Blade's whole runes layer:

| Export | What |
| --- | --- |
| `createLayerStack<E>()` | Ordered layers with promises: `push(entry)` returns a `Layer` (`id`, `entry`, `promise`, `close()`, `settle(value)`); `entries` (tracked), `update`, `top`, `size`, `clear`. An opener of overlays from code, a navigation stack |
| `defineContext<T>(name)` | A context key with `get()` (`undefined` with no provider above) and `set(value)`; call at module level, `get` and `set` during init |
| `longestTransition(elements)` | How long, in ms, the longest CSS transition on the elements takes |
| `phaseTransition(run)` | A `transition:` that calls `run(node, 'in' \| 'out')` when its block toggles; `run` returns the duration |
| `isPromise(value)`, `isGlyph(source)` | Type guards: a thenable; an icon source that is a font glyph (`Glyph`) rather than a URL |
| `phoneDigits(text)` | The digits of a phone number |
| Types | `Layer`, `BackAnswer`, `FieldConstraints`, `Glyph`, `IconSource` |

## Imports

- Import only from `@razorpay/blade-svelte/components`, `/runes` and `/icons`. There is no root entry, and `@razorpay/blade-svelte/src/…` is not exported: Blade's internals (its `cx`, its runes for focus, presence or analytics) are not an API.
- Never import from React's `@razorpay/blade`.
- The app's own components are imported from the app's package (`$lib/ui`), never from their files.

## Example: a responsive dialog

A sheet on phones and a modal on desktop, with the same content. An overlay's kind can't switch in CSS, so this is the one place the app reads the screen: when it opens, by the query its `d:` uses, holding the layout until it has closed (a resize while open doesn't swap it under the user's hands).

```ts
// src/lib/ui/responsive-dialog/styles.ts
import type { AxisValue, ModalStyleProps } from '@razorpay/blade-svelte/components';

/** The style taxonomy as data: every value each axis accepts. */
export const RESPONSIVE_DIALOG_AXES = {
  actions: ['end', 'stretch'],
} as const;

type Axis<K extends keyof typeof RESPONSIVE_DIALOG_AXES> = AxisValue<typeof RESPONSIVE_DIALOG_AXES, K>;

/** What shows: Blade's BottomSheet below desktop, its Modal from desktop up. */
export type ResponsiveDialogLayout = 'sheet' | 'modal';

/** Derived from RESPONSIVE_DIALOG_AXES and Modal's: add a value there, never here. */
export interface ResponsiveDialogStyleProps {
  /** The footer's actions: at the end of the row, or one under another at full width. @default 'end' */
  actions?: Axis<'actions'>;
  /** The modal's desktop column. @default Modal's (`small`) */
  size?: ModalStyleProps['size'];
  /** Where desktop starts: the media query of the app's `d:`. @default '(min-width: 62.5rem)' */
  desktopMedia?: string;
}

export interface ResponsiveDialogClasses {
  /** The row the footer's actions sit in, per layout. */
  actions: Record<ResponsiveDialogLayout, string>;
}

const ACTIONS: Record<Axis<'actions'>, Record<ResponsiveDialogLayout, string>> = {
  end: { sheet: 'flex justify-end gap-blade-3', modal: 'flex justify-end gap-blade-4' },
  stretch: { sheet: 'flex flex-col gap-blade-3', modal: 'flex flex-col gap-blade-4' },
};

export function resolveResponsiveDialog(props: ResponsiveDialogStyleProps): ResponsiveDialogClasses {
  return { actions: ACTIONS[props.actions ?? 'end'] };
}
```

```svelte
<!-- src/lib/ui/responsive-dialog/ResponsiveDialog.svelte -->
<script lang="ts">
  import {
    BottomSheet,
    BottomSheetBody,
    BottomSheetFooter,
    BottomSheetHeader,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    getAdapters,
    useComponentDefaults,
  } from '@razorpay/blade-svelte/components';
  import type { DialogDismissEvent, ModalClassesProp } from '@razorpay/blade-svelte/components';
  import type { Snippet } from 'svelte';
  import type {} from '../defaults';
  import {
    resolveResponsiveDialog,
    type ResponsiveDialogLayout,
    type ResponsiveDialogStyleProps,
  } from './styles';

  interface Props extends ResponsiveDialogStyleProps {
    /** Bindable. Written `false` whenever the dialog closes itself. @default false */
    isOpen?: boolean;
    /** Names the dialog. */
    title: string;
    /** One muted line under the title. */
    subtitle?: string;
    /** Every user dismissal: the close button, the scrim, Escape, back or a drag. */
    onDismiss?: (event: DialogDismissEvent) => void;
    /** The exit finished and the dialog left the DOM. */
    onClosed?: () => void;
    /** Passed to the sheet's or the modal's `classes`: where the panel sits, or its look. */
    classes?: ModalClassesProp;
    /** Placement only: lands on the panel. */
    class?: string;
    testID?: string;
    /** The content, in the layout's body. */
    body: Snippet<[{ close: () => void }]>;
    /** The actions, in the layout's footer. */
    footer?: Snippet<[{ close: () => void }]>;
  }

  let {
    isOpen = $bindable(false),
    title,
    subtitle,
    onDismiss,
    onClosed,
    classes,
    class: className,
    testID,
    body,
    footer,
    ...styleProps
  }: Props = $props();

  // A prop given wins, then BladeProvider's `defaults.ResponsiveDialog`.
  const style = useComponentDefaults('ResponsiveDialog', () => styleProps);
  const look = $derived(resolveResponsiveDialog(style.current));
  const adapters = getAdapters();

  let held = $state<ResponsiveDialogLayout>();
  const pick = (): ResponsiveDialogLayout =>
    typeof matchMedia === 'function' &&
    matchMedia(style.current.desktopMedia ?? '(min-width: 62.5rem)').matches
      ? 'modal'
      : 'sheet';
  const layout = $derived(held ?? (isOpen ? pick() : 'sheet'));

  $effect.pre(() => {
    if (isOpen && !held) {
      held = layout;
      adapters.track?.('responsive_dialog_open', { layout });
    }
  });

  function closed(): void {
    held = undefined;
    onClosed?.();
  }
</script>

{#if layout === 'modal'}
  <Modal bind:isOpen size={style.current.size} {onDismiss} onClosed={closed} {classes} class={className} {testID}>
    {#snippet children({ close })}
      <ModalHeader {title} {subtitle} />
      <ModalBody>{@render body({ close })}</ModalBody>
      {#if footer}
        <ModalFooter><div class={look.actions.modal}>{@render footer({ close })}</div></ModalFooter>
      {/if}
    {/snippet}
  </Modal>
{:else}
  <BottomSheet bind:isOpen {onDismiss} onClosed={closed} {classes} class={className} {testID}>
    {#snippet children({ close })}
      <BottomSheetHeader {title} {subtitle} />
      <BottomSheetBody>{@render body({ close })}</BottomSheetBody>
      {#if footer}
        <BottomSheetFooter><div class={look.actions.sheet}>{@render footer({ close })}</div></BottomSheetFooter>
      {/if}
    {/snippet}
  </BottomSheet>
{/if}
```

```ts
// src/lib/ui/responsive-dialog/index.ts
export { default as ResponsiveDialog } from './ResponsiveDialog.svelte';
export { RESPONSIVE_DIALOG_AXES, resolveResponsiveDialog } from './styles';
export type { ResponsiveDialogClasses, ResponsiveDialogLayout, ResponsiveDialogStyleProps } from './styles';
```

The app uses it like a Blade component, and sets its look app-wide through BladeProvider:

```svelte
<script lang="ts">
  import { BladeProvider, Button, Text } from '@razorpay/blade-svelte/components';
  import { ResponsiveDialog } from '$lib/ui';

  let isOpen = $state(false);
</script>

<BladeProvider defaults={{ ResponsiveDialog: { actions: 'stretch' }, Modal: { size: 'medium' } }}>
  <Button variant="secondary" color="negative" onClick={() => (isOpen = true)}>Remove card</Button>

  <ResponsiveDialog bind:isOpen title="Remove this card?" subtitle="Card ending 1111">
    {#snippet body()}
      <Text color="muted">You will need to add it again to pay with it.</Text>
    {/snippet}
    {#snippet footer({ close })}
      <Button variant="secondary" onClick={close}>Cancel</Button>
      <Button color="negative" onClick={close}>Remove</Button>
    {/snippet}
  </ResponsiveDialog>
</BladeProvider>
```

## Example: a header of your own

A sheet's header with a step line, built from `resolveBottomSheetHeader()`'s classes and wired by `useModalHeader()`. Use it in place of `BottomSheetHeader`, before `BottomSheetBody`.

```svelte
<!-- src/lib/ui/step-header/StepHeader.svelte -->
<script lang="ts">
  import { resolveBottomSheetHeader, useModalHeader } from '@razorpay/blade-svelte/components';
  import { cx } from '../cx';

  let { title, step, steps }: { title: string; step: number; steps: number } = $props();

  const wiring = useModalHeader({
    hasContent: () => true,
    hasTitle: () => true,
    hasSubtitle: () => true,
  });
  const header = $derived(resolveBottomSheetHeader({ hasHandle: wiring.hasHandle ?? true }));
</script>

<div class={cx(header.root, wiring.dragZone?.className)} {@attach wiring.dragZone?.attach}>
  <div class={cx(header.row, wiring.hasClose && header.closeClearance)}>
    <div class={header.titleBlock}>
      <p id={wiring.titleId} class={header.title}>{title}</p>
      <p id={wiring.subtitleId} class={header.subtitle}>Step {step} of {steps}</p>
    </div>
  </div>
</div>
```

## Documenting the app's components

Document each component the way Blade's are (`references/components/Button.md` is the model): the Blade repo's `packages/blade-plugin/authoring/composed-components.prompt.txt` is the prompt, and its Svelte knowledgebase checks run against the app's package (`--package`, `--docs`; see `packages/blade-plugin/AGENTS.md` there) to compile the examples and compare each `{Name}Props` with the component's `$props()`.
