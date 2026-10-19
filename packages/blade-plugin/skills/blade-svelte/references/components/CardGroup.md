## Component Name

CardGroup

## Description

CardGroup stacks rows on one raised card with hairlines between them: a list of choices (a bank, a payment option, a plan), a list of links, or rows that disclose more under them. A `CardGroupItem` with a `value` is a choice and the group is a form field that holds the pick (radios, or checkboxes with `selectionType="multiple"`); one with `href` is a link row with a chevron; one with neither and a `content` snippet is a disclosure row; one with nothing is plain content. A choice's `content` shows while it is picked, so a pick can reveal the field it needs. `CardGroupSection` titles groups of rows, and long lists render from data (`items` or `sections` with a `row` snippet), optionally `isVirtualized`.

## Important Constraints

- The value lives on `CardGroup` (`bind:value`); a `CardGroupItem` with a `value` is a choice, without one it is a link (`href`), a disclosure (`content`), or plain content. There is no `selectionType="none"`: a list where a pick submits uses `onPick`
- `onChange({ name, value })` fires when a user pick changes the value; `value` is the pick (or `null`), an array with `selectionType="multiple"`. `onPick({ name, value })` fires on every pick, the same row again included
- A row's `onClick({ name, value, event })` gets the row's value as `name` and whether it was selected when pressed as `value`
- `CardGroupItem`'s `leading` and `trailing` take text or a snippet, not an icon source: draw an icon inside a snippet with `<Icon source={…} />`
- Values are compared by `compare`, by default the same value or plain objects equal in every key; pass `compare` to match objects by an id
- `CardGroupSection` must sit inside a `CardGroup`; the keyboard runs across sections as one list. Several CardGroups never make one field: put the sections in one CardGroup
- `isVirtualized` needs `items` (or `sections`), `row` and a bounded height in `class` (`h-80`)
- Name the group with `label` (visible, above the rows) or `accessibilityLabel`
- CardGroup has no style props and no search: filter the data yourself and render the filtered rows

## Props

```typescript
type CardGroupValidationState = 'none' | 'error';

interface CardGroupDataSection<T> {
  key: string;
  title: string;
  items: readonly T[];
}

interface CardGroupItemState {
  index: number;
  isSelected: boolean;
  isDisabled: boolean;
}

interface CardGroupItemClick<T> {
  /** The row's value. */
  name: T;
  /** Whether the row was selected when it was pressed. */
  value: boolean;
  event: MouseEvent | KeyboardEvent;
}

interface CardGroupProps<T> {
  /** The pick (or `null`), an array of picks with `selectionType="multiple"`. Bindable. */
  value?: T | readonly T[] | null;
  /** `single`: radios. `multiple`: checkboxes, and `value` is an array. @default 'single' */
  selectionType?: 'single' | 'multiple';
  /** A user pick changed the value; `value` is shaped as `bind:value`. */
  onChange?: (change: { name: string | undefined; value: T | null | T[] }) => void;
  /** Every user pick (pointer, Enter or Space) with the row's value, changed or not. */
  onPick?: (pick: { name?: string; value: T }) => void;
  /** The options as data, in order; rendered by `row`, or placed by each item's `value`. Read at mount. */
  items?: readonly T[];
  /** The options as data in titled sections, in place of `items`. Needs `row`. */
  sections?: readonly CardGroupDataSection<T>[];
  /** With `items` or `sections`: renders one option's row (a CardGroupItem with `value={item}`). */
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
  /** Disables every row. @default false */
  isDisabled?: boolean;
  /** Omit inside a form to mirror its error; pass it to own the state. */
  validationState?: CardGroupValidationState;
  /** The line under the rows while the state is `none`. */
  helpText?: string | Snippet;
  /** The line while `validationState` is `error`. */
  errorText?: string | Snippet;
  /** The visible label above the rows. */
  label?: string;
  /** Names the list when there is no `label`. */
  accessibilityLabel?: string;
  /** On the root; each choice's control gets `${testID}-${index}`. */
  testID?: string;
  /** Placement only. */
  class?: string;
  /** The CardGroupItems and anything between them (a heading, a "show all" button); after the rows with `row`. Receives `{ activeIndex, tabStop }`. */
  children?: Snippet<[{ activeIndex: number; tabStop: number }]>;
}

interface CardGroupItemProps<T> {
  /** The option this row picks. Leave it out for a link, a disclosure or plain content. */
  value?: T;
  title?: string;
  /** Under the title, smaller. */
  description?: string;
  /** Before the text: text (initials) or a snippet (an `<Icon>`, a logo). */
  leading?: string | Snippet;
  /** After the text: text or a snippet (a Badge, an Amount). */
  trailing?: string | Snippet;
  /** A link row with a chevron; it holds no value. Internal hrefs go to `adapters.navigate`. */
  href?: string;
  target?: string;
  /** `noopener noreferrer` is added for `target="_blank"`. */
  rel?: string;
  /** What the row reveals under it: on a choice it shows while picked; without a value the row becomes a disclosure button. Not on a link. */
  content?: Snippet;
  /** With `content`: whether it shows. Bindable on a disclosure row; on a choice it overrides the pick. @default false on a disclosure, the pick on a choice */
  isExpanded?: boolean;
  /** A disclosure row toggled its content. Not on a choice. */
  onExpandChange?: (change: { isExpanded: boolean }) => void;
  /** The row was pressed (pointer, Enter or Space), after the pick. */
  onClick?: (click: CardGroupItemClick<T>) => void;
  /** Refuses picks and skips the keyboard; a disabled link loses its `href`. @default false */
  isDisabled?: boolean;
  /** What typeahead matches. @default title, else the row's text */
  text?: string;
  /** @default 'none' */
  intent?: 'none' | 'negative';
  /** Names a row with no value whose content does not. */
  accessibilityLabel?: string;
  /** Overrides the `${testID}-${index}` the group hands the control. */
  testID?: string;
  /** Placement of the row's content. */
  class?: string;
  /** Custom content in place of the title/description/leading/trailing layout; receives the row's state. */
  children?: Snippet<[CardGroupItemState]>;
}

interface CardGroupSectionProps {
  /** The heading over the section; it names the group. */
  title: string;
  /** The section's CardGroupItems. */
  children: Snippet;
  testID?: string;
}
```

## Guidelines

- Use CardGroup for checkout-style lists of options on a card (banks, saved cards, payment options); use RadioGroup for a plain form question and ActionList for menu-style rows.
- Bind `value` and read it, or listen to `onChange`; use `onPick` when a pick moves on (a bank list that submits), since it also reports picking the same row again.
- Put the field a pick needs (an amount, a UPI ID) in that choice's `content` snippet: it shows only while the row is picked.
- Mix choices with headings, notes or a "show all" button freely: only `CardGroupItem`s are options.
- Use `CardGroupSection` to title groups of choices within one CardGroup.
- For long lists pass `items` (or `sections`) with a `row` snippet and `itemKey`, and add `isVirtualized` with a height in `class`.
- Pass `compare` when your option objects are rebuilt (from a fetch) and should match by id.
- Don't pass an icon source to `leading`: wrap it in a snippet with `Icon`.
- Don't restyle the group or rows through `class`; it only places them.

## Examples

### Pick a bank

```svelte
<script lang="ts">
  import { CardGroup, CardGroupItem } from '@razorpay/blade-svelte/components';

  type Bank = { code: string; name: string; note?: string; isDown?: boolean };

  const banks: Bank[] = [
    { code: 'hdfc', name: 'HDFC Bank' },
    { code: 'icici', name: 'ICICI Bank', note: 'Low success rate right now' },
    { code: 'sbi', name: 'State Bank of India' },
    { code: 'yes', name: 'Yes Bank', note: 'Unavailable', isDown: true },
  ];

  let bank = $state<Bank | null>(null);
</script>

<CardGroup
  label="Bank"
  name="bank"
  bind:value={bank}
  compare={(a, b) => a.code === b.code}
  helpText="Pick the bank you have an account with"
  class="max-w-96"
>
  {#each banks as item (item.code)}
    <CardGroupItem
      value={item}
      title={item.name}
      description={item.note}
      leading={item.code.slice(0, 2).toUpperCase()}
      isDisabled={Boolean(item.isDown)}
    />
  {/each}
</CardGroup>
```

### A pick that reveals a field

```svelte
<script lang="ts">
  import { CardGroup, CardGroupItem, TextInput } from '@razorpay/blade-svelte/components';

  let option = $state<string | null>('full');
  let partAmount = $state('');
</script>

<CardGroup bind:value={option} accessibilityLabel="Payment options" class="max-w-[400px]">
  <CardGroupItem value="full" title="Pay in full" description="Pay ₹2,000 now" />
  <CardGroupItem value="part" title="Part payment" description="Pay a part of the total amount">
    {#snippet content()}
      <TextInput
        accessibilityLabel="Amount to pay"
        placeholder="Enter amount up to ₹2,000"
        bind:value={partAmount}
      />
    {/snippet}
  </CardGroupItem>
</CardGroup>
```

### Links and disclosure rows with icons

```svelte
<script lang="ts">
  import { CardGroup, CardGroupItem, Icon, Text } from '@razorpay/blade-svelte/components';
  import { CreditCardIcon, UpiIcon, WalletIcon } from '@razorpay/blade-svelte/icons';

  let isUpiOpen = $state(true);
</script>

<CardGroup accessibilityLabel="Payment methods" class="max-w-[400px]">
  <CardGroupItem href="/pay/cards" title="Cards">
    {#snippet leading()}<Icon source={CreditCardIcon} color="subtle" />{/snippet}
  </CardGroupItem>
  <CardGroupItem title="UPI" bind:isExpanded={isUpiOpen}>
    {#snippet leading()}<Icon source={UpiIcon} color="subtle" />{/snippet}
    {#snippet content()}
      <Text size="small" color="muted">Scan the QR code with any UPI app.</Text>
    {/snippet}
  </CardGroupItem>
  <CardGroupItem href="/pay/wallets" title="Wallets" description="Paytm, PhonePe and more">
    {#snippet leading()}<Icon source={WalletIcon} color="subtle" />{/snippet}
  </CardGroupItem>
</CardGroup>
```

### Sections and a pick that submits

```svelte
<script lang="ts">
  import { CardGroup, CardGroupItem, CardGroupSection } from '@razorpay/blade-svelte/components';

  function payWith(bank: string): void {
    console.log('Paying with', bank);
  }
</script>

<CardGroup accessibilityLabel="Netbanking" onPick={({ value }) => payWith(value)}>
  <CardGroupSection title="Popular banks">
    <CardGroupItem value="hdfc" title="HDFC Bank" />
    <CardGroupItem value="icici" title="ICICI Bank" />
  </CardGroupSection>
  <CardGroupSection title="All banks">
    <CardGroupItem value="axis" title="Axis Bank" />
    <CardGroupItem value="sbi" title="State Bank of India" />
  </CardGroupSection>
</CardGroup>
```

### A long list from data, virtualized

```svelte
<script lang="ts">
  import { CardGroup, CardGroupItem } from '@razorpay/blade-svelte/components';

  type Bank = { code: string; name: string };

  let { banks }: { banks: Bank[] } = $props();
  let selected = $state<Bank | null>(null);
</script>

<CardGroup
  label="All banks"
  bind:value={selected}
  items={banks}
  itemKey={(bank) => bank.code}
  itemText={(bank) => bank.name}
  isVirtualized
  class="h-80"
>
  {#snippet row(bank)}
    <CardGroupItem value={bank} title={bank.name} />
  {/snippet}
</CardGroup>
```
