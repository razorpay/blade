## Component Name

ActionList

## Description

ActionList is a vertical list of selectable or actionable rows, used on its own, inside a `BottomSheet`, or inside a `DropdownOverlay` (see Dropdown.md). Each `ActionListItem` has a title, optional description, `leading` / `trailing` / `titleSuffix` snippets, a negative intent and link rendering via `href`. Selection is controlled with `selectedValue` and `onAction`, in `single` or `multiple` mode (multiple shows a checkbox per row). This file also documents `ActionListSection`, `ActionListItemIcon`, `ActionListItemAsset`, `ActionListItemAvatar`, `ActionListItemText`, `ActionListItemBadge` and `ActionListItemBadgeGroup`.

## Important Constraints

- Selection is fully controlled: `onAction` only reports `{ value }`; you must update `selectedValue` yourself (a `string` in `single` mode, a `string[]` you toggle in `multiple` mode)
- `ActionListItem`'s `isSelected` wins over the list's `selectedValue`; when omitted, the row is selected if `selectedValue === value` (or includes it in `multiple` mode)
- Inside a `Dropdown`, selection is owned by the Dropdown: `selectedValue` and `isSelected` are ignored and the Dropdown's `selectionType` drives highlight and closing
- With `selectionType="multiple"`, every row renders a visual (`aria-hidden`) checkbox in place of its `leading` snippet
- `isDisabled` blocks the click: neither `onClick` nor `onAction` fires and `aria-disabled` is set
- `href` renders the row as an `<a>`; without it the row is a `<button type="button">`
- Children are not validated at runtime; only `ActionListItem` and `ActionListSection` belong in `ActionList`, and only the `ActionListItem*` helpers belong in `leading`, `trailing` and `titleSuffix`
- `ActionListItemIcon` always renders at `size="medium"` with a color taken from the row (negative, disabled or normal); you cannot set its size or color
- `ActionListItemAvatar` forces `size="xsmall"`; `ActionListItemBadge` forces `size="medium"` and a `spacing.3` left margin
- `ActionListItemAsset` renders a 16x12 image, sized for country flags and small logos
- `ActionListSection` always renders its title and a divider after its items
- Inside a `BottomSheet`, set `hasActionList` on `BottomSheetBody` so the sheet owns scrolling and padding
- Partial port of React: `isVirtualized`, AutoComplete filtering and the `Menu` / `SelectInput` couplings are not available

## TypeScript Types

These are the props the ActionList component and its sub-components accept.

```typescript
/** Selection mode of the list — `single` (default) or `multiple`. */
type ActionListSelectionType = 'single' | 'multiple';

/** Payload passed to `ActionList`'s `onAction` when a row is activated. */
type ActionListItemSelectPayload = { value: string };

/** Payload passed to `ActionListItem`'s `onClick` (web-only). */
type ActionListItemClickPayload = {
  /** The item's `value`. */
  value: string;
  /** The item's selected state at click time. */
  isSelected?: boolean;
  /** Native click event. */
  event: MouseEvent;
};

interface ActionListBaseProps extends StyledPropsBlade {
  /**
   * Accepts `ActionListItem` / `ActionListSection` children.
   */
  children: Snippet;
  /**
   * Fired when a row is activated, once per toggle, with the item's `value`.
   *
   * The consumer owns selection state: in `single` mode update `selectedValue`
   * (and typically close the surrounding BottomSheet); in `multiple` mode
   * toggle the `value` in/out of your `string[]`. This callback does not
   * auto-manage the array.
   */
  onAction?: (payload: ActionListItemSelectPayload) => void;
  /**
   * Test ID for the container element.
   */
  testID?: string;
  // Analytics attributes
  [key: `data-analytics-${string}`]: string;
}

interface ActionListSingleProps extends ActionListBaseProps {
  /**
   * Selection mode: one item selected at a time.
   *
   * @default 'single'
   */
  selectionType?: 'single';
  /**
   * Currently selected item value (controlled). Pass the `value` of the
   * selected `ActionListItem`. Drives `aria-selected` on rows.
   */
  selectedValue?: string;
}

interface ActionListMultipleProps extends ActionListBaseProps {
  /**
   * Selection mode: many items selectable. Each row renders a (visual,
   * `aria-hidden`) checkbox indicator in place of its `leading` content.
   * `aria-multiselectable` is set on the container.
   */
  selectionType: 'multiple';
  /**
   * Currently selected item values (controlled). Pass an array of `value`s
   * for all selected `ActionListItem`s. Drives `aria-selected` on rows.
   */
  selectedValue?: string[];
}

/** Props for the `ActionList` container — `selectionType` discriminates `selectedValue`. */
type ActionListProps = ActionListSingleProps | ActionListMultipleProps;

interface ActionListItemProps {
  /**
   * Primary label of the item.
   */
  title: string;
  /**
   * Secondary description rendered under the title.
   */
  description?: string;
  /**
   * Identity of the item used for selection and returned via `onAction` /
   * form submissions.
   */
  value: string;
  /**
   * Link to open when the item is clicked. Renders the row as an `<a>`.
   */
  href?: string;
  /**
   * HTML `target` of the link (only relevant with `href`).
   */
  target?: string;
  /**
   * Content on the left of the item. Holds `ActionListItemIcon`,
   * `ActionListItemAsset`, or `ActionListItemAvatar`.
   *
   * Overridden by the checkbox indicator when the list is `selectionType="multiple"`.
   */
  leading?: Snippet;
  /**
   * Content on the right of the item. Holds `ActionListItemText` or an icon.
   */
  trailing?: Snippet;
  /**
   * Content rendered immediately next to the title (same row). Holds
   * `ActionListItemBadge` or `ActionListItemBadgeGroup`.
   */
  titleSuffix?: Snippet;
  /**
   * Click handler (web-only). `value` is the item's string identifier,
   * `isSelected` is the current selected state.
   */
  onClick?: (payload: ActionListItemClickPayload) => void;
  /**
   * If `true`, the item is disabled — click is guarded and `aria-disabled` set.
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Explicitly marks the item selected. When omitted, selection is derived from
   * the ActionList `selectedValue === value`.
   */
  isSelected?: boolean;
  /**
   * Negative intent — renders negative title text and hover background.
   */
  intent?: 'negative';
  /**
   * Test ID for the row element.
   */
  testID?: string;
  // Analytics attributes
  [key: `data-analytics-${string}`]: string;
}

interface ActionListSectionProps {
  /**
   * Section title, announced as the group label.
   */
  title: string;
  /**
   * `ActionListItem` children belonging to this section.
   */
  children: Snippet;
  /**
   * Test ID for the section element.
   */
  testID?: string;
  // Analytics attributes
  [key: `data-analytics-${string}`]: string;
}

type IconSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';

/**
 * Any icon exported by @razorpay/blade-svelte/components, e.g. HomeIcon.
 * Color values are the icon color tokens listed in Icons.md.
 */
type IconComponent = Component<{ size?: IconSize; color?: string }>;

/**
 * Props for `ActionListItemIcon` — a leading/trailing icon whose color follows
 * the row's disabled/negative state (mirrors React `useBaseMenuItem`).
 */
interface ActionListItemIconProps {
  /**
   * Icon component to render (e.g. `HomeIcon`). Rendered at `size="medium"`;
   * color is derived from the row context.
   */
  icon: IconComponent;
}

interface ActionListItemAssetProps {
  /**
   * Source of the image.
   */
  src: string;
  /**
   * Alt text for the image.
   */
  alt: string;
}

interface ActionListItemTextProps {
  /**
   * Caption text. Color follows the row's disabled state.
   */
  children: Snippet;
}

/**
 * Abbreviated. Every prop is listed in Avatar.md; ActionListItemAvatar accepts all of them except `size`.
 */
type AvatarProps = {
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  /** @default 'circle' */
  variant?: 'circle' | 'square';
  /** @default 'neutral' */
  color?: 'primary' | 'positive' | 'negative' | 'notice' | 'information' | 'neutral';
  /** Custom icon component to use as the avatar. */
  icon?: IconComponent;
  /** The name of the avatar, used to generate initials and as the image alt fallback. */
  name?: string;
  /** Custom image source */
  src?: string;
  /** The `alt` attribute for the `img` element */
  alt?: string;
  /** Custom icon component to render at bottom of the avatar. */
  bottomAddon?: IconComponent;
  /** Test ID for the element. */
  testID?: string;
};

/**
 * Props for `ActionListItemAvatar` — a leading avatar. Wraps `Avatar` and forces
 * `size="xsmall"`; every other `Avatar` prop except `size` is accepted.
 */
type ActionListItemAvatarProps = Omit<AvatarProps, 'size'>;

/**
 * Same as BadgeProps in Badge.md.
 */
interface BadgeProps extends StyledPropsBlade {
  /**
   * Sets the label for the badge.
   */
  children: string | Snippet;
  /**
   * Sets the color of the badge.
   * @default 'neutral'
   */
  color?: 'neutral' | 'positive' | 'negative' | 'notice' | 'information' | 'primary';
  /**
   * Sets the emphasis (contrast) of the badge.
   * @default 'subtle'
   */
  emphasis?: 'subtle' | 'intense';
  /**
   * Sets the size of the badge.
   * @default 'medium'
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  /**
   * Icon to be displayed in the badge.
   */
  icon?: IconComponent;
  /**
   * Test ID for the badge element.
   */
  testID?: string;
  // Analytics attributes
  [key: `data-analytics-${string}`]: string;
}

/**
 * Props for `ActionListItemBadge` — wraps `Badge` (forced `size="medium"` with a
 * `spacing.3` left margin). Accepts all `Badge` props except `size`.
 */
type ActionListItemBadgeProps = Omit<BadgeProps, 'size'>;

/**
 * Props for `ActionListItemBadgeGroup` — a flex-row container for one or more
 * `ActionListItemBadge`, intended for the `titleSuffix` slot.
 */
interface ActionListItemBadgeGroupProps {
  /**
   * `ActionListItemBadge` children laid out in a row.
   */
  children: Snippet;
}
```

## Usage Guidelines

**Do**

- Use ActionList for a list of choices or commands that lives in a `BottomSheet`, a `DropdownOverlay` or a side panel.
- Give every `ActionListItem` a unique, stable `value`; selection, `onAction` and Dropdown option lookup all key on it.
- Group related rows with `ActionListSection` and a short title such as "Account" or "Payment methods".
- Put `ActionListItemIcon`, `ActionListItemAsset` or `ActionListItemAvatar` in `leading`, `ActionListItemText` or `ActionListItemIcon` in `trailing`, and `ActionListItemBadge` / `ActionListItemBadgeGroup` in `titleSuffix`.
- Use `intent="negative"` for destructive rows such as "Deactivate account" or "Log out", and place them last.
- Use `description` for one line of supporting text; keep titles to a few words.
- In `single` mode inside a `BottomSheet`, set `selectedValue` and close the sheet in `onAction`.
- Use `href` with `target="_blank"` for rows that open documentation or another dashboard page.

**Don't**

- Don't use ActionList for 2 to 5 always-visible options in a form; use `RadioGroup` or `CheckboxGroup`.
- Don't put `Button`, `Checkbox` or free-form markup inside rows; use the `ActionListItem*` helpers so colors follow the row state.
- Don't render a raw icon in `leading` when the row can be disabled or negative; use `ActionListItemIcon` so the color follows the state.
- Don't expect `onAction` to manage the `string[]` in `multiple` mode; toggle the value yourself.
- Don't set `selectedValue` on an ActionList inside a `Dropdown`; use `InputDropdownButton`'s `value` / `defaultValue` (see Dropdown.md).
- Don't render hundreds of rows; there is no virtualization, so filter or paginate the data first.

## Examples

### Account menu with sections

A standalone list with sections, leading icons and avatar, a badge group, a link row, a disabled row and a negative action.

```svelte
<script lang="ts">
  import {
    ActionList,
    ActionListItem,
    ActionListSection,
    ActionListItemIcon,
    ActionListItemAvatar,
    ActionListItemText,
    ActionListItemBadge,
    ActionListItemBadgeGroup,
    UserIcon,
    BuildingIcon,
    InfoIcon,
    CloseIcon,
    LockIcon,
  } from '@razorpay/blade-svelte/components';

  function handleAction({ value }: { value: string }): void {
    if (value === 'logout') {
      console.log('Logging out');
    }
  }
</script>

<ActionList onAction={handleAction} testID="account-menu" data-analytics-section="account-menu">
  {#snippet children()}
    <ActionListSection title="Account">
      {#snippet children()}
        <ActionListItem title="Acme Electronics" description="MID: 8Hc2tK1Qm0" value="business">
          {#snippet leading()}
            <ActionListItemAvatar name="Acme Electronics" variant="square" color="primary" />
          {/snippet}
        </ActionListItem>
        <ActionListItem title="My profile" value="profile">
          {#snippet leading()}
            <ActionListItemIcon icon={UserIcon} />
          {/snippet}
          {#snippet trailing()}
            <ActionListItemText>⌘ + P</ActionListItemText>
          {/snippet}
        </ActionListItem>
        <ActionListItem title="Settlements" value="settlements">
          {#snippet leading()}
            <ActionListItemIcon icon={BuildingIcon} />
          {/snippet}
          {#snippet titleSuffix()}
            <ActionListItemBadgeGroup>
              {#snippet children()}
                <ActionListItemBadge color="notice">On hold</ActionListItemBadge>
                <ActionListItemBadge color="information" icon={InfoIcon}>T+2</ActionListItemBadge>
              {/snippet}
            </ActionListItemBadgeGroup>
          {/snippet}
        </ActionListItem>
        <ActionListItem title="Two-factor auth (coming soon)" value="2fa" isDisabled>
          {#snippet leading()}
            <ActionListItemIcon icon={LockIcon} />
          {/snippet}
        </ActionListItem>
      {/snippet}
    </ActionListSection>
    <ActionListItem
      title="API documentation"
      value="docs"
      href="https://razorpay.com/docs/api"
      target="_blank"
    />
    <ActionListItem title="Log out" value="logout" intent="negative">
      {#snippet leading()}
        <ActionListItemIcon icon={CloseIcon} />
      {/snippet}
    </ActionListItem>
  {/snippet}
</ActionList>
```

### Multi-select payment methods

A `multiple` list where the consumer toggles values in its own array.

```svelte
<script lang="ts">
  import { ActionList, ActionListItem, Text } from '@razorpay/blade-svelte/components';

  let enabledMethods = $state<string[]>(['upi', 'cards']);

  function toggleMethod({ value }: { value: string }): void {
    enabledMethods = enabledMethods.includes(value)
      ? enabledMethods.filter((method) => method !== value)
      : [...enabledMethods, value];
  }
</script>

<Text size="small" color="surface.text.gray.muted" marginBottom="spacing.3">
  {enabledMethods.length} payment methods enabled
</Text>
<ActionList selectionType="multiple" selectedValue={enabledMethods} onAction={toggleMethod}>
  {#snippet children()}
    <ActionListItem title="UPI" value="upi" description="Google Pay, PhonePe, Paytm and more" />
    <ActionListItem title="Cards" value="cards" description="Visa, Mastercard, RuPay" />
    <ActionListItem title="Netbanking" value="netbanking" description="58 banks supported" />
    <ActionListItem title="EMI" value="emi" description="Requires activation" isDisabled />
  {/snippet}
</ActionList>
```

### Settlement bank picker in a BottomSheet

A single-select list inside a `BottomSheet` that stores the choice and closes the sheet.

```svelte
<script lang="ts">
  import {
    ActionList,
    ActionListItem,
    ActionListItemAvatar,
    ActionListItemText,
    BottomSheet,
    BottomSheetHeader,
    BottomSheetBody,
    Button,
    BankIcon,
  } from '@razorpay/blade-svelte/components';

  const accounts = [
    { value: 'hdfc_4521', bank: 'HDFC Bank', ifsc: 'HDFC0000123', last4: '4521' },
    { value: 'icici_9087', bank: 'ICICI Bank', ifsc: 'ICIC0000456', last4: '9087' },
    { value: 'sbi_1122', bank: 'State Bank of India', ifsc: 'SBIN0000789', last4: '1122' },
  ];

  let isOpen = $state(false);
  let selectedAccount = $state<string | undefined>('hdfc_4521');
</script>

<Button variant="secondary" icon={BankIcon} onClick={() => (isOpen = true)}>
  Change settlement account
</Button>

<BottomSheet {isOpen} onDismiss={() => (isOpen = false)}>
  {#snippet children()}
    <BottomSheetHeader title="Settle to" subtitle="Pick the bank account for payouts" />
    <BottomSheetBody hasActionList>
      {#snippet children()}
        <ActionList
          selectedValue={selectedAccount}
          onAction={({ value }) => {
            selectedAccount = value;
            isOpen = false;
          }}
        >
          {#snippet children()}
            {#each accounts as account (account.value)}
              <ActionListItem title={account.bank} description={account.ifsc} value={account.value}>
                {#snippet leading()}
                  <ActionListItemAvatar icon={BankIcon} variant="square" color="information" />
                {/snippet}
                {#snippet trailing()}
                  <ActionListItemText>••{account.last4}</ActionListItemText>
                {/snippet}
              </ActionListItem>
            {/each}
          {/snippet}
        </ActionList>
      {/snippet}
    </BottomSheetBody>
  {/snippet}
</BottomSheet>
```
