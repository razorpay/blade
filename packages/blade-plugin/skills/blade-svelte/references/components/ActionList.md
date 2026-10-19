## Component Name

ActionList

## Description

ActionList is a list of compact menu-style rows to pick from: on a page, in a BottomSheet or Modal, or inside a Menu whose pick closes it. It holds its own value like CardGroup (`bind:value`, `selectionType` `single` or `multiple`, `onChange`, `onPick`, the form field, sections and data rows with `isVirtualized`) and draws Menu's rows: 36px, an icon or asset before the title, a description, a `titleSuffix` badge and a `trailing` item, a selected wash and a drawn checkbox for multiple. `ActionListItem` with `href` is a link row, `intent="negative"` a destructive one, and `ActionListSection` titles a group of rows. The `card` variant puts the rows in a bordered box.

## Important Constraints

- Rows are `ActionListItem`s inside `ActionList`; titled groups are `ActionListSection`s. Every `ActionListItem` needs a `value` and a `title`, a link row too (its value is ignored)
- `onChange({ name, value })` fires when a user pick changes the value (an array with `selectionType="multiple"`); `onPick({ name, value })` fires on every pick, the same row again included. There is no `selectionType="none"`: a list where a pick acts uses `onPick`
- The keys are a listbox's: the arrows move and pick nothing, Enter or Space picks
- Inside a Menu, ActionList does not close it by itself: call the body's `close` from `onPick`, and from a link row's `onClick`
- `leading` takes an icon source (a 16px glyph) or a snippet (a flag, an Avatar); `titleSuffix` and `trailing` take snippets only
- `isVirtualized` needs `items` (or `sections`), `row` and a bounded height in `class`
- There is no search: filter the data yourself

## Props

```typescript
type ActionListVariant = 'plain' | 'card';
type ActionListInset = 'none' | 'medium' | 'large' | 'overlay';

interface ActionListProps<T> {
  /** `plain`: Menu's rows in no box. `card`: rows divided by hairlines in a bordered box, each section its own box. @default 'plain' */
  variant?: ActionListVariant;
  /** A gutter inside the box that scrolls the rows: `medium` 16px, `large` 20px, `overlay` the overlay's own gutter. @default 'none' */
  inset?: ActionListInset;
  /** The pick (or `null`), an array with `selectionType="multiple"`. Bindable. @default null */
  value?: T | readonly T[] | null;
  /** `single`: radios. `multiple`: checkboxes, and `value` is an array. @default 'single' */
  selectionType?: 'single' | 'multiple';
  /** A user pick changed the value; `value` is shaped as `bind:value`. */
  onChange?: (change: { name: string | undefined; value: T | null | T[] }) => void;
  /** Every user pick (pointer, Enter or Space) with the row's value, changed or not. */
  onPick?: (pick: { name?: string; value: T }) => void;
  /** The options as data, in order. Read at mount. */
  items?: readonly T[];
  /** The options in titled sections (`{ key, title, items }`), in place of `items`. Needs `row`. */
  sections?: readonly { key: string; title: string; items: readonly T[] }[];
  /** With `items` or `sections`: renders one option's row (an ActionListItem with `value={item}`). */
  row?: Snippet<[T]>;
  /** With `row`: keys the rows. @default the option itself, for strings and numbers */
  itemKey?: (item: T) => string;
  /** With `row`: mounts only the rows in view. Give the list a bounded height in `class`. @default false */
  isVirtualized?: boolean;
  /** With `items`: the option's text, for typeahead. */
  itemText?: (option: T) => string;
  /** With `items`: the options the keyboard skips and the list refuses. */
  isItemDisabled?: (option: T, index: number) => boolean;
  /** Value equality. @default the same value, or plain objects alike in every key */
  compare?: (a: T, b: T) => boolean;
  /** Single choice: picking the picked row clears it. @default false */
  isDeselectable?: boolean;
  /** Registers the list with the app's form (`adapters.form`) under this key. */
  name?: string;
  /** @default false */
  isRequired?: boolean;
  /** @default false */
  isDisabled?: boolean;
  /** Omit inside a form to mirror its error; pass it to own the state. */
  validationState?: 'none' | 'error';
  /** The line under the rows while the state is `none`. */
  helpText?: string | Snippet;
  /** The line while `validationState` is `error`. */
  errorText?: string | Snippet;
  /** The visible label above the rows. */
  label?: string;
  /** Names the list when there is no `label`. */
  accessibilityLabel?: string;
  /** On the root; each row's control gets `${testID}-${index}`. */
  testID?: string;
  /** Placement only (and the height of a virtualized list). */
  class?: string;
  /** The ActionListItems and ActionListSections; after the rows with `row`. */
  children?: Snippet<[{ activeIndex: number; tabStop: number }]>;
}

interface ActionListItemProps<T> {
  /** What the list holds when this row is picked; ignored on a link row. */
  value: T;
  /** What the row shows, and what typeahead matches. */
  title: string;
  /** Under the title, muted; it may wrap. */
  description?: string;
  /** Before the title: an icon (16px glyph), or a snippet with an asset or an Avatar. */
  leading?: IconSource | Snippet;
  /** Beside the title: a Badge. */
  titleSuffix?: Snippet;
  /** After the title: a Counter, text, a glyph. */
  trailing?: Snippet;
  /** A link row: it navigates (through `adapters.navigate`) instead of holding a value. */
  href?: string;
  target?: string;
  rel?: string;
  /** `negative` for a destructive action: red, with a red wash. @default 'none' */
  intent?: 'none' | 'negative';
  /** The row was pressed (pointer, Enter or Space), after the pick: `name` is its value, `value` whether it was selected. */
  onClick?: (click: { name: T; value: boolean; event: MouseEvent | KeyboardEvent }) => void;
  /** @default false */
  isDisabled?: boolean;
  /** On the row's control; else the list's `${testID}-${index}`. */
  testID?: string;
}

interface ActionListSectionProps {
  /** The section's heading. */
  title: string;
  /** The section's ActionListItems. */
  children: Snippet;
  testID?: string;
}
```

## Guidelines

- Use ActionList for menu-like option lists (a status, a sort order, accounts); use CardGroup for checkout's card-style choices and RadioGroup for a form question.
- Bind `value` for a list that holds a choice; use `onPick` for a list whose pick acts or closes something.
- In a `Menu`, render the ActionList in the `body` snippet and call `close()` from `onPick`.
- Use `intent="negative"` for destructive rows and `href` for rows that navigate.
- Use `variant="card"` for a list on a page that should read as a bordered box, and `inset="overlay"` on a Modal or BottomSheet body with no padding.
- Don't put an icon in `title` or `trailing` text: use `leading` (an icon source) and the `titleSuffix`/`trailing` snippets.
- Don't restyle the list through `class`.

## Examples

### A single choice with icons

```svelte
<script lang="ts">
  import { ActionList, ActionListItem } from '@razorpay/blade-svelte/components';
  import { BankIcon, UpiIcon, WalletIcon } from '@razorpay/blade-svelte/icons';

  let method = $state<string | null>('upi');
</script>

<ActionList bind:value={method} label="Pay with" class="max-w-80">
  <ActionListItem value="upi" title="UPI" description="Any UPI app" leading={UpiIcon} />
  <ActionListItem value="netbanking" title="Netbanking" leading={BankIcon} />
  <ActionListItem value="wallet" title="Wallet" leading={WalletIcon} />
</ActionList>
```

### Multiple choice with a badge

```svelte
<script lang="ts">
  import { ActionList, ActionListItem, Badge } from '@razorpay/blade-svelte/components';

  let channels = $state<string[]>(['email']);
</script>

<ActionList
  bind:value={channels}
  selectionType="multiple"
  label="Notify me by"
  onChange={({ value }) => console.log('Channels', value)}
>
  <ActionListItem value="email" title="Email" />
  <ActionListItem value="sms" title="SMS" />
  <ActionListItem value="whatsapp" title="WhatsApp">
    {#snippet titleSuffix()}<Badge size="small" color="positive">New</Badge>{/snippet}
  </ActionListItem>
</ActionList>
```

### In a Menu: the pick closes it

```svelte
<script lang="ts">
  import { ActionList, ActionListItem, Button, Menu } from '@razorpay/blade-svelte/components';
  import { ChevronDownIcon, ExternalLinkIcon } from '@razorpay/blade-svelte/icons';

  let status = $state('active');
</script>

<Menu accessibilityLabel="Account status">
  {#snippet children({ isOpen })}
    <Button variant="secondary" trailingIcon={ChevronDownIcon}>{isOpen ? 'Choose…' : 'Status'}</Button>
  {/snippet}
  {#snippet body({ close })}
    <ActionList
      value={status}
      accessibilityLabel="Status"
      onPick={({ value }) => {
        status = value;
        close();
      }}
    >
      <ActionListItem value="active" title="Active" />
      <ActionListItem value="paused" title="Paused" />
      <ActionListItem value="blocked" title="Blocked" intent="negative" />
      <ActionListItem value="help" title="What do these mean?" href="/help/status" leading={ExternalLinkIcon} onClick={close} />
    </ActionList>
  {/snippet}
</Menu>
```

### Sections in a card

```svelte
<script lang="ts">
  import { ActionList, ActionListItem, ActionListSection, Counter } from '@razorpay/blade-svelte/components';
  import { TrashIcon } from '@razorpay/blade-svelte/icons';

  let plan = $state<string | null>(null);
</script>

<ActionList bind:value={plan} variant="card" accessibilityLabel="Account">
  <ActionListSection title="Plan">
    <ActionListItem value="basic" title="Basic" />
    <ActionListItem value="pro" title="Pro">
      {#snippet trailing()}<Counter value={3} size="small" />{/snippet}
    </ActionListItem>
  </ActionListSection>
  <ActionListSection title="Danger zone">
    <ActionListItem value="close" title="Close account" intent="negative" leading={TrashIcon} />
  </ActionListSection>
</ActionList>
```
