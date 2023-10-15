/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import type { TabItemProps, TabsProps } from './types';
import { Tabs, TabItem, TabList, TabPanel } from './';
import { Code, Heading, Text, Title } from '~components/Typography';
import { BankIcon, CreditCardIcon, ZapIcon } from '~components/Icons';
import { Counter } from '~components/Counter';
import { Box } from '~components/Box';
import { Card, CardBody, CardHeader, CardHeaderLeading } from '~components/Card';
import { Alert } from '~components/Alert';
import { Switch } from '~components/Switch';
import iconMap from '~components/Icons/iconMap';
import { Badge } from '~components/Badge';
import { Button } from '~components/Button';
import { Tooltip, TooltipInteractiveWrapper } from '~components/Tooltip';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Tabs"
      componentDescription="A tab is a navigation component used in the interface to switch between different views in the same context. Tabs are contextual to the section or the page and are triggered by user interaction."
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=60965%3A367088&mode=dev',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=19064%3A77449&mode=dev',
      }}
    >
      <Title>Usage</Title>
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
};
const tabItemTrailing = {
  Counter: <Counter color="positive" value={2} />,
  Badge: <Badge color="positive">NEW</Badge>,
};
export default {
  title: 'Components/Tabs',
  component: Tabs,
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
    autoWidth: {
      control: {
        type: 'boolean',
      },
      table: { category: propsCategory.TABS },
      defaultValue: false,
    },
    orientation: {
      control: {
        type: 'select',
        options: ['horizontal', 'vertical'],
      },
      table: { category: propsCategory.TABS },
      defaultValue: 'horizontal',
    },
    size: {
      table: { category: propsCategory.TABS },
      defaultValue: 'medium',
    },
    variant: {
      table: { category: propsCategory.TABS },
      defaultValue: 'bordered',
    },
    tabItemChildren: {
      control: {
        type: 'text',
      },
      table: { category: propsCategory.TAB_ITEM },
      defaultValue: 'Plans',
      description: 'The label of the tab item.',
    },
    tabItemIsDisabled: {
      control: {
        type: 'boolean',
      },
      table: { category: propsCategory.TAB_ITEM },
      defaultValue: false,
      description: 'If `true`, the tab item will be disabled.',
    },
    tabItemLeading: {
      table: { category: propsCategory.TAB_ITEM },
      control: {
        type: 'select',
      },
      mapping: iconMap,
      options: Object.keys(iconMap),
      defaultValue: 'ClipboardIcon',
      description: 'Leading element of the tab item. Can be used to render an icon.',
    },
    tabItemTrailing: {
      table: { category: propsCategory.TAB_ITEM },
      control: {
        type: 'select',
      },
      mapping: tabItemTrailing,
      options: Object.keys(tabItemTrailing),
      defaultValue: 'Badge',
      description: 'Trailing element of the tab item. Can be used to render an badge/counter.',
    },
  },
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
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
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
              {icon}
              <Heading>{title}</Heading>
            </Box>
            <Switch accessibilityLabel="Enable Card" />
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

const TabsTemplate: ComponentStory<(props: StoryControlProps) => React.ReactElement> = (args) => {
  const invalidationKey = `${args.autoWidth}-${args.orientation}-${args.size}-${args.tabItemIsDisabled}`;
  const isVertical = args.orientation === 'vertical';
  return (
    <Box>
      <Tabs key={invalidationKey} {...args}>
        {/* <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
          <TabList>
            <Box display="flex" alignItems="center" gap="spacing.4">
              <TabItem value="subscriptions">Subscriptions</TabItem>
              <TabItem value="plans">Plans</TabItem>
              <TabItem value="settings">Settings</TabItem>
            </Box>
            <Box marginLeft="auto" display="flex" alignItems="center" gap="spacing.4">
              <Link href="#">Documentation</Link>
              <Button variant="secondary" size="medium" icon={PlusIcon}>
                Create New Subscription
              </Button>
            </Box>
          </TabList>
        </Box> */}
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
  );
};

export const Default = TabsTemplate.bind({});

const ControlledTabsTemplate: ComponentStory<(props: StoryControlProps) => React.ReactElement> = (
  args,
) => {
  const invalidationKey = `${args.autoWidth}-${args.orientation}-${args.size}-${args.tabItemIsDisabled}`;
  const isVertical = args.orientation === 'vertical';
  const [value, setValue] = React.useState('plans');

  return (
    <Box>
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
  );
};

export const Controlled = ControlledTabsTemplate.bind({});

const TabsWithTooltipTemplate: ComponentStory<(props: StoryControlProps) => React.ReactElement> = (
  args,
) => {
  const invalidationKey = `${args.autoWidth}-${args.orientation}-${args.size}-${args.tabItemIsDisabled}`;
  const isVertical = args.orientation === 'vertical';

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
  );
};

export const WithTooltip = TabsWithTooltipTemplate.bind({});

export const Medium = TabsTemplate.bind({});
Medium.args = {
  size: 'medium',
};

export const Large = TabsTemplate.bind({});
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

export const BorderedVertical = TabsTemplate.bind({});
BorderedVertical.args = {
  variant: 'bordered',
  orientation: 'vertical',
};

export const AutoWidth = TabsTemplate.bind({});
AutoWidth.args = {
  autoWidth: true,
};
