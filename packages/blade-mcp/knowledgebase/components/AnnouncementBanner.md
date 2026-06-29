## Component Name

AnnouncementBanner

## Description

AnnouncementBanner is a slim, full-bleed banner used to surface a single short, system-wide promotional or informational message at the top or bottom edge of a page. It supports an optional leading icon, left or center alignment, and automatically adapts its colour treatment to the app's `colorScheme` (dark app renders a translucent dark background with light text; light app renders a subtle gray background with dark text). The banner is a single-line component and the message text is truncated if it overflows.

## TypeScript Types

The following types represent the props that the AnnouncementBanner component accepts. These types define all the available properties you can use when implementing the AnnouncementBanner component in your application.

```typescript
type AnnouncementBannerProps = {
  /**
   * The banner message. Pass a string, or inline content such as `Link`.
   * Keep it short — the banner is single-line.
   */
  children: ReactNode;

  /**
   * Horizontal alignment of the banner content.
   *
   * @default center
   */
  alignment?: 'center' | 'left';

  /**
   * Leading icon shown before the message. Omit to render the banner without an icon.
   *
   * @default -
   */
  icon?: IconComponent;

  /**
   * Accessible label for the banner region, announced by screen readers.
   *
   * @default "Announcement"
   */
  accessibilityLabel?: string;
} & TestID &
  StyledPropsBlade &
  DataAnalyticsAttribute;
```

## Examples

### Default AnnouncementBanner (centered, with icon)

The colour treatment is driven by the app's `colorScheme` set on `BladeProvider`. No extra prop is needed.

```tsx
import { AnnouncementBanner, AnnouncementIcon } from '@razorpay/blade/components';

function DefaultBannerExample() {
  return (
    <AnnouncementBanner icon={AnnouncementIcon}>
      Enter promotional text here
    </AnnouncementBanner>
  );
}
```

### Dark Color Scheme

When the app `colorScheme` is `dark`, the banner automatically renders the dark treatment.

```tsx
import { AnnouncementBanner, AnnouncementIcon } from '@razorpay/blade/components';
import { BladeProvider } from '@razorpay/blade/components';
import { bladeTheme } from '@razorpay/blade/tokens';

function DarkBannerExample() {
  return (
    <BladeProvider themeTokens={bladeTheme} colorScheme="dark">
      <AnnouncementBanner icon={AnnouncementIcon}>
        Enter promotional text here
      </AnnouncementBanner>
    </BladeProvider>
  );
}
```

### Left Aligned

Content can be left aligned instead of the default center alignment.

```tsx
import { AnnouncementBanner } from '@razorpay/blade/components';

function LeftAlignedBannerExample() {
  return (
    <AnnouncementBanner alignment="left">
      Switch to the new dashboard experience today.
    </AnnouncementBanner>
  );
}
```

### Without Icon

Omit the `icon` prop to render the banner without a leading icon.

```tsx
import { AnnouncementBanner } from '@razorpay/blade/components';

function NoIconBannerExample() {
  return (
    <AnnouncementBanner>
      Enter promotional text here
    </AnnouncementBanner>
  );
}
```

### With Inline Link

The message can contain an inline `Link` for in-context navigation.

```tsx
import { AnnouncementBanner, AnnouncementIcon } from '@razorpay/blade/components';
import { Link } from '@razorpay/blade/components';

function BannerWithLinkExample() {
  return (
    <AnnouncementBanner icon={AnnouncementIcon}>
      Your KYC is verified.&nbsp;
      <Link href="https://razorpay.com" target="_blank" variant="anchor" size="small">
        View details
      </Link>
    </AnnouncementBanner>
  );
}
```
