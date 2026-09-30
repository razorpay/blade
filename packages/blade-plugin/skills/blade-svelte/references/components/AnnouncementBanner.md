## Component Name

AnnouncementBanner

## Description

AnnouncementBanner is a slim, full-bleed, single-line banner for one short, system-wide promotional or informational message at the top or bottom edge of a page. It supports an optional leading icon, center or left alignment and inline content such as a `Link`. Its colors follow the active color scheme automatically: a subtle gray background in light mode and a translucent dark background in dark mode.

## Important Constraints

- `children` is required; pass a string or a snippet with inline content
- The message is a single line and is truncated when it overflows
- There is no dismiss button, action button or color prop; the look is driven only by the color scheme from `BladeProvider`
- The banner renders as a `region` landmark labelled by `accessibilityLabel` (default `'Announcement'`)
- `icon` only accepts an icon component exported by `@razorpay/blade-svelte/components`; it is always rendered at `small` size in the banner's text color

## TypeScript Types

These are the props the AnnouncementBanner component accepts.

```typescript
type AnnouncementBannerAlignment = 'center' | 'left';

type AnnouncementBannerSlot = 'root' | 'icon' | 'text';

type IconSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';

/**
 * Any icon exported by @razorpay/blade-svelte/components, e.g. InfoIcon.
 * Color values are the icon color tokens listed in Icons.md.
 */
type IconComponent = Component<{ size?: IconSize; color?: string }>;

interface AnnouncementBannerProps extends StyledPropsBlade {
  /**
   * The banner message. Pass a string, or inline content such as `Link`.
   * Keep it short — the banner is single-line.
   */
  children: Snippet | string;

  /**
   * Horizontal alignment of the banner content.
   * @default 'center'
   */
  alignment?: AnnouncementBannerAlignment;

  /**
   * Leading icon shown before the message. Omit to render the banner without an icon.
   */
  icon?: IconComponent;

  /**
   * Accessible label for the banner region, announced by screen readers.
   * @default 'Announcement'
   */
  accessibilityLabel?: string;

  /**
   * Test ID for the element.
   */
  testID?: string;

  /**
   * Per-slot classname overrides. Merged under provider `componentConfig.AnnouncementBanner.styleOverride`;
   * instance values win on conflicts.
   */
  styleOverride?: Partial<Record<AnnouncementBannerSlot, string>>;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
}
```

## Usage Guidelines

**Do**

- Use `AnnouncementBanner` for one brief broadcast that applies to the whole product, such as a new feature, a festive offer or a scheduled maintenance window.
- Place it at the very top or bottom edge of the page, outside padded containers, so it spans the full width.
- Keep the message to one short sentence; add an inline `Link` for details instead of more text.
- Use `alignment="left"` when the banner sits above left-aligned page content such as a dashboard header.
- Set a specific `accessibilityLabel`, such as "Maintenance notice", when "Announcement" doesn't describe the message.
- Use `styleOverride` slots (`root`, `icon`, `text`) only for brand tweaks; the default look adapts to light and dark mode.

**Don't**

- Don't use `AnnouncementBanner` for messages about one section or record; use `Alert`.
- Don't use it for feedback after a user action; use `Toast`.
- Don't use it when the message needs a dismiss or action button; use `Alert` with `isFullWidth`.
- Don't show more than one banner at a time; pick the most important message.
- Don't try to recolor it per message; wrap it in a nested `BladeProvider` only when a section genuinely needs a different color scheme.

## Examples

### Maintenance notice with a link

A centered banner at the top of the dashboard with an icon, an inline Link and analytics attributes.

```svelte
<script lang="ts">
  import { AnnouncementBanner, InfoIcon, Link } from '@razorpay/blade-svelte/components';
</script>

<AnnouncementBanner
  icon={InfoIcon}
  accessibilityLabel="Maintenance notice"
  testID="maintenance-banner"
  data-analytics-name="maintenance-banner"
>
  {#snippet children()}
    Settlements are paused on 12 Oct, 2-4 AM IST for bank maintenance.
    <Link href="https://razorpay.com/docs/" size="small">Learn more</Link>
  {/snippet}
</AnnouncementBanner>
```

### Left-aligned banner without an icon

A plain-text banner aligned with left-aligned page content, with spacing below it.

```svelte
<script lang="ts">
  import { AnnouncementBanner } from '@razorpay/blade-svelte/components';

  let { isNewDashboardEnabled = false }: { isNewDashboardEnabled?: boolean } = $props();
</script>

{#if !isNewDashboardEnabled}
  <AnnouncementBanner alignment="left" marginBottom="spacing.4">
    Switch to the new dashboard for faster settlement reports.
  </AnnouncementBanner>
{/if}
```

### Brand-tinted banner with styleOverride

Classes passed through `styleOverride` restyle the root and text slots without `!important`.

```svelte
<script lang="ts">
  import { AnnouncementBanner, CreditCardIcon } from '@razorpay/blade-svelte/components';
</script>

<AnnouncementBanner
  icon={CreditCardIcon}
  styleOverride={{ root: 'festive-banner', text: 'festive-banner-text' }}
>
  Flat 10% cashback on RuPay credit cards over UPI this Diwali
</AnnouncementBanner>

<style>
  :global(.festive-banner) {
    background-color: var(--surface-background-primary-subtle);
  }

  :global(.festive-banner-text) {
    color: var(--surface-text-primary-normal);
  }
</style>
```
