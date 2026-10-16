## Component Name

Avatar

## Description

Avatar is a standard visual for a user or a business: a profile image, initials made from `name`, or an icon. It comes in five sizes, `circle` and `square` shapes and six colors, and becomes a button or link when given `onClick` or `href`. `topAddon` (a snippet) and `bottomAddon` (an icon) add a status dot or a verified mark. AvatarGroup stacks several Avatars with an overlap, shares one size across them and collapses the rest into a `+N` counter with `maxCount`.

## Important Constraints

- Content priority is fixed: `src` renders the image, otherwise `name` renders initials (first letters of the first and last word, or the first two letters of a single word), otherwise `icon`, and with none of them `UserIcon` is shown
- When `src` is set, `alt` falls back to `name`; with neither, the image has no alt text
- `onClick` renders the avatar as a `<button>`; `href` renders it as an `<a>` (and takes precedence as the element). Without either the avatar is not focusable or clickable
- `target="_blank"` without `rel` sets `rel="noreferrer noopener"` automatically
- `bottomAddon` only accepts an icon component; Avatar renders it at a size derived from the avatar size
- `topAddon` accepts any snippet; blade-svelte has no `Indicator` component yet, so the React "Indicator only" pairing is not available
- Inside `AvatarGroup`, the group's `size` overrides each Avatar's own `size`
- `AvatarGroup` counts every Avatar rendered inside it, in order; Avatars past `maxCount` are hidden and a `+N` counter is appended
- `styleOverride.root` applies to the visual avatar box (the element that clips the image), not to the addons
- Avatar has no `accessibilityLabel` prop; the accessible content is the image `alt` or the initials text

## TypeScript Types

These are the props the Avatar and AvatarGroup components accept.

```typescript
type AvatarSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

type AvatarVariant = 'circle' | 'square';

type AvatarColor = 'primary' | 'positive' | 'negative' | 'notice' | 'information' | 'neutral';

type AvatarDensity = 'compact' | 'normal' | 'comfortable';

type AvatarSlot = 'root';

type IconSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';

/**
 * Any icon exported by @razorpay/blade-svelte/components, e.g. BuildingIcon.
 * Color values are the icon color tokens listed in Icons.md.
 */
type IconComponent = Component<{ size?: IconSize; color?: string }>;

/**
 * Props for the Avatar component.
 *
 * An avatar component is a standardized visual representation of a user or entity.
 */
type AvatarProps = {
  /**
   * The size of the avatar.
   * @default 'medium'
   */
  size?: AvatarSize;
  /**
   * The visual variant of the avatar.
   * @default 'circle'
   */
  variant?: AvatarVariant;
  /**
   * The color theme of the avatar.
   * @default 'neutral'
   */
  color?: AvatarColor;
  /**
   * Custom icon component to use as the avatar.
   */
  icon?: IconComponent;
  /**
   * The name of the avatar, used to generate initials.
   * If src has loaded, the name will be used as the alt attribute of the img.
   * If src is not loaded, the name will be used to create the initials.
   */
  name?: string;
  /**
   * Automatically renders avatar with `a` tag with `href` on web
   */
  href?: string;
  /**
   * Anchor target attribute.
   * Should only be used alongside `href`.
   */
  target?: string;
  /**
   * Anchor rel attribute.
   * Should only be used alongside `href`.
   */
  rel?: string;
  /**
   * Click handler for the avatar.
   */
  onClick?: (event: MouseEvent) => void;
  /**
   * Whether the avatar is selected. Adds a thicker primary border.
   */
  isSelected?: boolean;
  /**
   * Custom icon component to render at bottom of the avatar.
   * Only accepts IconComponent.
   */
  bottomAddon?: IconComponent;
  /**
   * Custom snippet to render at top of the avatar.
   * Typically used with an Indicator component.
   *
   * Size mapping for Indicator:
   * - xsmall/small → 'small'
   * - medium/large → 'medium'
   * - xlarge → 'large'
   */
  topAddon?: Snippet;
  /**
   * Test ID for the element.
   */
  testID?: string;
  /**
   * Per-slot classname overrides. Merged under provider `componentConfig.Avatar.styleOverride`;
   * instance values win on conflicts.
   */
  styleOverride?: Partial<Record<AvatarSlot, string>>;
  /**
   * Function called when the avatar loses focus.
   */
  onBlur?: (event: FocusEvent) => void;
  /**
   * Function called when the avatar gains focus.
   */
  onFocus?: (event: FocusEvent) => void;
  /**
   * Function called when the mouse leaves the avatar.
   */
  onMouseLeave?: (event: MouseEvent) => void;
  /**
   * Function called when the mouse moves over the avatar.
   */
  onMouseMove?: (event: MouseEvent) => void;
  /**
   * Function called when the mouse button is pressed on the avatar.
   */
  onMouseDown?: (event: MouseEvent) => void;
  /**
   * Function called when a pointer is pressed on the avatar.
   */
  onPointerDown?: (event: PointerEvent) => void;
  /**
   * Function called when a pointer enters the avatar.
   */
  onPointerEnter?: (event: PointerEvent) => void;
  /**
   * Function called when a touch starts on the avatar.
   */
  onTouchStart?: (event: TouchEvent) => void;
  /**
   * Function called when a touch ends on the avatar.
   */
  onTouchEnd?: (event: TouchEvent) => void;
  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
  // Image-related props
  /**
   * Custom image source
   */
  src?: string;
  /**
   * The `alt` attribute for the `img` element
   */
  alt?: string;
  /**
   * The `srcSet` attribute for the `img` element, useful for responsive images.
   */
  srcSet?: string;
  /**
   * CORS settings attributes
   */
  crossOrigin?: 'anonymous' | 'use-credentials' | '';
  /**
   * Defines which referrer is sent when fetching the resource.
   */
  referrerPolicy?: ReferrerPolicy;
} & StyledPropsBlade;

/**
 * Props for the AvatarGroup component.
 *
 * The AvatarGroup component is used to group Avatars together.
 */
type AvatarGroupProps = {
  /**
   * Children elements representing the avatars to stack.
   */
  children: Snippet;
  /**
   * The size of each avatar within the group. Propagates to all avatars.
   * @default 'medium'
   */
  size?: AvatarSize;
  /**
   * Controls the spacing (overlap) between avatars in the group.
   * - `compact` — tighter overlap, avatars are closer together
   * - `normal` — default spacing
   * - `comfortable` — looser overlap, more space between avatars
   * @default 'normal'
   */
  density?: AvatarDensity;
  /**
   * The maximum number of avatars to display before truncating.
   */
  maxCount?: number;
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

- Use `variant="circle"` for people and `variant="square"` for businesses, banks or other entities.
- Pass `name` whenever you know it, even with `src`, so there is alt text and a fallback.
- Use `icon` (for example `BuildingIcon`) when there is no photo or name, such as an unnamed sub-merchant.
- Use `color` to tell entities apart in a list of initials; keep `neutral` for a single avatar.
- Use `size="xsmall"` or `"small"` in tables and dense lists, `"medium"` in cards and `"large"` or `"xlarge"` on profile headers.
- Use `bottomAddon={CheckCircleIcon}` for a verified mark and `topAddon` for a small status dot.
- Use `AvatarGroup` with `maxCount` to show a team or approvers in a compact row.
- Use `isSelected` together with `onClick` when the avatar picks one account or merchant.

**Don't**

- Don't put anything other than `Avatar` inside `AvatarGroup`; wrap other content outside the group.
- Don't set `size` on each Avatar inside `AvatarGroup`; set it once on the group.
- Don't use an interactive Avatar with only an icon for important actions; use `IconButton` with an `accessibilityLabel`, or pass `name`.
- Don't pass a rendered element to `bottomAddon`; pass the icon component (`bottomAddon={CheckCircleIcon}`).
- Don't use Avatar to show a status or count on its own; use `Badge` or `Counter`.

## Examples

### Account switcher avatars

Interactive avatars for switching between merchant accounts, combining image, initials, icon, colors, square variant, selection and addons.

```svelte
<script lang="ts">
  import { Avatar, Box, Text, BuildingIcon, CheckCircleIcon } from '@razorpay/blade-svelte/components';

  const accounts = [
    { id: 'acc_acme', name: 'Acme Electronics', src: 'https://avatars.githubusercontent.com/u/7713209?v=4' },
    { id: 'acc_blue', name: 'Blue Tokai Coffee', src: undefined },
    { id: 'acc_new', name: undefined, src: undefined },
  ];

  let selectedAccount = $state('acc_acme');
</script>

<Box className="display-flex gap-spacing-5">
  {#each accounts as account (account.id)}
    <Box className="display-flex flex-col items-center gap-spacing-2">
      <Avatar
        variant="square"
        size="large"
        color={account.id === 'acc_blue' ? 'information' : 'neutral'}
        name={account.name}
        src={account.src}
        icon={BuildingIcon}
        isSelected={selectedAccount === account.id}
        bottomAddon={account.id === 'acc_acme' ? CheckCircleIcon : undefined}
        onClick={() => (selectedAccount = account.id)}
        data-analytics-action="switch-account"
      />
      <Text size="small" color="surface.text.gray.muted">{account.name ?? 'New account'}</Text>
    </Box>
  {/each}
</Box>
```

### Approvers on a payout

An AvatarGroup that shows the first three approvers of a payout and collapses the rest into a counter.

```svelte
<script lang="ts">
  import { Avatar, AvatarGroup, Box, Text } from '@razorpay/blade-svelte/components';

  const approvers = [
    { name: 'Kamlesh Chandnani', color: 'primary' },
    { name: 'Rama Krushna Behera', color: 'positive' },
    { name: 'Saurabh Daware', color: 'notice' },
    { name: 'Nitin Kumar', color: 'information' },
    { name: 'Chaitanya Deorukhkar', color: 'negative' },
  ] as const;
</script>

<Box className="display-flex items-center gap-spacing-3">
  <Text size="medium" weight="semibold">Approved by</Text>
  <AvatarGroup size="small" density="compact" maxCount={3} testID="payout-approvers">
    {#each approvers as approver (approver.name)}
      <Avatar name={approver.name} color={approver.color} />
    {/each}
  </AvatarGroup>
</Box>
```

### Profile link with a status dot

A linked avatar in a header, with a custom snippet in `topAddon`.

```svelte
<script lang="ts">
  import { Avatar } from '@razorpay/blade-svelte/components';
</script>

<Avatar
  name="Nitin Kumar"
  src="https://avatars.githubusercontent.com/u/46647141?v=4"
  size="medium"
  href="https://dashboard.razorpay.com/app/profile"
  target="_blank"
>
  {#snippet topAddon()}
    <span class="online-dot"></span>
  {/snippet}
</Avatar>

<style>
  .online-dot {
    display: block;
    width: var(--spacing-3);
    height: var(--spacing-3);
    border-radius: var(--border-radius-max);
    background-color: var(--feedback-background-positive-intense);
  }
</style>
```
