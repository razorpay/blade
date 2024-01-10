/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import StoryRouter from 'storybook-react-router';
import { Route, useHistory } from 'react-router-dom';
import type { TabItemProps, TabsProps } from './types';
import { Tabs, TabItem, TabList, TabPanel } from './';
import { Code, Heading, Text } from '~components/Typography';
import type { IconComponent } from '~components/Icons';
import {
  ExternalLinkIcon,
  ClipboardIcon,
  SettingsIcon,
  SubscriptionsIcon,
  BankIcon,
  CreditCardIcon,
  ZapIcon,
} from '~components/Icons';
import { Counter } from '~components/Counter';
import { Box } from '~components/Box';
import { Card, CardBody, CardHeader, CardHeaderLeading } from '~components/Card';
import { Alert } from '~components/Alert';
// import { Switch } from '~components/Switch';
import iconMap from '~components/Icons/iconMap';
import { Badge } from '~components/Badge';
import { Button } from '~components/Button';
import { Tooltip, TooltipInteractiveWrapper } from '~components/Tooltip';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';
import { isReactNative } from '~utils';
import { Divider } from '~components/Divider';
import { Link } from '~components/Link';
import { useIsMobile } from '~utils/useIsMobile';
import { List, ListItem, ListItemText } from '~components/List';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Tabs"
      componentDescription="A tab is a navigation component used in the interface to switch between different views in the same context. Tabs are contextual to the section or the page and are triggered by user interaction."
      figmaURL="https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=60965%3A367088&mode=dev"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox editorHeight={500}>
        {`
        import {
          Box,
          Text,
          Tabs,
          TabList,
          TabItem,
          TabPanel,
        } from '@razorpay/blade/components';

        function App() {
          return (
            <Tabs variant="bordered" orientation="horizontal">
              <TabList>
                <TabItem value="subscriptions">Subscription</TabItem>
                <TabItem value="plans">Plans</TabItem>
                <TabItem value="settings">Settings</TabItem>
              </TabList>

              <TabPanel value="subscriptions">
                <Box paddingTop="spacing.4">
                  <Text>Subscriptions Panel</Text>
                </Box>
              </TabPanel>
              <TabPanel value="plans">
                <Box paddingTop="spacing.4">
                  <Text>Plans Panel</Text>
                </Box>
              </TabPanel>
              <TabPanel value="settings">
                <Box paddingTop="spacing.4">
                  <Text>Settings Panel</Text>
                </Box>
              </TabPanel>
            </Tabs>
          )
        }

        export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

const propsCategory = {
  TABS: 'Tabs Props',
  TAB_ITEM: 'TabItem Props',
};

type StoryControlProps = TabsProps & {
  tabItemIsDisabled: TabItemProps['isDisabled'];
  tabItemLeading: TabItemProps['leading'];
  tabItemTrailing: TabItemProps['trailing'];
  tabItemChildren: TabItemProps['children'];
  tabItemHref: TabItemProps['href'];
};

const tabItemTrailing = {
  Counter: <Counter color="positive" value={2} />,
  Badge: <Badge color="positive">NEW</Badge>,
};
export default {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    onChange: {
      table: {
        disable: true,
      },
      action: 'onChange',
    },
    value: {
      table: {
        disable: true,
      },
    },
    defaultValue: {
      table: {
        disable: true,
      },
    },
    children: {
      table: {
        disable: true,
      },
    },
    isFullWidthTabItem: {
      control: {
        type: 'boolean',
      },
      table: { category: propsCategory.TABS },
    },
    orientation: {
      control: {
        type: 'select',
        options: ['horizontal', 'vertical'],
      },
      table: { category: propsCategory.TABS },
    },
    size: {
      table: { category: propsCategory.TABS },
    },
    variant: {
      table: { category: propsCategory.TABS },
    },
    tabItemChildren: {
      control: {
        type: 'text',
      },
      table: { category: propsCategory.TAB_ITEM },
      description: 'The label of the tab item.',
    },
    tabItemIsDisabled: {
      control: {
        type: 'boolean',
      },
      table: { category: propsCategory.TAB_ITEM },
      description: 'If `true`, the tab item will be disabled.',
    },
    tabItemLeading: {
      table: { category: propsCategory.TAB_ITEM },
      control: {
        type: 'select',
      },
      mapping: iconMap,
      options: Object.keys(iconMap),
      description: 'Leading element of the tab item. Can be used to render an icon.',
    },
    tabItemTrailing: {
      table: { category: propsCategory.TAB_ITEM },
      control: {
        type: 'select',
      },
      mapping: tabItemTrailing,
      options: Object.keys(tabItemTrailing),
      description: 'Trailing element of the tab item. Can be used to render an badge/counter.',
    },
    tabItemHref: {
      table: { category: propsCategory.TAB_ITEM },
      control: {
        type: 'text',
      },
    },
    isLazy: {
      table: { category: propsCategory.TABS },
    },
  },
  args: {
    isFullWidthTabItem: false,
    orientation: 'horizontal',
    size: 'medium',
    variant: 'bordered',
    tabItemChildren: 'Tab Item',
    tabItemIsDisabled: false,
    tabItemLeading: ('ClipboardIcon' as unknown) as IconComponent,
    tabItemTrailing: 'Badge',
    tabItemHref: '',
    isLazy: false,
  },
  // eslint-disable-next-line babel/new-cap
  decorators: [StoryRouter(undefined, { initialEntries: ['/accounts/subscriptions'] })] as unknown,
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<StoryControlProps>;

const PanelWrapper = ({
  isVertical,
  children,
}: {
  isVertical: boolean;
  children: React.ReactNode;
}) => {
  return (
    <Box
      marginLeft={isVertical ? 'spacing.4' : 'spacing.0'}
      marginTop={isVertical ? 'spacing.0' : 'spacing.4'}
    >
      {children}
    </Box>
  );
};
const SubscriptionPanel = ({ isVertical }: { isVertical: boolean }) => {
  return (
    <PanelWrapper isVertical={isVertical}>
      <Text>
        This is an overview of your active subscriptions. You can click on each subscription to view
        more details.
      </Text>
      <Box
        flexDirection={{ base: 'column', m: 'row' }}
        display="flex"
        width="100%"
        gap="spacing.4"
        marginY="spacing.4"
      >
        <Alert
          title="1 - Active Subscriptions"
          description="You have 1 active subscription. Active subscriptions are subscriptions that are currently being charged."
          intent="positive"
          isDismissible={false}
        />
        <Alert
          title="2 - Halted Subscriptions"
          description="You have 2 halted subscriptions. Halted subscriptions are subscriptions that have been stopped by the customer or by you."
          intent="notice"
          isDismissible={false}
        />
        <Alert
          title="1 - Failed Subscriptions"
          description="You have 1 failed subscription. Failed subscriptions are subscriptions that have failed to charge the customer."
          intent="negative"
          isDismissible={false}
        />
        <Alert
          title="3 - Expired Subscriptions"
          description="You have 3 expired subscriptions. Expired subscriptions are subscriptions that have reached the end of their billing cycle."
          intent="information"
          isDismissible={false}
        />
      </Box>
    </PanelWrapper>
  );
};

const PlansPanel = ({ isVertical }: { isVertical: boolean }) => {
  return (
    <PanelWrapper isVertical={isVertical}>
      <Text>
        This is an overview of all your plans. You can click on each plan to view more details.
      </Text>
      <Box
        marginTop="spacing.4"
        display="flex"
        gap="spacing.4"
        flexDirection={{ base: 'column', m: 'row' }}
      >
        <Card onClick={() => null} padding="spacing.5" elevation="none" width="100%">
          <CardHeader>
            <CardHeaderLeading title="Basic Plan" subtitle="ID: plan_MoUThTYyKiCq7t" />
          </CardHeader>
          <CardBody>
            <Box display="flex" flexDirection="row" gap="spacing.4">
              <Box display="flex" flexDirection="column" gap="spacing.2">
                <Text weight="bold">Name</Text>
                <Text weight="bold">Description</Text>
                <Text weight="bold">Bill Amount</Text>
                <Text weight="bold">Bill Frequency</Text>
              </Box>
              <Box display="flex" flexDirection="column" gap="spacing.2">
                <Text>Basic Plan</Text>
                <Text>Basic Plan Description</Text>
                <Text>$9.99</Text>
                <Text>Monthly</Text>
              </Box>
            </Box>
          </CardBody>
        </Card>
        <Card onClick={() => null} padding="spacing.5" elevation="none" width="100%">
          <CardHeader>
            <CardHeaderLeading title="Premium Plan" subtitle="ID: plan_WoUDhTxyKi2CE7t" />
          </CardHeader>
          <CardBody>
            <Box display="flex" flexDirection="row" gap="spacing.4">
              <Box display="flex" flexDirection="column" gap="spacing.2">
                <Text weight="bold">Name</Text>
                <Text weight="bold">Description</Text>
                <Text weight="bold">Bill Amount</Text>
                <Text weight="bold">Bill Frequency</Text>
              </Box>
              <Box display="flex" flexDirection="column" gap="spacing.2">
                <Text>Premium Plan</Text>
                <Text>Premium Plan Description</Text>
                <Text>$19.99</Text>
                <Text>Monthly</Text>
              </Box>
            </Box>
          </CardBody>
        </Card>
      </Box>
    </PanelWrapper>
  );
};

const SettingsCard = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: IconComponent;
  children: React.ReactNode;
}) => {
  return (
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
              <Icon size="large" color="surface.text.subtle.lowContrast" />
              <Heading>{title}</Heading>
            </Box>
            {/* <Switch accessibilityLabel="Enable Card" /> */}
          </Box>
          {children}
        </Box>
      </CardBody>
    </Card>
  );
};

const SettingsPanel = ({ isVertical }: { isVertical: boolean }) => {
  return (
    <PanelWrapper isVertical={isVertical}>
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
        <SettingsCard title="Card" icon={CreditCardIcon}>
          <Text>
            Accept recurring payments via debit & credit cards for your subscriptions in any of our
            supported international currencies.
          </Text>
          <Text>
            Note: Only limited cards are supported due to new payment regulations by RBI. View
            supported cards
          </Text>

          <Alert
            isDismissible={false}
            intent="information"
            title="Payment limits"
            description="Accept payments upto ₹ 2,00,000 ₹ - Indian Rupee (INR) Payments above ₹ 15,000 ₹ - Indian Rupee (INR) will ask the customer for OTP verification as well."
          />
        </SettingsCard>

        <SettingsCard title="UPI" icon={ZapIcon}>
          <Text>
            Accept recurring payments via UPI apps like PhonePe, Paytm & BHIM for your
            subscriptions. Only supports Indian currency.
          </Text>

          <Alert
            isDismissible={false}
            intent="information"
            title="Payment limits"
            description="Accept payments upto ₹ 1,00,000 ₹ - Indian Rupee (INR) (For BFSI: ₹ 2,00,000 ₹ - Indian Rupee (INR)) Payments above ₹ 15,000 ₹ - Indian Rupee (INR) will ask the customer for UPI PIN verification as well."
          />
        </SettingsCard>

        <SettingsCard title="eMandate" icon={BankIcon}>
          <Text>
            Accept recurring payments directly via bank accounts for your subscriptions. Only
            supports Indian currency.
          </Text>

          <Alert
            isDismissible={false}
            intent="information"
            title="Payment limits"
            description="Accept payments upto: ₹ 1,00,00,000"
          />
        </SettingsCard>
      </Box>
    </PanelWrapper>
  );
};

const TabsTemplate: StoryFn<(props: StoryControlProps) => React.ReactElement> = (args) => {
  const isMobile = useIsMobile();
  const invalidationKey = `${args.isFullWidthTabItem}-${args.orientation}-${args.size}-${args.tabItemIsDisabled}`;
  const orientation = isMobile ? 'horizontal' : args.orientation;
  const isVertical = orientation === 'vertical';
  const isFilled = args.variant === 'filled';

  return (
    <Box height={isReactNative() ? '100%' : undefined}>
      <Card elevation="none" padding="spacing.0">
        <CardBody height="100%">
          <Box
            height="100%"
            marginX="spacing.6"
            marginBottom="spacing.6"
            marginTop={isFilled || isVertical ? 'spacing.6' : 'spacing.2'}
          >
            <Tabs key={invalidationKey} {...args} orientation={orientation}>
              <TabList>
                <TabItem value="subscriptions">Subscription</TabItem>
                <TabItem
                  value="plans"
                  isDisabled={args.tabItemIsDisabled}
                  leading={args.tabItemLeading}
                  trailing={args.tabItemTrailing}
                >
                  {args.tabItemChildren}
                </TabItem>
                <TabItem value="settings">Settings</TabItem>
              </TabList>

              <TabPanel value="subscriptions">
                <SubscriptionPanel isVertical={isVertical} />
              </TabPanel>
              <TabPanel value="plans">
                <PlansPanel isVertical={isVertical} />
              </TabPanel>
              <TabPanel value="settings">
                <SettingsPanel isVertical={isVertical} />
              </TabPanel>
            </Tabs>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
};

export const Default = TabsTemplate.bind({});

const ControlledTabsTemplate: StoryFn<(props: StoryControlProps) => React.ReactElement> = (
  args,
) => {
  const invalidationKey = `${args.isFullWidthTabItem}-${args.orientation}-${args.size}-${args.tabItemIsDisabled}`;
  const isVertical = args.orientation === 'vertical';
  const [value, setValue] = React.useState('plans');

  return (
    <Box height={isReactNative() ? '100%' : undefined}>
      <Box padding="spacing.3" marginBottom="spacing.5">
        <Text>Tab's state can be controlled by using the value & onChange prop.</Text>
        <Text weight="bold" marginBottom="spacing.4">
          Current Tab: {value}
        </Text>
        <Box display="flex" flexDirection="row" gap="spacing.4">
          <Button variant="tertiary" onClick={() => setValue('subscriptions')}>
            Go to Subscriptions
          </Button>
          <Button variant="tertiary" onClick={() => setValue('plans')}>
            Go to Plans
          </Button>
          <Button variant="tertiary" onClick={() => setValue('settings')}>
            Go to Settings
          </Button>
        </Box>
      </Box>

      <Card elevation="none" padding="spacing.0">
        <CardBody height="100%">
          <Box height="100%" marginX="spacing.6" marginBottom="spacing.6" marginTop="spacing.2">
            <Tabs
              key={invalidationKey}
              value={value}
              onChange={(value) => {
                setValue(value);
              }}
            >
              <TabList>
                <TabItem value="subscriptions">Subscription</TabItem>
                <TabItem
                  value="plans"
                  isDisabled={args.tabItemIsDisabled}
                  leading={args.tabItemLeading}
                  trailing={args.tabItemTrailing}
                >
                  {args.tabItemChildren}
                </TabItem>
                <TabItem value="settings">Settings</TabItem>
              </TabList>

              <TabPanel value="subscriptions">
                <SubscriptionPanel isVertical={isVertical} />
              </TabPanel>
              <TabPanel value="plans">
                <PlansPanel isVertical={isVertical} />
              </TabPanel>
              <TabPanel value="settings">
                <SettingsPanel isVertical={isVertical} />
              </TabPanel>
            </Tabs>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
};

export const Controlled = ControlledTabsTemplate.bind({});

const TabsWithTooltipTemplate: StoryFn<(props: StoryControlProps) => React.ReactElement> = (
  args,
) => {
  const invalidationKey = `${args.isFullWidthTabItem}-${args.orientation}-${args.size}-${args.tabItemIsDisabled}`;
  const isVertical = args.orientation === 'vertical';

  if (isReactNative()) {
    return <Text>Story not available on ReactNative</Text>;
  }

  return (
    <Box>
      <Text>
        You can compose Tooltip with TabItem to show additional information about the TabItem by
        wrapping the <Code size="medium">TabItem</Code> with{' '}
        <Code size="medium">TooltipInteractiveWrapper</Code>.
      </Text>
      <Text marginBottom="spacing.5" type="subdued">
        (Hover over the Settings tab to see it in action)
      </Text>
      <Card elevation="none" padding="spacing.0">
        <CardBody>
          <Box marginX="spacing.6" marginBottom="spacing.6" marginTop="spacing.2">
            <Tabs key={invalidationKey}>
              <TabList>
                <TabItem value="subscriptions">Subscription</TabItem>
                <TabItem
                  value="plans"
                  isDisabled={args.tabItemIsDisabled}
                  leading={args.tabItemLeading}
                  trailing={args.tabItemTrailing}
                >
                  {args.tabItemChildren}
                </TabItem>
                <Tooltip
                  placement="right"
                  content="Change payment method settings and enable different payment methods."
                  title="Payment Settings"
                >
                  <TooltipInteractiveWrapper>
                    <TabItem value="settings">Settings</TabItem>
                  </TooltipInteractiveWrapper>
                </Tooltip>
              </TabList>

              <TabPanel value="subscriptions">
                <SubscriptionPanel isVertical={isVertical} />
              </TabPanel>
              <TabPanel value="plans">
                <PlansPanel isVertical={isVertical} />
              </TabPanel>
              <TabPanel value="settings">
                <SettingsPanel isVertical={isVertical} />
              </TabPanel>
            </Tabs>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
};

export const WithTooltip = TabsWithTooltipTemplate.bind({});

export const Medium = TabsTemplate.bind({});
Medium.storyName = 'Size: Medium';
Medium.args = {
  size: 'medium',
};

export const Large = TabsTemplate.bind({});
Large.storyName = 'Size: Large';
Large.args = {
  size: 'large',
};

export const Filled = TabsTemplate.bind({});
Filled.args = {
  variant: 'filled',
};

export const FilledVertical = TabsTemplate.bind({});
FilledVertical.args = {
  variant: 'filled',
  orientation: 'vertical',
};

export const Bordered = TabsTemplate.bind({});
Bordered.args = {
  variant: 'bordered',
};

export const Borderless = TabsTemplate.bind({});
Borderless.args = {
  variant: 'borderless',
};

export const BorderedVertical = TabsTemplate.bind({});
BorderedVertical.args = {
  variant: 'bordered',
  orientation: 'vertical',
};

export const FullWidthTabItem = TabsTemplate.bind({});
FullWidthTabItem.args = {
  isFullWidthTabItem: true,
};

const ProductUseCase1Template: StoryFn<(props: StoryControlProps) => React.ReactElement> = () => {
  return (
    <Box height={isReactNative() ? '100%' : undefined}>
      <Text>
        With the <Code size="medium">borderless</Code> variant, you can remove the default border
        below the TabList and separate <Code size="medium">Divider</Code> component which spans end
        to end to the <Code size="medium">Card</Code>.
      </Text>

      <Card marginTop="spacing.6" elevation="none" padding="spacing.0">
        <CardBody height="100%">
          <Tabs variant="borderless" defaultValue="subscriptions">
            <TabList marginX="spacing.6">
              <TabItem value="subscriptions" leading={SubscriptionsIcon}>
                Subscription
              </TabItem>
              <TabItem value="plans" leading={ClipboardIcon}>
                Plans
              </TabItem>
              <TabItem value="settings" leading={SettingsIcon}>
                Settings
              </TabItem>
            </TabList>
            <Divider />

            <Box paddingX="spacing.6" paddingBottom="spacing.6">
              <TabPanel value="subscriptions">
                <SubscriptionPanel isVertical={false} />
              </TabPanel>
              <TabPanel value="plans">
                <PlansPanel isVertical={false} />
              </TabPanel>
              <TabPanel value="settings">
                <SettingsPanel isVertical={false} />
              </TabPanel>
            </Box>
          </Tabs>
        </CardBody>
      </Card>
    </Box>
  );
};

export const ProductUseCase1 = ProductUseCase1Template.bind({});
ProductUseCase1.storyName = 'Product Usecase: End to End Borders';

const ProductUseCase2Template: StoryFn<(props: StoryControlProps) => React.ReactElement> = () => {
  const isMobile = useIsMobile();
  const [value, setValue] = React.useState('subscriptions');

  if (isReactNative()) {
    return <Text>Story not supported in ReactNative</Text>;
  }

  let actions: React.ReactElement = <></>;

  if (value === 'subscriptions') {
    actions = (
      <>
        <Link href="#" icon={ExternalLinkIcon}>
          Documentation
        </Link>
        <Button size="small">Subscribe</Button>
      </>
    );
  }

  if (value === 'plans') {
    actions = <Button size="small">Create Plan</Button>;
  }

  if (value === 'settings') {
    actions = (
      <Link href="#" icon={ExternalLinkIcon}>
        Need Help?
      </Link>
    );
  }

  if (isMobile) {
    actions = <></>;
  }

  return (
    <Box height={isReactNative() ? '100%' : undefined}>
      <Text>
        We can add related actions to the Tab's right side (as found in the{' '}
        <Link href="https://dashboard.razorpay.com/app/subscriptions">dashboard</Link>) by wrapping
        the <Code size="medium">TabList</Code> with a <Code size="medium">Box</Code> and aligning
        buttons or links to the right side of the box with flex.
      </Text>
      <Text type="subdued">
        Note: In mobile devices the real estate is limited, thus the UI should be tweaked.
      </Text>

      <Card marginTop="spacing.6" elevation="none" padding="spacing.0">
        <CardBody>
          <Tabs variant="borderless" value={value} onChange={setValue}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              paddingX="spacing.6"
            >
              <TabList>
                <TabItem value="subscriptions" leading={SubscriptionsIcon}>
                  Subscription
                </TabItem>
                <TabItem value="plans" leading={ClipboardIcon}>
                  Plans
                </TabItem>
                <TabItem value="settings" leading={SettingsIcon}>
                  Settings
                </TabItem>
              </TabList>
              <Box display="flex" alignItems="center" gap="spacing.5">
                {actions}
              </Box>
            </Box>
            <Divider />

            <Box paddingX="spacing.6" paddingBottom="spacing.6">
              <TabPanel value="subscriptions">
                <SubscriptionPanel isVertical={false} />
              </TabPanel>
              <TabPanel value="plans">
                <PlansPanel isVertical={false} />
              </TabPanel>
              <TabPanel value="settings">
                <SettingsPanel isVertical={false} />
              </TabPanel>
            </Box>
          </Tabs>
        </CardBody>
      </Card>
    </Box>
  );
};

export const ProductUseCase2 = ProductUseCase2Template.bind({});
ProductUseCase2.storyName = 'Product Usecase: Tabs with Toolbar';

const AccountRoute = ({
  match,
}: {
  match: {
    params: {
      id: string;
    };
  };
}) => (
  <Text weight="bold" marginY="spacing.4">
    Router param: {match.params.id}
  </Text>
);

const ReactRouterExample = () => {
  const history = useHistory();
  const navigateTo = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    history.push(url);
  };

  if (isReactNative()) {
    return <Text>Story not supported in ReactNative</Text>;
  }

  return (
    <Box height={isReactNative() ? '100%' : undefined}>
      <Text>
        You can use <Code size="medium">Tabs</Code> with <Code size="medium">react-router</Code> to
        create a tabbed navigation.
      </Text>
      <List>
        <ListItem>
          <ListItemText>
            Step 1: Pass <Code size="medium">href</Code> prop to the{' '}
            <Code size="medium">TabItem</Code> to make it a link.
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            Step 2: Add <Code size="medium">onClick</Code> handler to the{' '}
            <Code size="medium">TabItem</Code> to prevent the default behaviour of the link.
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            Step 3: Use <Code size="medium">react-router</Code> utilities like{' '}
            <Code size="medium">history.push()</Code> to do client side navigation.
          </ListItemText>
        </ListItem>
      </List>

      <Text type="subdued">
        Switch to the <Code size="medium">Actions</Code> addon panel in storybook to see how routes
        are changing, and also notice how we can detect which route is active by using the{' '}
        <Code size="medium">Route</Code>
        component.
      </Text>

      <Card marginTop="spacing.6" elevation="none" padding="spacing.0">
        <CardBody>
          <Tabs variant="borderless" defaultValue="subscriptions">
            <TabList marginX="spacing.6">
              <TabItem
                value="subscriptions"
                leading={SubscriptionsIcon}
                href="/accounts/subscriptions"
                onClick={(e) => navigateTo(e, '/accounts/subscriptions')}
              >
                Subscription
              </TabItem>
              <TabItem
                value="plans"
                leading={ClipboardIcon}
                href="/accounts/plans"
                onClick={(e) => navigateTo(e, '/accounts/plans')}
              >
                Plans
              </TabItem>
              <TabItem
                value="settings"
                leading={SettingsIcon}
                href="/accounts/settings"
                onClick={(e) => navigateTo(e, '/accounts/settings')}
              >
                Settings
              </TabItem>
            </TabList>
            <Divider />

            <Box paddingX="spacing.6" paddingBottom="spacing.6">
              <Route path="/accounts/:id" component={AccountRoute} />

              <TabPanel value="subscriptions">
                <SubscriptionPanel isVertical={false} />
              </TabPanel>
              <TabPanel value="plans">
                <PlansPanel isVertical={false} />
              </TabPanel>
              <TabPanel value="settings">
                <SettingsPanel isVertical={false} />
              </TabPanel>
            </Box>
          </Tabs>
        </CardBody>
      </Card>
    </Box>
  );
};

const ProductUseCase3Template: StoryFn<(props: StoryControlProps) => React.ReactElement> = () => {
  return <ReactRouterExample />;
};

export const ProductUseCase3 = ProductUseCase3Template.bind({});
ProductUseCase3.storyName = 'Product Usecase: React Router';
