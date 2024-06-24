import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import type { MenuProps } from './';
import { Menu, MenuDivider, MenuItem, MenuOverlay, MenuHeader, MenuFooter } from './';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { CopyIcon, LogOutIcon, ShareIcon, TestIcon, TicketIcon, UserIcon } from '~components/Icons';
import { Avatar } from '~components/Avatar';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Text } from '~components/Typography';
import { Link } from '~components/Link';
import { Tooltip } from '~components/Tooltip';

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as Meta<any>;

type TemplateProps = MenuProps & { trigger: React.ReactElement };

const MenuTemplate: StoryFn<TemplateProps> = ({ trigger, ...args }) => {
  return (
    <Box>
      <Menu {...args}>
        {trigger}
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
  );
};

export const Default = MenuTemplate.bind({});
Default.args = {
  trigger: <Avatar name="Saurabh Daware" size="large" color="primary" />,
};
