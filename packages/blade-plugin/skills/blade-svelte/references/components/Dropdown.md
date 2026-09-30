## Component Name

Dropdown

## Description

Dropdown opens a floating overlay under a trigger and holds an `ActionList` of options, for row action menus, sort menus and compact single or multiple selection. `DropdownOverlay` is the portaled, auto-positioned surface, `DropdownHeader` and `DropdownFooter` add a title and actions around the list, and `InputDropdownButton` is a select-style trigger that shows the selected option and reports `onChange`. Menu triggers can be a `Button`, `Link` or `IconButton` that you wire to `isOpen`.

## Important Constraints

- Partial port of React Dropdown. Not available in blade-svelte: `SelectInput`, `AutoComplete`, `SearchInput` as a trigger, `DropdownButton`, `DropdownLink`, `DropdownIconButton`, `FilterChipSelectInput` / `FilterChipGroup`, `TreeView` / `ListView` overlay content, and the automatic `BottomSheet` switch on mobile
- Children are one trigger followed by one `DropdownOverlay`; the overlay holds an optional `DropdownHeader`, an `ActionList`, and an optional `DropdownFooter`
- `Button`, `Link` and `IconButton` triggers are not wired automatically: pass `isOpen` and `onOpenChange` to Dropdown and toggle the state in the trigger's `onClick`
- Dropdown closes itself on outside pointer-down, on Escape and after a pick in `single` mode, by calling `onOpenChange(false)`; `multiple` mode stays open
- Only `InputDropdownButton` registers as a trigger: its click toggles the overlay, it supports arrow-key navigation and typeahead, and it shows the selected option's `title` (or "N items selected")
- Selection inside a Dropdown is owned by the Dropdown: ActionList `selectedValue` and ActionListItem `isSelected` are ignored. Set `selectionType="multiple"` on both `Dropdown` and `ActionList` to get checkboxes and multi-select
- `InputDropdownButton` needs exactly one of `value` (controlled) or `defaultValue` (uncontrolled); a `value` that matches no `ActionListItem` `value` selects nothing
- `InputDropdownButton` fires `onChange` only on user selection, never for the initial `value` / `defaultValue`; in `multiple` mode `value` is the selected values joined with `", "`
- `InputDropdownButton` with `isDisabled` ignores clicks, keydown and blur
- `DropdownOverlay` is portaled to `document.body` and stays mounted (hidden) while closed; it flips to the top when there is no room below
- Menu overlays size to their content; passing `referenceRef` makes the overlay match the reference element's width unless `width` is set
- Adding `DropdownFooter` switches the list's role from `menu` / `listbox` to `dialog`, so footer controls stay reachable by keyboard

## TypeScript Types

These are the props the Dropdown component and its sub-components accept.

```typescript
/** Selection mode of the Dropdown. */
type DropdownSelectionType = 'single' | 'multiple';

interface DropdownProps extends StyledPropsBlade {
  /**
   * Trigger + `DropdownOverlay` children.
   */
  children: Snippet;
  /**
   * Control the open/close state (controlled mode). Leave undefined for
   * uncontrolled behavior.
   */
  isOpen?: boolean;
  /**
   * Called whenever the open state changes.
   */
  onOpenChange?: (isOpen: boolean) => void;
  /**
   * Selection mode.
   * @default 'single'
   */
  selectionType?: DropdownSelectionType;
  /**
   * Test ID for the container element.
   */
  testID?: string;
  // Analytics attributes
  [key: `data-analytics-${string}`]: string;
}

/** Placement values from @floating-ui/dom. */
type Placement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end';

interface DropdownOverlayProps {
  /**
   * Overlay content — `DropdownHeader?`, `ActionList`, `DropdownFooter?`.
   */
  children: Snippet;
  /**
   * z-index of the overlay.
   * @default 1001
   */
  zIndex?: number;
  /**
   * Override the overlay width.
   */
  width?: string;
  /**
   * Override the overlay min-width.
   */
  minWidth?: string;
  /**
   * Override the overlay max-width.
   */
  maxWidth?: string;
  /**
   * Element to position the overlay relative to. When omitted, the Dropdown's
   * own trigger wrapper is used. Svelte uses an element binding instead of
   * React's ref object. Named `referenceRef` to match the React prop and the
   * `initialFocusRef` convention used by Modal / BottomSheet.
   */
  referenceRef?: HTMLElement | null;
  /**
   * Placement of the overlay.
   * @default 'bottom-start'
   */
  defaultPlacement?: Placement;
  /**
   * Test ID for the overlay element.
   */
  testID?: string;
  // Analytics attributes
  [key: `data-analytics-${string}`]: string;
}

interface DropdownHeaderProps {
  /** Header title text. */
  title?: string;
  /** Secondary text below the title. */
  subtitle?: string;
  /** Leading slot (left of the title). */
  leading?: Snippet;
  /** Trailing slot (right side). */
  trailing?: Snippet;
  /** Slot rendered adjacent to the title text. */
  titleSuffix?: Snippet;
  /** Inner children (e.g. AutoComplete in header). */
  children?: Snippet;
  /** Test ID for the header element. */
  testID?: string;
  // Analytics attributes
  [key: `data-analytics-${string}`]: string;
}

interface DropdownFooterProps {
  /** Footer content. */
  children?: Snippet;
  /** Test ID for the footer element. */
  testID?: string;
  // Analytics attributes
  [key: `data-analytics-${string}`]: string;
}

type BaseInputSize = 'xsmall' | 'small' | 'medium' | 'large';

type IconSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';

/**
 * Any icon exported by @razorpay/blade-svelte/components, e.g. CreditCardIcon.
 * Color values are the icon color tokens listed in Icons.md.
 */
type IconComponent = Component<{ size?: IconSize; color?: string }>;

type BaseInputDropdownButtonProps = {
  /** Controls open state of the dropdown. */
  isOpen?: boolean;
  /** Called when the button loses focus. */
  onBlur?: (event: FocusEvent) => void;
  /** Called on keydown. */
  onKeyDown?: (event: KeyboardEvent) => void;
  /** Called on click. */
  onClick?: (event: MouseEvent) => void;
  /** Accessibility label. @default `change ${displayValue} filter` */
  accessibilityLabel?: string;
  /** Disabled state. */
  isDisabled?: boolean;
  /** Called when the selected value changes. */
  onChange?: (props: { name: string; value: string }) => void;
  /** Name used in the change payload. */
  name?: string;
  /** Test ID for the button element. */
  testID?: string;
  /** Leading icon component. */
  icon?: IconComponent;
  /** Custom leading slot (e.g. a flag). */
  leading?: Snippet;
  /**
   * Show the selected value text in the trigger.
   * @default true
   */
  showDisplayValue?: boolean;
  /**
   * Size of the button.
   * @default 'medium'
   */
  size?: BaseInputSize;
  // Analytics attributes
  [key: `data-analytics-${string}`]: string;
};

type ControlledInputDropdownButtonProps = BaseInputDropdownButtonProps & {
  /** Controlled selected value. */
  value: string;
  defaultValue?: never;
};

type UncontrolledInputDropdownButtonProps = BaseInputDropdownButtonProps & {
  value?: never;
  /** Initial selected value (uncontrolled). */
  defaultValue: string;
};

type InputDropdownButtonProps =
  | ControlledInputDropdownButtonProps
  | UncontrolledInputDropdownButtonProps;
```

## Usage Guidelines

**Do**

- Use Dropdown for overflow row actions ("Refund", "Download invoice"), sort menus and compact filters where the options don't need to stay visible.
- Always put an `ActionList` inside `DropdownOverlay`, with a unique `value` on every `ActionListItem`.
- Keep open state in `$state` and wire it both ways: `isOpen={open}`, `onOpenChange={(next) => (open = next)}` and `onClick={() => (open = !open)}` on the trigger.
- Use `IconButton` with `MoreHorizontalIcon` and an `accessibilityLabel` for per-row action menus.
- Use `InputDropdownButton` for a compact value picker such as currency or country code, and read the result from `onChange`.
- Use `DropdownHeader` for a title on longer lists and `DropdownFooter` for an "Apply" action in multi-select filters.
- Use `intent="negative"` on destructive action rows and keep them last.

**Don't**

- Don't use Dropdown for 2 to 5 options in a form where users compare choices; use `RadioGroup` or `ChipGroup`.
- Don't use Dropdown for a full form field with a label and validation; blade-svelte has no `SelectInput` yet, so tell the user and use `RadioGroup` or a `BottomSheet` with `ActionList`.
- Don't pass `selectedValue` to the ActionList inside a Dropdown; use `InputDropdownButton`'s `value` or track picks with ActionList `onAction`.
- Don't put more than one trigger or overlay in a Dropdown; nest another Dropdown instead.
- Don't rely on Dropdown on small screens; render a `BottomSheet` with the same `ActionList` for mobile layouts.
- Don't put form controls other than `Checkbox` and `Button` in `DropdownFooter`; move complex forms to a `Modal`.

## Examples

### Payment row actions

An `IconButton` trigger that opens an action menu with a link row and a destructive action.

```svelte
<script lang="ts">
  import {
    Dropdown,
    DropdownOverlay,
    ActionList,
    ActionListItem,
    IconButton,
    MoreHorizontalIcon,
  } from '@razorpay/blade-svelte/components';

  let isMenuOpen = $state(false);

  function handleAction({ value }: { value: string }): void {
    if (value === 'refund') {
      console.log('Opening refund flow for pay_29QQoUBi66xm2f');
    }
  }
</script>

<Dropdown isOpen={isMenuOpen} onOpenChange={(next) => (isMenuOpen = next)}>
  {#snippet children()}
    <IconButton
      icon={MoreHorizontalIcon}
      accessibilityLabel="Actions for payment pay_29QQoUBi66xm2f"
      onClick={() => (isMenuOpen = !isMenuOpen)}
    />
    <DropdownOverlay defaultPlacement="bottom-end" testID="payment-actions">
      {#snippet children()}
        <ActionList onAction={handleAction}>
          {#snippet children()}
            <ActionListItem title="Issue refund" value="refund" />
            <ActionListItem title="Download receipt" value="receipt" />
            <ActionListItem
              title="View in dashboard"
              value="dashboard"
              href="https://dashboard.razorpay.com/app/payments"
              target="_blank"
            />
            <ActionListItem title="Mark as disputed" value="dispute" intent="negative" />
          {/snippet}
        </ActionList>
      {/snippet}
    </DropdownOverlay>
  {/snippet}
</Dropdown>
```

### Currency picker

A controlled `InputDropdownButton` that shows the selected currency and reports changes.

```svelte
<script lang="ts">
  import {
    Dropdown,
    DropdownOverlay,
    ActionList,
    ActionListItem,
    InputDropdownButton,
    Text,
  } from '@razorpay/blade-svelte/components';

  let currency = $state('INR');
</script>

<Text size="small" color="surface.text.gray.muted">Settlement currency</Text>
<Dropdown>
  {#snippet children()}
    <InputDropdownButton
      name="settlementCurrency"
      value={currency}
      accessibilityLabel={`Change settlement currency, ${currency} selected`}
      onChange={({ value }) => (currency = value)}
      data-analytics-action="change-currency"
    />
    <DropdownOverlay>
      {#snippet children()}
        <ActionList>
          {#snippet children()}
            <ActionListItem title="INR" description="Indian Rupee" value="INR" />
            <ActionListItem title="USD" description="US Dollar" value="USD" />
            <ActionListItem title="EUR" description="Euro" value="EUR" />
            <ActionListItem title="GBP" description="British Pound" value="GBP" />
          {/snippet}
        </ActionList>
      {/snippet}
    </DropdownOverlay>
  {/snippet}
</Dropdown>
```

### Multi-select filter with header and footer

A `Button` trigger with a multi-select list, a header and an Apply footer that closes the overlay.

```svelte
<script lang="ts">
  import {
    Dropdown,
    DropdownOverlay,
    DropdownHeader,
    DropdownFooter,
    ActionList,
    ActionListItem,
    Button,
    ChevronDownIcon,
  } from '@razorpay/blade-svelte/components';

  let isFilterOpen = $state(false);
  let statuses = $state<string[]>([]);

  function toggleStatus({ value }: { value: string }): void {
    statuses = statuses.includes(value)
      ? statuses.filter((status) => status !== value)
      : [...statuses, value];
  }

  function applyFilter(): void {
    console.log('Filtering payments by', statuses);
    isFilterOpen = false;
  }
</script>

<Dropdown
  selectionType="multiple"
  isOpen={isFilterOpen}
  onOpenChange={(next) => (isFilterOpen = next)}
>
  {#snippet children()}
    <Button
      variant="secondary"
      icon={ChevronDownIcon}
      iconPosition="right"
      onClick={() => (isFilterOpen = !isFilterOpen)}
    >
      {statuses.length > 0 ? `Status (${statuses.length})` : 'Status'}
    </Button>
    <DropdownOverlay minWidth="240px">
      {#snippet children()}
        <DropdownHeader title="Payment status" subtitle="Pick one or more" />
        <ActionList selectionType="multiple" onAction={toggleStatus}>
          {#snippet children()}
            <ActionListItem title="Captured" value="captured" />
            <ActionListItem title="Authorized" value="authorized" />
            <ActionListItem title="Failed" value="failed" />
            <ActionListItem title="Refunded" value="refunded" />
          {/snippet}
        </ActionList>
        <DropdownFooter>
          {#snippet children()}
            <Button isFullWidth onClick={applyFilter}>Apply</Button>
          {/snippet}
        </DropdownFooter>
      {/snippet}
    </DropdownOverlay>
  {/snippet}
</Dropdown>
```
