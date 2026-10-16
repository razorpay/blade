## Component Name

Tabs

## Description

Tabs switch between related views of the same page context, such as the Payments, Refunds and Disputes views of a transactions page. Compose `Tabs` with one `TabList` that holds the `TabItem` triggers, and one `TabPanel` per item, as siblings of `TabList`, matched by `value`. Tabs come in `bordered`, `borderless` and `filled` variants, three sizes, and horizontal or vertical orientation. A `TabItem` can have a leading icon, a trailing `Badge` or `Counter`, or render as a link.

## Important Constraints

- `TabList`, `TabItem` and `TabPanel` must be rendered inside `Tabs`; they read the Tabs context and fail without it
- A `TabPanel` is shown only when its `value` matches the selected `TabItem`'s `value`
- Without `value` or `defaultValue`, the first `TabItem` to mount is selected
- In controlled mode (`value` set) Tabs does not change its own selection; update `value` from `onChange`
- `onChange` receives the new value as a plain string, not an object
- `TabItem` needs `children` (label text) or a `leading` icon; with `leading` only, pass `accessibilityLabel`
- `variant="filled"` always stretches tab items to fill the list
- A disabled `TabItem` cannot be selected, and with `href` its link is removed
- `TabList` accepts styled props; `Tabs`, `TabItem` and `TabPanel` do not

## TypeScript Types

These are the props the Tabs component and its sub-components accept.

```typescript
type IconSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';

/**
 * Any icon exported by @razorpay/blade-svelte/components, e.g. HomeIcon.
 * Color values are the icon color tokens listed in Icons.md.
 */
type IconComponent = Component<{ size?: IconSize; color?: string }>;

type TabsProps = {
  /**
   * The content of the component, accepts `TabList` and `TabPanel` components.
   */
  children: Snippet;

  /**
   * The value of the tab to select by default (uncontrolled).
   * When TabItems are rendered conditionally, set this explicitly to avoid
   * dependence on mount order.
   */
  defaultValue?: string;

  /**
   * The currently selected tab value (controlled).
   */
  value?: string;

  /**
   * Callback fired when the selected tab changes.
   */
  onChange?: (value: string) => void;

  /**
   * The orientation of the tabs.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * The size of the tabs.
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * The variant of the tabs.
   * @default 'bordered'
   */
  variant?: 'bordered' | 'borderless' | 'filled';

  /**
   * If `true`, the TabItems will grow to use all the available space.
   * @default false
   */
  isFullWidthTabItem?: boolean;

  /**
   * If `true`, the TabPanel will be rendered only when it becomes active.
   * @default false
   */
  isLazy?: boolean;

  /**
   * Test ID for the element.
   */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
};

type TabItemBaseProps = {
  /**
   * The value of the tab item.
   */
  value: string;

  /**
   * Trailing element snippet — only accepts `Badge` or `Counter` components.
   */
  trailing?: Snippet;

  /**
   * Accessible label for the tab item. Required when only a leading icon is provided
   * and no children text is present (icon-only tabs).
   */
  accessibilityLabel?: string;

  /**
   * If `true`, the tab item will be disabled.
   * @default false
   */
  isDisabled?: boolean;

  /**
   * If set, the tab item will be rendered as a link.
   */
  href?: string;

  /**
   * Callback fired when the tab item is clicked.
   */
  onClick?: (event: MouseEvent) => void;

  /**
   * Test ID for the element.
   */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
};

type TabItemWithChildrenProps = TabItemBaseProps & {
  /**
   * The text label of the tab item.
   */
  children: Snippet;
  leading?: undefined;
};

type TabItemWithLeadingProps = TabItemBaseProps & {
  /**
   * Leading icon component (e.g., HomeIcon). Color is managed internally.
   */
  leading: IconComponent;
  children?: Snippet;
};

type TabItemProps = TabItemWithChildrenProps | TabItemWithLeadingProps;

type TabListProps = {
  /**
   * The tab items to render.
   */
  children: Snippet;

  /**
   * Test ID for the element.
   */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
} & StyledPropsBlade;

type TabPanelProps = {
  /**
   * The value of the tab panel matching its TabItem.
   */
  value: string;

  /**
   * The content of the tab panel.
   */
  children: Snippet;

  /**
   * Test ID for the element.
   */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
};
```

## Usage Guidelines

**Do**

- Use `Tabs` when choosing an option immediately changes the content shown on the page.
- Give each `TabItem` and its `TabPanel` the same `value`, and keep `TabPanel`s as siblings of `TabList`.
- Keep tab labels to one or two words, such as "Payments" or "Refunds".
- Use the `trailing` snippet for a `Counter` with a per-tab count or a `Badge` such as "New".
- Use `isLazy` when panels load heavy content such as tables or charts.
- Set `defaultValue` explicitly when tab items render conditionally.
- Use `variant="filled"` for a compact segmented look inside cards, and `bordered` for page-level sections.
- Use `orientation="vertical"` for settings pages with many sections.

**Don't**

- Don't use `Tabs` to navigate between separate pages or routes; use a navigation component, or `TabItem` with `href` only when each tab maps to a URL of the same page.
- Don't use `Tabs` to pick a value that is submitted in a form; use `RadioGroup`, `ChipGroup` or `SegmentedControl`.
- Don't use `Tabs` to stack collapsible sections; use `Accordion`.
- Don't put anything other than `Badge` or `Counter` in `trailing`; put extra actions in the panel content.
- Don't use icon-only tabs unless the icons are unambiguous; when you do, set `accessibilityLabel` on every item.

## Examples

### Transactions views with counts

Uncontrolled, lazily rendered tabs with leading icons and trailing counters.

```svelte
<script lang="ts">
  import {
    Tabs,
    TabList,
    TabItem,
    TabPanel,
    Counter,
    Badge,
    Text,
    CreditCardIcon,
    BankIcon,
    AlertTriangleIcon,
  } from '@razorpay/blade-svelte/components';
</script>

<Tabs defaultValue="payments" isLazy data-analytics-section="transactions-tabs">
  {#snippet children()}
    <TabList>
      {#snippet children()}
        <TabItem value="payments" leading={CreditCardIcon}>
          {#snippet children()}Payments{/snippet}
          {#snippet trailing()}
            <Counter size="small" value={128} />
          {/snippet}
        </TabItem>
        <TabItem value="settlements" leading={BankIcon}>
          {#snippet children()}Settlements{/snippet}
        </TabItem>
        <TabItem value="disputes" leading={AlertTriangleIcon}>
          {#snippet children()}Disputes{/snippet}
          {#snippet trailing()}
            <Badge size="small" color="negative">2 open</Badge>
          {/snippet}
        </TabItem>
      {/snippet}
    </TabList>
    <TabPanel value="payments">
      {#snippet children()}
        <Text marginTop="spacing.4">128 payments captured today.</Text>
      {/snippet}
    </TabPanel>
    <TabPanel value="settlements">
      {#snippet children()}
        <Text marginTop="spacing.4">Next settlement of ₹2,48,500 is scheduled for 2 Oct.</Text>
      {/snippet}
    </TabPanel>
    <TabPanel value="disputes">
      {#snippet children()}
        <Text marginTop="spacing.4">2 disputes need a response within 5 days.</Text>
      {/snippet}
    </TabPanel>
  {/snippet}
</Tabs>
```

### Controlled filled tabs

Filled, small tabs whose selection is kept in state and changed from outside.

```svelte
<script lang="ts">
  import {
    Tabs,
    TabList,
    TabItem,
    TabPanel,
    Button,
    Text,
  } from '@razorpay/blade-svelte/components';

  let activeRange = $state('today');
</script>

<Button variant="tertiary" size="small" onClick={() => (activeRange = 'month')}>
  Jump to this month
</Button>

<Tabs
  variant="filled"
  size="small"
  value={activeRange}
  onChange={(nextValue) => (activeRange = nextValue)}
>
  {#snippet children()}
    <TabList marginTop="spacing.4">
      {#snippet children()}
        <TabItem value="today">
          {#snippet children()}Today{/snippet}
        </TabItem>
        <TabItem value="week">
          {#snippet children()}This week{/snippet}
        </TabItem>
        <TabItem value="month">
          {#snippet children()}This month{/snippet}
        </TabItem>
      {/snippet}
    </TabList>
    <TabPanel value="today">
      {#snippet children()}
        <Text marginTop="spacing.4">Payment volume today: ₹84,200</Text>
      {/snippet}
    </TabPanel>
    <TabPanel value="week">
      {#snippet children()}
        <Text marginTop="spacing.4">Payment volume this week: ₹5,12,900</Text>
      {/snippet}
    </TabPanel>
    <TabPanel value="month">
      {#snippet children()}
        <Text marginTop="spacing.4">Payment volume this month: ₹21,40,000</Text>
      {/snippet}
    </TabPanel>
  {/snippet}
</Tabs>
```

### Vertical settings tabs

Vertical, large tabs with a disabled item for a merchant settings page.

```svelte
<script lang="ts">
  import { Tabs, TabList, TabItem, TabPanel, Text } from '@razorpay/blade-svelte/components';
</script>

<Tabs orientation="vertical" size="large" defaultValue="profile">
  {#snippet children()}
    <TabList>
      {#snippet children()}
        <TabItem value="profile">
          {#snippet children()}Business profile{/snippet}
        </TabItem>
        <TabItem value="bank">
          {#snippet children()}Bank account{/snippet}
        </TabItem>
        <TabItem value="webhooks" isDisabled>
          {#snippet children()}Webhooks{/snippet}
        </TabItem>
      {/snippet}
    </TabList>
    <TabPanel value="profile">
      {#snippet children()}
        <Text>Update your business name, logo and support contact.</Text>
      {/snippet}
    </TabPanel>
    <TabPanel value="bank">
      {#snippet children()}
        <Text>Change the bank account that receives your settlements.</Text>
      {/snippet}
    </TabPanel>
    <TabPanel value="webhooks">
      {#snippet children()}
        <Text>Webhooks are available after account activation.</Text>
      {/snippet}
    </TabPanel>
  {/snippet}
</Tabs>
```
