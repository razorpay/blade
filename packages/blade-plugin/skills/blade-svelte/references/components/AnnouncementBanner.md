## Component Name

AnnouncementBanner

## Description

AnnouncementBanner is a one-line message across the top of a page or section, such as an offer or a maintenance notice, on the subtle gray surface with an optional 16px icon before it. The message is cut off with an ellipsis when it does not fit (its full text then shows as a native tooltip) and is centred by default or aligned left. It is a labelled region (`role="region"`, named "Announcement" by default) with no actions of its own beyond an inline Link in the message.

## Important Constraints

- The message is `children`: keep it short, it is one line
- `icon` takes an icon source from `@razorpay/blade-svelte/icons`, never a component
- It has no dismiss button, no colours and no actions: for a dismissible or coloured message use Alert
- It spans its container's width; `class` only places it (margin, `sticky top-0`)
- There is no dark treatment: blade-svelte has one light theme

## Props

```typescript
interface AnnouncementBannerProps {
  /** The message: text, with an inline Link if needed. One line. */
  children: Snippet;
  /** Before the message, in its colour. */
  icon?: IconSource;
  /** Where the content sits along the bar. @default 'center' */
  alignment?: 'center' | 'left';
  /** Names the region for screen readers. @default 'Announcement' */
  accessibilityLabel?: string;
  testID?: string;
  /** Placement only. */
  class?: string;
}
```

## Guidelines

- Use it for one page-wide announcement at a time, at the very top of the page or section.
- Keep the message to a short sentence; link to details with a small Link rather than writing them out.
- Use `alignment="left"` when the banner sits above left-aligned content.
- Don't use it for errors or anything the user must act on: use Alert.

## Examples

### An offer

```svelte
<script lang="ts">
  import { AnnouncementBanner } from '@razorpay/blade-svelte/components';
  import { OffersIcon } from '@razorpay/blade-svelte/icons';
</script>

<AnnouncementBanner icon={OffersIcon}>Zero setup fees on UPI payments this month</AnnouncementBanner>
```

### Left aligned, with a link, sticky at the top

```svelte
<script lang="ts">
  import { AnnouncementBanner, Link } from '@razorpay/blade-svelte/components';
  import { AnnouncementIcon } from '@razorpay/blade-svelte/icons';
</script>

<AnnouncementBanner icon={AnnouncementIcon} alignment="left" class="sticky top-0 z-10">
  Scheduled maintenance on Sunday, 2–4 AM. <Link href="#status" size="small">See status</Link>
</AnnouncementBanner>
```
