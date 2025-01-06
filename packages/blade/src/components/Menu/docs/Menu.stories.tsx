import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { MenuProps } from '..';
import { Menu, MenuDivider, MenuItem, MenuOverlay, MenuHeader, MenuFooter } from '..';
import { CustomMenuItem, CustomMenuTrigger, MenuTrigger, navMenuItems } from './CustomMenu';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import {
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CopyIcon,
  LogOutIcon,
  ShareIcon,
  TestIcon,
  TicketIcon,
  UserIcon,
} from '~components/Icons';
import { Avatar } from '~components/Avatar';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Text } from '~components/Typography';
import { Link } from '~components/Link';
import { Badge } from '~components/Badge';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';
import { Alert } from '~components/Alert';
import { List, ListItem, ListItemText } from '~components/List';
import { Tooltip, TooltipInteractiveWrapper } from '~components/Tooltip';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Menu"
      componentDescription="Action Menu displays a list of actions on temporary surfaces. They allow users to action(s) from multiple options. They appear when users interact with a button, action, or other control."
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=90082-41948&m=dev&scaling=min-zoom&content-scaling=fixed&page-id=90026%3A23382&t=C1ehQJKwn0PpRa7Y-1"
    >
      <Alert
        isFullWidth
        isDismissible={false}
        color="information"
        marginBottom="spacing.7"
        title="Menu Usage Note"
        description={
          <List>
            <ListItem>
              Menu is <ListItemText weight="semibold">NOT</ListItemText> responsive by default. Some
              Menus should become BottomSheet or Drawer in mobile. Make sure to use correct
              component in mobile
            </ListItem>
            <ListItem>
              Menus are <ListItemText weight="semibold">NOT</ListItemText> selectable. Use Dropdown
              with Select or AutoComplete for selectable options
            </ListItem>
          </List>
        }
      />
      <Title>Usage</Title>
      <Sandbox>
        {`
        import React from 'react';
        import { 
          Menu, 
          MenuDivider, 
          MenuItem, 
          MenuOverlay, 
          MenuHeader, 
          MenuFooter,
          Button,
          Box,
          Link,
          Text,
          CopyIcon,
          LogOutIcon,
          ShareIcon,
          TestIcon,
          TicketIcon,
          UserIcon
        } from '@razorpay/blade/components';
        
        function App() {
          return (
            <Box>
              <Menu>
                <Button>Menu</Button>
                <MenuOverlay>
                  <MenuHeader title="Saurabh Daware" subtitle="Admin" leading={<UserIcon />} />
                  <Box paddingY="spacing.4" paddingX="spacing.3">
                    <Text display="block" size="medium" weight="semibold">
                      Razorpay Pvt Ltd
                    </Text>
                    <Box display="flex" alignItems="center" gap="spacing.3">
                      <Text size="small">MID: Xyzyspoon13857</Text>
                      <Link variant="button" size="small" icon={CopyIcon} />
                    </Box>
                  </Box>
                  <Button variant="tertiary" isFullWidth size="xsmall">
                    Switch Merchant
                  </Button>
                  <MenuDivider marginTop="spacing.3" />
                  <MenuItem
                    title="Enable Test Mode"
                    leading={<TestIcon size="small" />}
                    description="Enable test mode"
                  />
                  <MenuItem
                    title="View Support Tickets"
                    leading={<TicketIcon size="small" />}
                    description="View all your support tickets"
                  />
                  <Menu>
                    <MenuItem leading={<ShareIcon size="small" />} title="Share Profile" />
                    <MenuOverlay>
                      <MenuItem title="Mail" />
                      <Menu>
                        <MenuItem title="Instagram" />
                        <MenuOverlay>
                          <MenuItem title="Instagram Stories" />
                          <MenuItem title="Instagram Post" />
                          <MenuItem title="Instagram Chat" />
                        </MenuOverlay>
                      </Menu>
                    </MenuOverlay>
                  </Menu>
                  <MenuItem
                    leading={<LogOutIcon size="small" color="feedback.icon.negative.intense" />}
                    title="Log Out"
                    color="negative"
                  />
                  <MenuFooter>
                    <Text variant="caption" size="small">
                      Partner with us and start earning on every referral
                    </Text>
                  </MenuFooter>
                </MenuOverlay>
              </Menu>
            </Box>
          )
          
        }

        export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Menu',
  component: Menu,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
    trigger: {
      table: {
        disable: true,
      },
    },
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<MenuProps>;

type TemplateProps = MenuProps & { trigger: React.ReactElement };

const accountsMenuOverlayContent = (
  <>
    <MenuHeader title="Saurabh Daware" subtitle="Admin" leading={<UserIcon />} />
    <Box paddingBottom="spacing.4" paddingX="spacing.3">
      <Text display="block" size="medium" weight="semibold">
        Razorpay Pvt Ltd
      </Text>
      <Box display="flex" alignItems="center" gap="spacing.3">
        <Text size="small">MID: Xyzyspoon13857</Text>
        <Link variant="button" size="small" icon={CopyIcon} />
      </Box>
    </Box>
    <Button variant="tertiary" isFullWidth size="xsmall">
      Switch Merchant
    </Button>
    <MenuDivider marginY="spacing.3" />
    <MenuItem
      title="Enable Test Mode"
      leading={<TestIcon size="small" />}
      description="Enable test mode"
    />
    <MenuItem
      title="View Support Tickets"
      leading={<TicketIcon size="small" />}
      description="View all your support tickets"
    />
    <Menu>
      <MenuItem leading={<ShareIcon size="small" />} title="Share Profile" />
      <MenuOverlay>
        <MenuItem title="Mail" />
        <Menu>
          <MenuItem title="Instagram" />
          <MenuOverlay>
            <MenuItem title="Instagram Stories" />
            <MenuItem title="Instagram Post" />
            <MenuItem title="Instagram Chat" />
          </MenuOverlay>
        </Menu>
      </MenuOverlay>
    </Menu>
    <Tooltip content="Log out from Saurabh Daware's Profile">
      <MenuItem
        leading={<LogOutIcon size="small" color="feedback.icon.negative.intense" />}
        title="Log Out"
        color="negative"
      />
    </Tooltip>
    <MenuFooter>
      <Text variant="caption" size="small">
        Partner with us and start earning on every referral
      </Text>
    </MenuFooter>
  </>
);

const MenuTemplate: StoryFn<TemplateProps> = ({ trigger, ...args }) => {
  return (
    <Box>
      <Menu {...args}>
        {trigger}
        <MenuOverlay>{accountsMenuOverlayContent}</MenuOverlay>
      </Menu>
    </Box>
  );
};

const CustomOverlayMenuTemplate: StoryFn<MenuProps> = (args) => {
  return (
    <>
      <Text marginY="spacing.4">
        Menu component is flexible enough to let you create custom menus with custom triggers and
        custom items
      </Text>
      <Box display="flex">
        <Menu {...args}>
          <MenuTrigger>Payments</MenuTrigger>
          <MenuOverlay>
            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="spacing.3">
              {navMenuItems.payments.map((product) => (
                <CustomMenuItem key={product.name} {...product} />
              ))}
            </Box>
            <Link
              icon={ArrowRightIcon}
              iconPosition="right"
              size="large"
              marginY="spacing.3"
              marginX="spacing.4"
              href="https://razorpay.com/"
            >
              View All Products
            </Link>
          </MenuOverlay>
        </Menu>

        <Menu {...args}>
          <MenuTrigger>Banking+</MenuTrigger>
          <MenuOverlay>
            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="spacing.3">
              {navMenuItems.banking.map((product) => (
                <CustomMenuItem key={product.name} {...product} />
              ))}
            </Box>
            <Link
              icon={ArrowRightIcon}
              iconPosition="right"
              size="large"
              marginY="spacing.3"
              marginX="spacing.4"
              href="https://razorpay.com/x/"
            >
              View All Products
            </Link>
          </MenuOverlay>
        </Menu>

        <Menu {...args}>
          <MenuTrigger>Payroll</MenuTrigger>
          <MenuOverlay>
            <MenuItem title="For SMEs" href="/payroll" />
            <MenuItem
              title="For Enterprises"
              href="/payroll/enterprises"
              titleSuffix={
                <Badge color="positive" size="small">
                  NEW
                </Badge>
              }
            />
          </MenuOverlay>
        </Menu>
      </Box>
    </>
  );
};

const ControlledMenuTemplate: StoryFn<TemplateProps> = ({ trigger, ...args }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Box>
      <Button marginY="spacing.4" onClick={() => setIsOpen(true)}>
        Open Menu
      </Button>
      <Menu {...args} isOpen={isOpen} onOpenChange={({ isOpen }) => setIsOpen(isOpen)}>
        {trigger}
        <MenuOverlay>{accountsMenuOverlayContent}</MenuOverlay>
      </Menu>
    </Box>
  );
};

export const Default = MenuTemplate.bind({});
Default.args = {
  trigger: <Avatar name="Saurabh Daware" size="large" color="primary" />,
};

export const CustomItems = CustomOverlayMenuTemplate.bind({});
CustomItems.args = {
  openInteraction: 'hover',
};

export const WithDifferentTriggers = (props: MenuProps): React.ReactElement => {
  const [isLinkTriggerOpen, setIsLinkTriggerOpen] = React.useState(false);

  return (
    <Box display="flex" flexDirection="row" alignItems="center" gap="spacing.8">
      <MenuTemplate {...props} trigger={<Button>Button Trigger</Button>} />
      <MenuTemplate {...props} trigger={<Avatar name="Saurabh Daware" size="large" />} />
      <MenuTemplate
        {...props}
        onOpenChange={({ isOpen }) => {
          setIsLinkTriggerOpen(isOpen);
        }}
        trigger={
          <Link
            variant="button"
            icon={isLinkTriggerOpen ? ChevronUpIcon : ChevronDownIcon}
            iconPosition="right"
          >
            Link Trigger
          </Link>
        }
      />
      <MenuTemplate
        {...props}
        trigger={<CustomMenuTrigger>Custom Menu Trigger</CustomMenuTrigger>}
      />
    </Box>
  );
};

export const Controlled = ControlledMenuTemplate.bind({});
Controlled.args = {
  trigger: <Avatar name="Saurabh Daware" size="large" color="primary" />,
};

export const WithTooltip = (props: MenuProps): React.ReactElement => {
  return (
    <Box paddingTop="spacing.10">
      <Tooltip content="Saurabh Daware's Profile" placement="top">
        <TooltipInteractiveWrapper>
          <Menu {...props}>
            <Avatar name="Saurabh Daware" />
            <MenuOverlay>{accountsMenuOverlayContent}</MenuOverlay>
          </Menu>
        </TooltipInteractiveWrapper>
      </Tooltip>
    </Box>
  );
};
