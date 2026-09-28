# AppBar

## Component Name

AppBar, AppBarLeading, AppBarActions

## Description

AppBar is a header bar at the top of a screen. It shows where the user is (brand logo, page title, or both), an optional back button, and a slot for page-level actions. Use it on mobile and compact surfaces, webviews, and embedded merchant flows where `TopNav` is too heavy. Compose it with `AppBarLeading` for the logo and title and `AppBarActions` for trailing actions.

## Usage Guidelines

- Put `AppBarLeading` and `AppBarActions` as children of `AppBar`.
- Pass `backButton` only when the user can go back. When you do not pass it, no back button shows.
- Use `IconButton` components or a small illustration inside `AppBarActions`.
- Use `trustBadgeVariant` on `AppBarLeading` to show a `TrustBadge` for verified merchants.
- Use `variant="subtle"` on light or embedded page backgrounds.
- Do not use AppBar for full desktop navigation. Use `TopNav` for that.

## TypeScript Types

```typescript
type AppBarProps = {
  /**
   * The contents of the AppBar. Usually `AppBarLeading` and `AppBarActions`.
   */
  children: React.ReactNode;
  /**
   * Shows a back IconButton at the left edge. When omitted, no back button is shown.
   * @default undefined
   */
  backButton?: {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    accessibilityLabel: string;
    /**
     * Shows a Tooltip on the back button
     */
    tooltip?: {
      content: string;
      placement?:
        | 'top'
        | 'top-start'
        | 'top-end'
        | 'bottom'
        | 'bottom-start'
        | 'bottom-end'
        | 'left'
        | 'left-start'
        | 'left-end'
        | 'right'
        | 'right-start'
        | 'right-end';
    };
  };
  /**
   * Visual emphasis of the AppBar.
   * - 'neutral': transparent surface with light foreground
   * - 'subtle': transparent surface with gray foreground for light or embedded pages
   * @default 'neutral'
   */
  variant?: 'neutral' | 'subtle';
  /**
   * When true, the AppBar sticks to the top of its scroll container
   * @default true
   */
  isSticky?: boolean;
  /**
   * Accessibility label for the header landmark
   * @default undefined
   */
  accessibilityLabel?: string;
  /**
   * Horizontal padding. Accepts Blade spacing tokens, e.g. 'spacing.4'
   */
  paddingX?: string;
  /**
   * Vertical padding. Accepts Blade spacing tokens, e.g. 'spacing.3'
   */
  paddingY?: string;
  /**
   * Background color token, e.g. 'surface.background.gray.intense'
   */
  backgroundColor?: string;
  width?: string;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

type AppBarLeadingProps = {
  /**
   * Page or merchant title. Can pair with `logo`.
   * @default undefined
   */
  title?: string;
  /**
   * Brand mark, for example a wordmark, icon logo, or avatar
   * @default undefined
   */
  logo?: React.ReactNode;
  /**
   * Shows a TrustBadge.
   * - 'default': shield and pill below the title or logo row
   * - 'icon-only': shield only, inline with the title
   * @default undefined
   */
  trustBadgeVariant?: 'default' | 'icon-only';
  /**
   * Custom trust label for the TrustBadge
   * @default undefined
   */
  trustBadgeLabel?: string;
} & TestID &
  DataAnalyticsAttribute;

type AppBarActionsProps = {
  /**
   * Trailing action content. A group of IconButtons or an illustration.
   */
  children: React.ReactNode;
} & TestID &
  DataAnalyticsAttribute;
```

## Examples

### AppBar with Logo, Title, Trust Badge and Actions

```tsx
import React from 'react';
import {
  AppBar,
  AppBarLeading,
  AppBarActions,
  IconButton,
  Avatar,
  UserIcon,
  CloseIcon,
} from '@razorpay/blade/components';

function StoreHeader(): React.ReactElement {
  return (
    <AppBar
      accessibilityLabel="Maven Shop header"
      backButton={{ onClick: () => window.history.back(), accessibilityLabel: 'Go back' }}
    >
      <AppBarLeading
        logo={<Avatar name="Maven Shop" size="small" />}
        title="Maven Shop"
        trustBadgeVariant="default"
      />
      <AppBarActions>
        <IconButton
          icon={UserIcon}
          emphasis="moderate"
          accessibilityLabel="Profile"
          onClick={() => console.log('profile')}
        />
        <IconButton
          icon={CloseIcon}
          emphasis="moderate"
          accessibilityLabel="Close"
          onClick={() => console.log('close')}
        />
      </AppBarActions>
    </AppBar>
  );
}

export default StoreHeader;
```

### Subtle Sticky AppBar with Icon-only Trust Badge

```tsx
import React from 'react';
import {
  AppBar,
  AppBarLeading,
  AppBarActions,
  IconButton,
  Box,
  Text,
  BellIcon,
} from '@razorpay/blade/components';

function SettingsPage(): React.ReactElement {
  return (
    <Box height="320px" overflowY="auto" backgroundColor="surface.background.gray.subtle">
      <AppBar variant="subtle" isSticky>
        <AppBarLeading title="Maven Shop" trustBadgeVariant="icon-only" />
        <AppBarActions>
          <IconButton
            icon={BellIcon}
            accessibilityLabel="Notifications"
            onClick={() => console.log('notifications')}
          />
        </AppBarActions>
      </AppBar>
      <Box padding="spacing.6" display="flex" flexDirection="column" gap="spacing.5">
        {Array.from({ length: 20 }).map((_, index) => (
          <Text key={index}>Row {index + 1}</Text>
        ))}
      </Box>
    </Box>
  );
}

export default SettingsPage;
```
