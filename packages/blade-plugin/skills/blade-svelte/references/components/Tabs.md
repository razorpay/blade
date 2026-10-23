## Component Name

Tabs

## Description

Tabs switch between panels of related content in one place: payment methods, settings sections, order details. `Tabs` holds the picked tab (`bind:value`, `onChange(value)` with the bare value), its `tabList` snippet holds the `TabItem`s and its `children` the `TabPanel`s, each naming its tab by `value`. It comes in `bordered`, `borderless` and `filled` variants, three sizes, horizontal or vertical, with optional full-width tabs; a TabItem takes a `leading` icon or asset, a `trailing` Badge or Counter, and can be a link with `href`.

## Important Constraints

- TabItems go in the `tabList` snippet, TabPanels in `children`; a TabPanel shows when its `value` matches the picked TabItem's
- `onChange` gets the new value as a bare string (not `{ name, value }`); `value` defaults to the first enabled tab, so one tab is always picked
- `activation` defaults to `manual`: the arrows move focus, a press, Enter or Space picks; `automatic` picks as focus moves
- Panels stay mounted and hidden unless `isLazy`, which mounts only the picked panel
- `leading` is an icon source (16px, 20px at `large`) or a snippet with an asset; `trailing` is a snippet. `children`, a `leading` snippet and `trailing` receive `{ isSelected, isDisabled }`
- An icon-only tab needs `accessibilityLabel`
- TabPanel has no padding of its own: pad your own wrapper inside it
- Tabs are not a form field; to pick a value use SegmentedControl

## Props

```typescript
type TabsVariant = 'bordered' | 'borderless' | 'filled';
type TabsSize = 'small' | 'medium' | 'large';

interface TabItemState {
  isSelected: boolean;
  isDisabled: boolean;
}

interface TabsProps {
  /** The picked tab's value: initial, bound, or host-driven. @default the first enabled tab */
  value?: string;
  /** The new value, bare. */
  onChange?: (value: string) => void;
  /** `manual`: a press, Enter or Space picks; `automatic`: moving focus picks. @default 'manual' */
  activation?: 'automatic' | 'manual';
  /** Panels mount only while their tab is picked. @default false */
  isLazy?: boolean;
  /** Names the tablist. */
  accessibilityLabel?: string;
  testID?: string;
  /** Placement only. */
  class?: string;
  /** @default 'bordered' */
  variant?: TabsVariant;
  /** @default 'medium' (or BladeProvider's `size`) */
  size?: TabsSize;
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** Horizontal bordered tabs share the row equally (filled tabs always do). @default false */
  isFullWidthTabItem?: boolean;
  /** The TabItems. */
  tabList: Snippet;
  /** The TabPanels, and anything else under or beside the tabs. */
  children?: Snippet;
}

interface TabItemProps {
  /** What Tabs' `value` becomes when this tab is picked; its TabPanel's `value`. */
  value: string;
  /** Before the label: an icon, or a snippet with an asset (a logo, an avatar) that receives the tab's state. */
  leading?: IconSource | Snippet<[TabItemState]>;
  /** After the label: a Badge or a Counter. */
  trailing?: Snippet<[TabItemState]>;
  /** Skipped by the arrows. @default false */
  isDisabled?: boolean;
  /** A tab that is also a link: it picks, then navigates through `adapters.navigate`. */
  href?: string;
  onClick?: (event: MouseEvent) => void;
  /** Names an icon-only tab. */
  accessibilityLabel?: string;
  testID?: string;
  /** Placement only. */
  class?: string;
  /** The label; receives the tab's state. */
  children?: Snippet<[TabItemState]>;
}

interface TabPanelProps {
  /** The TabItem it belongs to. */
  value: string;
  testID?: string;
  /** Placement only. */
  class?: string;
  /** The panel's content. */
  children: Snippet;
}
```

## Guidelines

- Use Tabs for parallel views of content in one area; use SegmentedControl to pick a value and Link or Button for navigation elsewhere.
- Bind `value` when other code reads or sets the tab; otherwise the first enabled tab is picked.
- Give the tablist an `accessibilityLabel` when nothing on the page names it.
- Use `isFullWidthTabItem` (or `variant="filled"`) for a few tabs that should span the width, as on a phone.
- Use `isLazy` when panels are expensive to render or fetch their own data.
- Put spacing inside a panel on your own wrapper (`<div class="py-blade-5">`), not on the TabPanel's `class`.
- Don't put a Badge or icon in the label text: use `trailing` and `leading`.

## Examples

### Payment methods

```svelte
<script lang="ts">
  import { Badge, TabItem, TabPanel, Tabs, Text } from '@razorpay/blade-svelte/components';
  import { CreditCardIcon, UpiIcon, WalletIcon } from '@razorpay/blade-svelte/icons';

  let method = $state('upi');
</script>

<Tabs bind:value={method} accessibilityLabel="Payment methods">
  {#snippet tabList()}
    <TabItem value="upi" leading={UpiIcon}>UPI</TabItem>
    <TabItem value="card" leading={CreditCardIcon}>
      Card
      {#snippet trailing({ isSelected })}
        <Badge size="small" emphasis={isSelected ? 'intense' : 'subtle'}>New</Badge>
      {/snippet}
    </TabItem>
    <TabItem value="wallet" leading={WalletIcon} isDisabled>Wallet</TabItem>
  {/snippet}
  <TabPanel value="upi">
    <div class="py-blade-5"><Text>Pay with any UPI app.</Text></div>
  </TabPanel>
  <TabPanel value="card">
    <div class="py-blade-5"><Text>Credit and debit cards.</Text></div>
  </TabPanel>
  <TabPanel value="wallet">
    <div class="py-blade-5"><Text>Wallets are unavailable right now.</Text></div>
  </TabPanel>
</Tabs>
```

### Filled, full width and lazy

```svelte
<script lang="ts">
  import { TabItem, TabPanel, Tabs, Text } from '@razorpay/blade-svelte/components';
</script>

<Tabs variant="filled" size="small" isLazy onChange={(value) => console.log('Tab', value)}>
  {#snippet tabList()}
    <TabItem value="details">Details</TabItem>
    <TabItem value="activity">Activity</TabItem>
  {/snippet}
  <TabPanel value="details">
    <div class="pt-blade-4"><Text>Order #1234 · ₹1,299</Text></div>
  </TabPanel>
  <TabPanel value="activity">
    <div class="pt-blade-4"><Text color="muted">Loaded when the tab is picked.</Text></div>
  </TabPanel>
</Tabs>
```

### Vertical settings tabs

```svelte
<script lang="ts">
  import { TabItem, TabPanel, Tabs, Text } from '@razorpay/blade-svelte/components';

  let section = $state('profile');
</script>

<Tabs bind:value={section} orientation="vertical" variant="borderless" accessibilityLabel="Settings">
  {#snippet tabList()}
    <TabItem value="profile">Profile</TabItem>
    <TabItem value="security">Security</TabItem>
    <TabItem value="billing">Billing</TabItem>
  {/snippet}
  <TabPanel value="profile"><div class="px-blade-6"><Text>Your business details.</Text></div></TabPanel>
  <TabPanel value="security"><div class="px-blade-6"><Text>Passwords and two-factor login.</Text></div></TabPanel>
  <TabPanel value="billing"><div class="px-blade-6"><Text>Invoices and plans.</Text></div></TabPanel>
</Tabs>
```
