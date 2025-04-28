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

### Different Variants and Orientations

```tsx
import { Box, Text, Tabs, TabList, TabItem, TabPanel, Divider } from '@razorpay/blade/components';

function TabVariantsExample() {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.8">
      {/* Bordered Horizontal Tabs (Default) */}
      <Box>
        <Text weight="semibold" marginBottom="spacing.3">
          Bordered Horizontal (Default)
        </Text>
        <Tabs variant="bordered" orientation="horizontal">
          <TabList>
            <TabItem value="tab1">Tab 1</TabItem>
            <TabItem value="tab2">Tab 2</TabItem>
            <TabItem value="tab3">Tab 3</TabItem>
          </TabList>
          <TabPanel value="tab1">
            <Box paddingTop="spacing.4">
              <Text>Content for Tab 1</Text>
            </Box>
          </TabPanel>
          <TabPanel value="tab2">
            <Box paddingTop="spacing.4">
              <Text>Content for Tab 2</Text>
            </Box>
          </TabPanel>
          <TabPanel value="tab3">
            <Box paddingTop="spacing.4">
              <Text>Content for Tab 3</Text>
            </Box>
          </TabPanel>
        </Tabs>
      </Box>

      {/* Borderless Horizontal Tabs */}
      <Box>
        <Text weight="semibold" marginBottom="spacing.3">
          Borderless Horizontal with Divider
        </Text>
        <Tabs variant="borderless" orientation="horizontal">
          <TabList>
            <TabItem value="tab1">Tab 1</TabItem>
            <TabItem value="tab2">Tab 2</TabItem>
            <TabItem value="tab3">Tab 3</TabItem>
          </TabList>
          <Divider />
          <TabPanel value="tab1">
            <Box paddingTop="spacing.4">
              <Text>Content for Tab 1</Text>
            </Box>
          </TabPanel>
          <TabPanel value="tab2">
            <Box paddingTop="spacing.4">
              <Text>Content for Tab 2</Text>
            </Box>
          </TabPanel>
          <TabPanel value="tab3">
            <Box paddingTop="spacing.4">
              <Text>Content for Tab 3</Text>
            </Box>
          </TabPanel>
        </Tabs>
      </Box>

      {/* Filled Horizontal Tabs */}
      <Box>
        <Text weight="semibold" marginBottom="spacing.3">
          Filled Horizontal
        </Text>
        <Tabs variant="filled" orientation="horizontal">
          <TabList>
            <TabItem value="tab1">Tab 1</TabItem>
            <TabItem value="tab2">Tab 2</TabItem>
            <TabItem value="tab3">Tab 3</TabItem>
          </TabList>
          <TabPanel value="tab1">
            <Box paddingTop="spacing.4">
              <Text>Content for Tab 1</Text>
            </Box>
          </TabPanel>
          <TabPanel value="tab2">
            <Box paddingTop="spacing.4">
              <Text>Content for Tab 2</Text>
            </Box>
          </TabPanel>
          <TabPanel value="tab3">
            <Box paddingTop="spacing.4">
              <Text>Content for Tab 3</Text>
            </Box>
          </TabPanel>
        </Tabs>
      </Box>

      {/* Bordered Vertical Tabs */}
      <Box>
        <Text weight="semibold" marginBottom="spacing.3">
          Bordered Vertical
        </Text>
        <Tabs variant="bordered" orientation="vertical">
          <TabList>
            <TabItem value="tab1">Tab 1</TabItem>
            <TabItem value="tab2">Tab 2</TabItem>
            <TabItem value="tab3">Tab 3</TabItem>
          </TabList>
          <TabPanel value="tab1">
            <Box paddingLeft="spacing.4">
              <Text>Content for Tab 1</Text>
            </Box>
          </TabPanel>
          <TabPanel value="tab2">
            <Box paddingLeft="spacing.4">
              <Text>Content for Tab 2</Text>
            </Box>
          </TabPanel>
          <TabPanel value="tab3">
            <Box paddingLeft="spacing.4">
              <Text>Content for Tab 3</Text>
            </Box>
          </TabPanel>
        </Tabs>
      </Box>

      {/* Filled Vertical Tabs */}
      <Box>
        <Text weight="semibold" marginBottom="spacing.3">
          Filled Vertical
        </Text>
        <Tabs variant="filled" orientation="vertical">
          <TabList>
            <TabItem value="tab1">Tab 1</TabItem>
            <TabItem value="tab2">Tab 2</TabItem>
            <TabItem value="tab3">Tab 3</TabItem>
          </TabList>
          <TabPanel value="tab1">
            <Box paddingLeft="spacing.4">
              <Text>Content for Tab 1</Text>
            </Box>
          </TabPanel>
          <TabPanel value="tab2">
            <Box paddingLeft="spacing.4">
              <Text>Content for Tab 2</Text>
            </Box>
          </TabPanel>
          <TabPanel value="tab3">
            <Box paddingLeft="spacing.4">
              <Text>Content for Tab 3</Text>
            </Box>
          </TabPanel>
        </Tabs>
      </Box>
    </Box>
  );
}
```

### Tabs with Tooltip

```tsx
import {
  Box,
  Text,
  Tabs,
  TabList,
  TabItem,
  TabPanel,
  Tooltip,
  TooltipInteractiveWrapper,
  SubscriptionsIcon,
  ClipboardIcon,
  SettingsIcon,
} from '@razorpay/blade/components';

function TabsWithTooltipExample() {
  return (
    <Tabs variant="bordered">
      <TabList>
        <TabItem value="subscriptions" leading={SubscriptionsIcon}>
          Subscriptions
        </TabItem>
        <TabItem value="plans" leading={ClipboardIcon}>
          Plans
        </TabItem>
        <Tooltip
          placement="right"
          content="Change payment method settings and enable different payment methods."
          title="Payment Settings"
        >
          <TooltipInteractiveWrapper>
            <TabItem value="settings" leading={SettingsIcon}>
              Settings
            </TabItem>
          </TooltipInteractiveWrapper>
        </Tooltip>
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

### Comprehensive Example

```tsx
import React from 'react';
import {
  Box,
  Card,
  CardBody,
  Text,
  Heading,
  Tabs,
  TabList,
  TabItem,
  TabPanel,
  Divider,
  Button,
  Link,
  ExternalLinkIcon,
  SubscriptionsIcon,
  ClipboardIcon,
  SettingsIcon,
  CreditCardIcon,
  ZapIcon,
  BankIcon,
  Alert,
  Switch,
} from '@razorpay/blade/components';

function ComprehensiveTabsExample() {
  const [activeTab, setActiveTab] = React.useState('subscriptions');

  // Content components for tab panels
  const SubscriptionPanel = () => (
    <Box paddingTop="spacing.4">
      <Text>
        This is an overview of your active subscriptions. You can click on each subscription to view
        more details.
      </Text>
      <Box
        display="flex"
        flexDirection={{ base: 'column', m: 'row' }}
        width="100%"
        gap="spacing.4"
        marginY="spacing.4"
      >
        <Alert
          title="1 - Active Subscriptions"
          description="You have 1 active subscription. Active subscriptions are subscriptions that are currently being charged."
          color="positive"
          isDismissible={false}
        />
        <Alert
          title="2 - Halted Subscriptions"
          description="You have 2 halted subscriptions. Halted subscriptions are subscriptions that have been stopped by the customer or by you."
          color="notice"
          isDismissible={false}
        />
      </Box>
    </Box>
  );

  const PlansPanel = () => (
    <Box paddingTop="spacing.4">
      <Text>
        This is an overview of all your plans. You can click on each plan to view more details.
      </Text>
      <Box
        marginTop="spacing.4"
        display="flex"
        gap="spacing.4"
        flexDirection={{ base: 'column', m: 'row' }}
      >
        <Card
          onClick={() => console.log('Plan clicked')}
          padding="spacing.5"
          elevation="none"
          width="100%"
        >
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.2">
              <Heading>Basic Plan</Heading>
              <Text>$9.99 / Monthly</Text>
              <Text>Basic Plan Description</Text>
            </Box>
          </CardBody>
        </Card>
        <Card
          onClick={() => console.log('Plan clicked')}
          padding="spacing.5"
          elevation="none"
          width="100%"
        >
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.2">
              <Heading>Premium Plan</Heading>
              <Text>$19.99 / Monthly</Text>
              <Text>Premium Plan Description</Text>
            </Box>
          </CardBody>
        </Card>
      </Box>
    </Box>
  );

  const SettingsPanel = () => (
    <Box paddingTop="spacing.4">
      <Text>
        This is an overview of your settings. You can enable or disable Payment Methods as per your
        requirements.
      </Text>
      <Box
        marginTop="spacing.4"
        display="flex"
        flexDirection={{ base: 'column', m: 'row' }}
        gap="spacing.4"
      >
        <Card padding="spacing.5" elevation="none" width="100%">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.4">
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box display="flex" flexDirection="row" gap="spacing.4" alignItems="center">
                  <CreditCardIcon size="large" color="surface.icon.gray.subtle" />
                  <Heading>Card</Heading>
                </Box>
                <Switch accessibilityLabel="Enable Card" />
              </Box>
              <Text>
                Accept recurring payments via debit & credit cards for your subscriptions in any of
                our supported international currencies.
              </Text>
            </Box>
          </CardBody>
        </Card>

        <Card padding="spacing.5" elevation="none" width="100%">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.4">
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box display="flex" flexDirection="row" gap="spacing.4" alignItems="center">
                  <ZapIcon size="large" color="surface.icon.gray.subtle" />
                  <Heading>UPI</Heading>
                </Box>
                <Switch accessibilityLabel="Enable UPI" />
              </Box>
              <Text>
                Accept recurring payments via UPI apps like PhonePe, Paytm & BHIM for your
                subscriptions. Only supports Indian currency.
              </Text>
            </Box>
          </CardBody>
        </Card>
      </Box>
    </Box>
  );

  // Render action buttons based on active tab
  const renderActions = () => {
    switch (activeTab) {
      case 'subscriptions':
        return (
          <>
            <Link href="#" icon={ExternalLinkIcon}>
              Documentation
            </Link>
            <Button size="small">Subscribe</Button>
          </>
        );
      case 'plans':
        return <Button size="small">Create Plan</Button>;
      case 'settings':
        return (
          <Link href="#" icon={ExternalLinkIcon}>
            Need Help?
          </Link>
        );
      default:
        return null;
    }
  };

  return (
    <Card elevation="none" padding="spacing.0">
      <CardBody>
        <Tabs variant="borderless" value={activeTab} onChange={setActiveTab}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            paddingX="spacing.6"
          >
            <TabList>
              <TabItem value="subscriptions" leading={SubscriptionsIcon}>
                Subscriptions
              </TabItem>
              <TabItem value="plans" leading={ClipboardIcon}>
                Plans
              </TabItem>
              <TabItem value="settings" leading={SettingsIcon}>
                Settings
              </TabItem>
            </TabList>
            <Box display="flex" alignItems="center" gap="spacing.5">
              {renderActions()}
            </Box>
          </Box>
          <Divider />

          <Box paddingX="spacing.6" paddingBottom="spacing.6">
            <TabPanel value="subscriptions">
              <SubscriptionPanel />
            </TabPanel>
            <TabPanel value="plans">
              <PlansPanel />
            </TabPanel>
            <TabPanel value="settings">
              <SettingsPanel />
            </TabPanel>
          </Box>
        </Tabs>
      </CardBody>
    </Card>
  );
}
```
