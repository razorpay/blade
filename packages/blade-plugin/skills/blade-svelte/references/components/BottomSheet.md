## Component Name

BottomSheet

## Description

BottomSheet is the phone-first dialog on the bottom edge, for a picker, a confirmation or a short step, opened from a bound `isOpen` and composed from BottomSheetHeader, Body and Footer. It renders into the overlay host. It keeps its content's height (no snap points), shows a grab handle and is dragged down to dismiss by its handle strip and header; on desktop (`d`) it is a 400px column floating 8px in at the end. It shares Modal's behaviour: the scrim, the focus trap, Escape, `back()`, and focus returning to what had it.

## Important Constraints

- BottomSheet has no trigger: open it by setting the bound `isOpen`; `children` is its content
- It renders into the overlay host of the app's BladeProvider (the examples assume the app has one)
- Compose the content from `BottomSheetHeader`, `BottomSheetBody` and `BottomSheetFooter`; there is no `size`, `snapPoints`, `title` or `padding` on the sheet itself
- A release dismisses after a downward fling or past half the sheet's height, reporting `onDismiss({ source: 'drag' })`; a shorter drag settles back
- `onDismiss({ source, close, preventDefault })` fires on every user dismissal; `preventDefault()` keeps the sheet open this time (ask first, then `close()`). With `isDismissible={false}` the close button is hidden and a drag resists; the sheet stays open until `close` is called
- `isDraggable={false}` hides the handle and stops the drag; it is a style prop, so `BladeProvider` `defaults={{ BottomSheet: { isDraggable: false } }}` sets it too (Modal's defaults never reach a sheet)
- The header's back button (`showBackButton`) is a step back inside the sheet, not a dismissal: handle it in `onBackButtonClick`

## Props

```typescript
type DismissSource = 'cross' | 'blur' | 'escape' | 'back' | 'drag';

interface BottomSheetProps {
  /** Bindable. Written `false` whenever the sheet closes itself. @default false */
  isOpen?: boolean;
  /** Every user dismissal (including a drag), dismissible or not; `close` ends a non-dismissible one. */
  onDismiss?: (event: { source: DismissSource; close: () => void }) => void;
  /** It opened or closed by itself (a dismissal or `close`), not when you set `isOpen`. */
  onOpenChange?: (change: { isOpen: boolean }) => void;
  /** The exit animation finished and the sheet left the DOM. */
  onClosed?: () => void;
  /** Whether a dismissal closes it by itself, and whether the close button shows. @default true */
  isDismissible?: boolean;
  /** @default 'dialog' */
  role?: 'dialog' | 'alertdialog';
  /** The content: BottomSheetHeader, BottomSheetBody, BottomSheetFooter. `close` closes without a dismissal. */
  children?: Snippet<[{ close: () => void }]>;
  /** A zero-height box on the panel's top edge, beside the handle and close button; what goes in positions itself. */
  chrome?: Snippet<[{ close: () => void }]>;
  /** The close button's accessible name. @default 'Close' */
  closeLabel?: string;
  /** Names the sheet when its header has no title. */
  accessibilityLabel?: string;
  /** An element inside, bound with `bind:this`, that takes focus on open in place of the panel. */
  initialFocusRef?: HTMLElement | null;
  /** Lands on the panel (the element with the dialog role). */
  testID?: string;
  /** `root`: where the panel sits in the host; `panel`: its look (keep `translate-y-0` for the drag). Or a function rewriting every class. */
  classes?: { root?: string; panel?: string } | ((classes: ModalClasses) => ModalClasses);
  /** Placement only, merged last onto the panel. */
  class?: string;
  /** `snappy`: an expo-out easing; both run 280ms. @default 'default' */
  pace?: 'default' | 'snappy';
  /** Dragged down to dismiss by its handle strip and header; the handle shows only while true. @default true */
  isDraggable?: boolean;
}

interface BottomSheetHeaderProps {
  /** Names the sheet. */
  title?: string | Snippet;
  /** One muted line under the title; it describes the sheet. */
  subtitle?: string;
  /** Before the title: an icon (a 20px glyph) or a snippet (an asset or avatar in a 32px slot). */
  leading?: IconSource | Snippet;
  /** Beside the title: a Counter or a Badge. */
  titleSuffix?: Snippet;
  /** After the title block: a Badge, text, a Link or an action. Receives `close`, which closes the overlay without a dismissal. */
  trailing?: Snippet<[{ close: () => void }]>;
  /** A back button first in the row: a step back inside the sheet, not a dismissal. @default false */
  showBackButton?: boolean;
  onBackButtonClick?: () => void;
  /** The back button's accessible name. @default 'Back' */
  backLabel?: string;
  /** Under the title row, inside the header: a search field, a stepper. */
  children?: Snippet;
  testID?: string;
  /** Placement only. */
  class?: string;
}

interface BottomSheetBodyProps {
  /** 16px all round, or none for content with its own scroll box. @default 'spacing.5' */
  padding?: 'spacing.5' | 'spacing.0';
  testID?: string;
  /** Placement only. */
  class?: string;
  children: Snippet;
}

interface BottomSheetFooterProps {
  testID?: string;
  /** Placement only. */
  class?: string;
  /** The actions, on the sheet's surface under a hairline; you lay them out. */
  children: Snippet;
}
```

## Guidelines

- Use BottomSheet for phone-first pickers and confirmations; use Modal for a centred dialog and Drawer for a side panel. A sheet on phones and a modal on desktop is the app's own component composing both.
- Give it a `BottomSheetHeader` with a `title`; it names the dialog and is part of the drag zone.
- Make the footer's main action full width (`class="w-full"` on the Button).
- Build a multi-step sheet with one sheet and a `step` state: `showBackButton` and `onBackButtonClick` on the header go back a step.
- Put a list that scrolls to the sheet's edges in `BottomSheetBody padding="spacing.0"`, and pad its rows by the overlay gutter (ActionList's `inset="overlay"`).
- Don't put a search field in the body when it should stay put: pass it as the header's `children`.

## Examples

### Confirm a payment

```svelte
<script lang="ts">
  import {
    BottomSheet,
    BottomSheetBody,
    BottomSheetFooter,
    BottomSheetHeader,
    Button,
    Text,
  } from '@razorpay/blade-svelte/components';

  let isOpen = $state(false);
</script>

<Button onClick={() => (isOpen = true)}>Pay ₹2,000</Button>

<BottomSheet bind:isOpen>
  <BottomSheetHeader title="Confirm payment" subtitle="To Acme Stores" />
  <BottomSheetBody>
    <Text color="muted">₹2,000 will be debited from your HDFC Bank account.</Text>
  </BottomSheetBody>
  <BottomSheetFooter>
    <Button class="w-full" onClick={() => (isOpen = false)}>Pay now</Button>
  </BottomSheetFooter>
</BottomSheet>
```

### Two steps with a back button

```svelte
<script lang="ts">
  import {
    BottomSheet,
    BottomSheetBody,
    BottomSheetFooter,
    BottomSheetHeader,
    Button,
    Text,
  } from '@razorpay/blade-svelte/components';

  let isOpen = $state(false);
  let step = $state<1 | 2>(1);
</script>

<Button onClick={() => { step = 1; isOpen = true; }}>Pay by netbanking</Button>

<BottomSheet bind:isOpen>
  <BottomSheetHeader
    title={step === 1 ? 'Choose a bank' : 'HDFC Bank'}
    showBackButton={step === 2}
    onBackButtonClick={() => (step = 1)}
  />
  <BottomSheetBody>
    {#if step === 1}
      <Button variant="secondary" class="w-full" onClick={() => (step = 2)}>HDFC Bank</Button>
    {:else}
      <Text color="muted">You will be redirected to HDFC Bank to complete the payment.</Text>
    {/if}
  </BottomSheetBody>
  {#if step === 2}
    <BottomSheetFooter>
      <Button class="w-full" onClick={() => (isOpen = false)}>Continue</Button>
    </BottomSheetFooter>
  {/if}
</BottomSheet>
```

### A pick list with a search field in the header

```svelte
<script lang="ts">
  import {
    ActionList,
    ActionListItem,
    BottomSheet,
    BottomSheetBody,
    BottomSheetHeader,
    Button,
    SearchInput,
  } from '@razorpay/blade-svelte/components';
  import { BankIcon } from '@razorpay/blade-svelte/icons';

  let isOpen = $state(false);
  let query = $state('');
  let bank = $state<string | null>(null);
  const BANKS = ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'];
  const shown = $derived(BANKS.filter((name) => name.toLowerCase().includes(query.toLowerCase())));
</script>

<Button variant="secondary" onClick={() => (isOpen = true)}>{bank ?? 'Select a bank'}</Button>

<BottomSheet bind:isOpen>
  {#snippet children({ close })}
    <BottomSheetHeader title="Select a bank">
      <SearchInput bind:value={query} accessibilityLabel="Search banks" placeholder="Search banks" />
    </BottomSheetHeader>
    <BottomSheetBody padding="spacing.0">
      <ActionList inset="overlay" onPick={({ value }) => { bank = value as string; close(); }}>
        {#each shown as name (name)}
          <ActionListItem value={name} title={name} leading={BankIcon} />
        {/each}
      </ActionList>
    </BottomSheetBody>
  {/snippet}
</BottomSheet>
```
