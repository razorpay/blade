import React from 'react';
import { Menu, MenuItem, MenuOverlay, MenuHeader, MenuDivider, MenuFooter, Button, Box, Text, Link } from '@razorpay/blade/components';
import { UserIcon, TestIcon, TicketIcon, ShareIcon, LogOutIcon, CopyIcon } from '@razorpay/blade/components';

export const Default = () => (
  <Menu>
    <Button>Account Menu</Button>
    <MenuOverlay>
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
      <MenuItem
        leading={<LogOutIcon size="small" color="feedback.icon.negative.intense" />}
        title="Log Out"
        color="negative"
      />
    </MenuOverlay>
  </Menu>
);

export const WithHeader = () => (
  <Menu>
    <Button>Profile</Button>
    <MenuOverlay>
      <MenuHeader title="John Doe" subtitle="Merchant" leading={<UserIcon />} />
      <MenuItem title="View Profile" />
      <MenuItem title="Settings" />
      <MenuItem title="Logout" color="negative" />
    </MenuOverlay>
  </Menu>
);

export const WithDivider = () => (
  <Menu>
    <Button>Actions</Button>
    <MenuOverlay>
      <MenuItem title="Edit" />
      <MenuItem title="Duplicate" />
      <MenuDivider />
      <MenuItem title="Delete" color="negative" />
    </MenuOverlay>
  </Menu>
);

export const NestedMenu = () => (
  <Menu>
    <Button>Share</Button>
    <MenuOverlay>
      <MenuItem title="Mail" />
      <Menu>
        <MenuItem leading={<ShareIcon size="small" />} title="Social Media" />
        <MenuOverlay>
          <MenuItem title="Instagram Stories" />
          <MenuItem title="Instagram Post" />
          <MenuItem title="Twitter" />
        </MenuOverlay>
      </Menu>
    </MenuOverlay>
  </Menu>
);

export const WithFooter = () => (
  <Menu>
    <Button>More Options</Button>
    <MenuOverlay>
      <MenuItem title="Documentation" />
      <MenuItem title="Support" />
      <MenuFooter>
        <Text variant="caption" size="small">
          Partner with us and start earning on every referral
        </Text>
      </MenuFooter>
    </MenuOverlay>
  </Menu>
);
