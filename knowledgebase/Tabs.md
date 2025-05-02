## Component Name

Tabs

## Description

The Tabs component is a navigation element used to switch between different views in the same context. Tabs are contextual to a section or page and are triggered by user interaction. They provide an organized way to display related content while maintaining a clean user interface.

## TypeScript Types

These types represent the props that the Tabs component and its subcomponents accept.

```typescript
// Main Tabs component props
type TabsProps = {
  /**
   * The content of the component, accepts `TabList` and `TabPanel` components.
   */
  children: React.ReactNode;

  /**
   * The value of the tab panel same as the corresponding TabItem's value to match the selected TabItem.
   */
  value?: string;

  /**
   * The default value of the selected tab, in case the Tabs component is uncontrolled.
   */
  defaultValue?: string;

  /**
   * Callback fired when the value changes.
   */
  onChange?: (value: string) => void;

  /**
   * The orientation of the tabs.
   *
   * @default 'horizontal' (always horizontal on react-native)
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * The size of the tabs.
   *
   * @default 'medium'
   */
  size?: 'medium' | 'large';

  /**
   * The variant of the tabs.
   *
   * @default 'bordered'
   */
  variant?: 'bordered' | 'borderless' | 'filled';

  /**
   * If `true`, the TabItems will grow to use all the available space.
   *
   * @default false
   */
  isFullWidthTabItem?: boolean;

  /**
   * If `true`, the TabPanel will be rendered only when it becomes active.
   *
   * @default false
   */
  isLazy?: boolean;
} & DataAnalyticsAttribute;

// TabItem component props
type TabItemProps = {
  /**
   * The content of the tab item.
   */
  children: React.ReactNode;

  /**
   * The value of the tab item.
   */
  value: string;

  /**
   * Leading element of the tab item.
   * Can be used to render an Icon.
   */
  leading?: IconComponent;

  /**
   * Trailing element of the tab item.
   * Can be used to render a Badge/Counter component.
   */
  trailing?: React.ReactNode;

  /**
   * If `true`, the tab item will be disabled.
   */
  isDisabled?: boolean;

  /**
   * If set the tab item will be rendered as a link.
   * This can be used to create a tab item that redirects to another page or integrate with react-router.
   *
   * @default undefined
   */
  href?: string;

  /**
   * Callback fired when the tab item is clicked.
   */
  onClick?: (event: React.MouseEvent) => void;
};

// TabPanel component props
type TabPanelProps = {
  /**
   * The value of the tab panel. This will be used to match the selected tab.
   */
  value: string;

  /**
   * The content of the tab panel.
   */
  children: React.ReactNode;
} & DataAnalyticsAttribute;

// TabList has no specific props other than children and common styling props
```

## Example

### Basic Usage

```tsx
import { Box, Text, Tabs, TabList, TabItem, TabPanel } from '@razorpay/blade/components';

function BasicTabsExample() {
  return (
    <Tabs variant="bordered" orientation="horizontal">
      <TabList>
        <TabItem value="subscriptions">Subscription</TabItem>
        <TabItem value="plans">Plans</TabItem>
        <TabItem value="settings">Settings</TabItem>
      </TabList>

      <TabPanel value="subscriptions">
        <Box paddingTop="spacing.4">
          <Text>Subscriptions Panel Content</Text>
        </Box>
      </TabPanel>
      <TabPanel value="plans">
        <Box paddingTop="spacing.4">
          <Text>Plans Panel Content</Text>
        </Box>
      </TabPanel>
      <TabPanel value="settings">
        <Box paddingTop="spacing.4">
          <Text>Settings Panel Content</Text>
        </Box>
      </TabPanel>
    </Tabs>
  );
}
```

### Controlled Tabs

```tsx
import { Box, Text, Tabs, TabList, TabItem, TabPanel, Button } from '@razorpay/blade/components';
import React from 'react';

function ControlledTabsExample() {
  const [activeTab, setActiveTab] = React.useState('plans');

  return (
    <Box>
      <Text weight="semibold" marginBottom="spacing.4">
        Current Tab: {activeTab}
      </Text>

      <Box display="flex" gap="spacing.4" marginBottom="spacing.4">
        <Button variant="tertiary" onClick={() => setActiveTab('subscriptions')}>
          Go to Subscriptions
        </Button>
        <Button variant="tertiary" onClick={() => setActiveTab('plans')}>
          Go to Plans
        </Button>
        <Button variant="tertiary" onClick={() => setActiveTab('settings')}>
          Go to Settings
        </Button>
      </Box>

      <Tabs value={activeTab} onChange={(newValue) => setActiveTab(newValue)}>
        <TabList>
          <TabItem value="subscriptions">Subscription</TabItem>
          <TabItem value="plans">Plans</TabItem>
          <TabItem value="settings">Settings</TabItem>
        </TabList>

        <TabPanel value="subscriptions">
          <Box paddingTop="spacing.4">
            <Text>Subscriptions Panel Content</Text>
          </Box>
        </TabPanel>
        <TabPanel value="plans">
          <Box paddingTop="spacing.4">
            <Text>Plans Panel Content</Text>
          </Box>
        </TabPanel>
        <TabPanel value="settings">
          <Box paddingTop="spacing.4">
            <Text>Settings Panel Content</Text>
          </Box>
        </TabPanel>
      </Tabs>
    </Box>
  );
}
```

### Tabs with Icons and Badges

```tsx
import {
  Box,
  Text,
  Tabs,
  TabList,
  TabItem,
  TabPanel,
  Counter,
  Badge,
  SubscriptionsIcon,
  ClipboardIcon,
  SettingsIcon,
} from '@razorpay/blade/components';

function TabsWithIconsAndBadgesExample() {
  return (
    <Tabs variant="bordered" size="medium">
      <TabList>
        <TabItem
          value="subscriptions"
          leading={SubscriptionsIcon}
          trailing={<Counter value={3} color="positive" />}
        >
          Subscription
        </TabItem>
        <TabItem
          value="plans"
          leading={ClipboardIcon}
          trailing={<Badge color="positive">NEW</Badge>}
        >
          Plans
        </TabItem>
        <TabItem value="settings" leading={SettingsIcon}>
          Settings
        </TabItem>
      </TabList>

      <TabPanel value="subscriptions">
        <Box paddingTop="spacing.4">
          <Text>You have 3 active subscriptions</Text>
        </Box>
      </TabPanel>
      <TabPanel value="plans">
        <Box paddingTop="spacing.4">
          <Text>Check out our new plans!</Text>
        </Box>
      </TabPanel>
      <TabPanel value="settings">
        <Box paddingTop="spacing.4">
          <Text>Configure your settings here</Text>
        </Box>
      </TabPanel>
    </Tabs>
  );
}
```
