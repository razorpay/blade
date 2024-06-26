/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import type { TabNavItemProps } from '../TabNav';
import { TabNav, TabNavItem } from '../TabNav';
import { tabNavExample } from './code';
import { Box } from '~components/Box';
import iconMap from '~components/Icons/iconMap';
import { ChevronDownIcon, ChevronRightIcon, HomeIcon } from '~components/Icons';
import { Menu, MenuFooter, MenuHeader, MenuItem, MenuOverlay } from '~components/Menu';
import { Badge } from '~components/Badge';
import { Link } from '~components/Link';
import { Code, Text } from '~components/Typography';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';

const DocsPage = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="TabNav"
      componentDescription="TabNav is a subcomponent of TopNav which can be used inside or outside TopNav"
    >
      <Sandbox files={tabNavExample} editorHeight={600} hideNavigation={false} openFile="App.tsx" />
    </StoryPageWrapper>
  );
};

const trailingMapping = {
  '<ChevronDownIcon />': <ChevronDownIcon />,
  '<Badge color="positive">NEW</Badge>': <Badge color="positive">NEW</Badge>,
};

export default {
  title: 'Components/TopNav/TabNav',
  component: TabNavItem,
  argTypes: {
    icon: {
      name: 'icon',
      type: 'select',
      options: Object.keys(iconMap),
      mapping: iconMap,
    } as unknown,
    trailing: {
      name: 'trailing',
      type: 'select',
      options: Object.keys(trailingMapping),
      mapping: trailingMapping,
    } as unknown,
    onClick: {
      type: 'function',
    },
    onKeyDown: {
      type: 'function',
    },
    onKeyUp: {
      type: 'function',
    },
    onMouseDown: {
      type: 'function',
    },
    onPointerDown: {
      type: 'function',
    },
  },
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: DocsPage,
    },
  },
} as Meta<TabNavItemProps>;

const TabNavTemplate: StoryFn<typeof TabNavItem> = (args) => {
  return (
    <Box padding="spacing.4">
      <TabNav>
        <TabNavItem icon={HomeIcon} accessibilityLabel="Home" href="/home" />
        <TabNavItem {...args} href="/payroll">
          {args.children}
        </TabNavItem>
        <TabNavItem href="/payments">Payments</TabNavItem>
        <TabNavItem href="/magic-checkout">Magic Checkout</TabNavItem>
      </TabNav>
    </Box>
  );
};

const TabNavTemplateWithMenu: StoryFn<typeof TabNavItem> = (args) => {
  return (
    <Box padding="spacing.4">
      <Box display="flex" gap="spacing.2" flexDirection="column" marginBottom="spacing.6">
        <Text>
          You can compose <Code size="medium">TabNav</Code> with Menu component to create a dropdown
          menus within TabNav.
        </Text>
        <Text>
          Each <Code size="medium">TabNavItem </Code>component can be wrapped with Menu component to
          achieve this.
        </Text>
      </Box>
      <TabNav>
        <TabNavItem icon={HomeIcon} accessibilityLabel="Home" href="/home" />
        <TabNavItem {...args} href="/payroll">
          {args.children}
        </TabNavItem>
        <TabNavItem href="/payments">Payments</TabNavItem>
        <TabNavItem href="/magic-checkout">Magic Checkout</TabNavItem>
        <Menu openInteraction="hover">
          <TabNavItem href="#" trailing={<ChevronDownIcon />}>
            Explore
          </TabNavItem>
          <MenuOverlay>
            <MenuHeader
              title="Products for you"
              trailing={
                <Badge emphasis="subtle" color="notice">
                  Recommended
                </Badge>
              }
            />
            <MenuItem>
              <Box padding="spacing.4">
                <Text color="surface.text.gray.subtle">Payroll</Text>
              </Box>
            </MenuItem>
            <MenuItem>
              <Box padding="spacing.4">
                <Text color="surface.text.gray.subtle">Payout</Text>
              </Box>
            </MenuItem>
            <MenuFooter>
              <Link href="" icon={ChevronRightIcon} iconPosition="right">
                View all products
              </Link>
            </MenuFooter>
          </MenuOverlay>
        </Menu>
      </TabNav>
    </Box>
  );
};

export const TabNavExample = TabNavTemplate.bind({});
TabNavExample.args = {
  children: 'Payroll',
  isActive: true,
};
TabNavExample.storyName = 'TabNavExample';

export const WithMenu = TabNavTemplateWithMenu.bind({});
WithMenu.args = {
  children: 'Payroll',
  isActive: true,
};
WithMenu.storyName = 'With Menu';
