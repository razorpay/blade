/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import type { TabNavItemProps } from '../TabNav';
import { TabNavItems, TabNav, TabNavItem } from '../TabNav';
import { tabNavExample } from './code';
import { Box } from '~components/Box';
import iconMap from '~components/Icons/iconMap';
import {
  AcceptPaymentsIcon,
  AwardIcon,
  ChevronDownIcon,
  HomeIcon,
  ShoppingBagIcon,
} from '~components/Icons';
import { Menu, MenuItem, MenuOverlay } from '~components/Menu';
import { Badge } from '~components/Badge';
import { Link } from '~components/Link';
import { Code, Text } from '~components/Typography';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { List, ListItem, ListItemCode } from '~components/List';
import { Alert } from '~components/Alert';

const DocsPage = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="TabNav"
      componentDescription="TabNav is a subcomponent of TopNav which can be used inside or outside TopNav"
    >
      <Sandbox files={tabNavExample} editorHeight={600} hideNavigation={false} openFile="App.js" />
    </StoryPageWrapper>
  );
};

const trailingMapping = {
  '<ChevronDownIcon />': <ChevronDownIcon />,
  '<Badge color="positive">NEW</Badge>': <Badge color="positive">NEW</Badge>,
};

const propsCategory = {
  TAB_NAV_ITEM: 'TabNavItem Props',
  ITEM_DATA: 'Extra props for "item" data',
};

export default {
  title: 'Components/TopNav/TabNav',
  component: TabNavItem,
  argTypes: {
    title: {
      type: 'string',
      table: { category: propsCategory.TAB_NAV_ITEM },
    },
    href: {
      type: 'string',
      table: { category: propsCategory.TAB_NAV_ITEM },
    },
    target: {
      type: 'string',
      table: { category: propsCategory.TAB_NAV_ITEM },
    },
    accessibilityLabel: {
      type: 'string',
      table: { category: propsCategory.TAB_NAV_ITEM },
    },
    as: {
      type: 'string',
      table: { category: propsCategory.TAB_NAV_ITEM },
    },
    icon: {
      name: 'icon',
      type: 'select',
      options: Object.keys(iconMap),
      table: { category: propsCategory.TAB_NAV_ITEM },
    } as unknown,
    trailing: {
      name: 'trailing',
      type: 'select',
      options: Object.keys(trailingMapping),
      table: { category: propsCategory.TAB_NAV_ITEM },
    } as unknown,
    isAlwaysOverflowing: {
      type: 'boolean',
      table: { category: propsCategory.ITEM_DATA },
    },
    isActive: {
      type: 'boolean',
      table: { category: propsCategory.TAB_NAV_ITEM },
    },
    description: {
      type: 'string',
      table: { category: propsCategory.ITEM_DATA },
    },
    onClick: {
      type: 'function',
      table: { category: propsCategory.TAB_NAV_ITEM },
    },
    onKeyDown: {
      type: 'function',
      table: { category: propsCategory.TAB_NAV_ITEM },
    },
    onKeyUp: {
      type: 'function',
      table: { category: propsCategory.TAB_NAV_ITEM },
    },
    onMouseDown: {
      type: 'function',
      table: { category: propsCategory.TAB_NAV_ITEM },
    },
    onPointerDown: {
      type: 'function',
      table: { category: propsCategory.TAB_NAV_ITEM },
    },
  },
  args: {
    title: 'Payroll',
    description: 'Manage payroll effortlessly.',
    isAlwaysOverflowing: false,
    isActive: false,
  },
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: DocsPage,
    },
  },
} as Meta<TabNavItemProps>;

const TabNavTemplate: StoryFn<any> = (
  args: TabNavItemProps & {
    isAlwaysOverflowing: boolean;
    description: string;
  },
) => {
  const icon = iconMap[(args.icon as unknown) as keyof typeof iconMap];
  const trailing = trailingMapping[(args.trailing as unknown) as keyof typeof trailingMapping];

  return (
    <Box padding="spacing.4">
      <Text marginY="spacing.2">
        TabNav component provides a flexible way for you to build tabs which automatically handles
        responsiveness and overflows as screen size reduces
      </Text>

      <Text marginTop="spacing.5">
        TabNav component takes in an array of <Code>items</Code> and gives you the flexibility of
        the rendering via a <Link href="https://reactpatterns.com/#render-prop">render prop</Link>
      </Text>

      <Box marginY="spacing.4">
        <Text>The render prop exposes two arrays:</Text>
        <List>
          <ListItem>
            <ListItemCode>items</ListItemCode> - an array of items that fit in the available space
          </ListItem>
          <ListItem>
            <ListItemCode>overflowingItems</ListItemCode> - an array of items that overflow the
            available space
          </ListItem>
        </List>
      </Box>

      <Text>
        You can map over these arrays and render the <Code>TabNavItem</Code> component for each item
        or for the overflowing items you can render a <Code>Menu</Code> component to create a
        dropdown "More" menu.
      </Text>

      <Alert
        emphasis="subtle"
        color="information"
        description="TabNav's 'item' prop accepts all the props of TabNavItem component and few extra props like isAlwaysOverflowing, description"
        marginTop="spacing.4"
        isDismissible={false}
      />

      <TabNav
        key={JSON.stringify(args)}
        marginTop="spacing.7"
        items={[
          { title: 'Home', href: '/home', icon: HomeIcon },
          {
            href: '/payroll',
            title: args.title,
            icon,
            trailing,
            isActive: args.isActive,
            isAlwaysOverflowing: args.isAlwaysOverflowing,
            description: args.description,
          },
          {
            href: '/payments',
            title: 'Payments',
            icon: AcceptPaymentsIcon,
            description: 'Manage payments effortlessly.',
          },
          {
            href: '/magic-checkout',
            title: 'Magic Checkout',
            icon: ShoppingBagIcon,
            description: 'Fast, one-click checkout.',
          },
          {
            href: '/rize',
            title: 'Rize',
            icon: AwardIcon,
            isAlwaysOverflowing: true,
            description: 'Boost your business growth.',
          },
        ]}
      >
        {({ items, overflowingItems }) => {
          return (
            <>
              <TabNavItems>
                {items.map((item) => {
                  return (
                    <TabNavItem
                      key={item.title}
                      title={item.title}
                      href={item.href}
                      icon={item.icon}
                      isActive={item.isActive}
                      trailing={item.trailing}
                    />
                  );
                })}
              </TabNavItems>
              {overflowingItems.length ? (
                <Menu openInteraction="hover">
                  <TabNavItem title="More" trailing={<ChevronDownIcon />} />
                  <MenuOverlay>
                    {overflowingItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <MenuItem
                          key={item.href}
                          onClick={() => {
                            console.log('clicked', item.title);
                          }}
                        >
                          <Box padding="spacing.2">
                            <Box display="flex" gap="spacing.2">
                              {Icon && <Icon />}
                              <Text weight="semibold">{item.title}</Text>
                            </Box>
                            <Text
                              marginTop="spacing.2"
                              size="small"
                              color="surface.text.gray.subtle"
                            >
                              {item.description}
                            </Text>
                          </Box>
                        </MenuItem>
                      );
                    })}
                  </MenuOverlay>
                </Menu>
              ) : null}
            </>
          );
        }}
      </TabNav>
    </Box>
  );
};

export const TabNavExample = TabNavTemplate.bind({});
TabNavExample.args = {
  title: 'Payroll',
  isActive: true,
};
TabNavExample.storyName = 'TabNavExample';
