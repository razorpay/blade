/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import type { StoryFn } from '@storybook/react';
import { within, userEvent, waitFor } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import type { SideNav } from '../index';
import { SideNavExample } from './SideNavExample';
import { Box } from '~components/Box';
import { Button } from '~components/Button';

// Keeping the mobile test in different file because storybook's test runner is not able to change the viewport before running test
// With different file, we ignore running this file in test runner

export const Mobile: StoryFn<typeof SideNav> = (props): React.ReactElement => {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <Box>
      <SideNavExample isOpen={isMobileOpen} onDismiss={() => setIsMobileOpen(false)} {...props} />
      <Box>
        <Button onClick={() => setIsMobileOpen(true)}>Open Mobile Nav</Button>
      </Box>
    </Box>
  );
};

Mobile.parameters = {
  viewport: {
    defaultViewport: 'iPhone6',
  },
};

Mobile.play = async () => {
  const {
    queryByText,
    getByText,
    getAllByText,
    queryByRole,
    getByLabelText,
    getAllByLabelText,
  } = within(document.body);

  await expect(queryByRole('heading', { name: 'Main Menu' })).not.toBeInTheDocument();

  // L1 Open
  await userEvent.click(getByText('Open Mobile Nav'));
  await waitFor(() => expect(getByText('Main Menu')).toBeVisible());
  await expect(getByText('Home')).toBeVisible();
  await expect(getByText('L2 Trigger')).toBeVisible();
  await expect(queryByText('L2 Item')).not.toBeInTheDocument();

  // L2 Open
  await userEvent.click(getByText('L2 Trigger'));
  await waitFor(() => expect(getByText('L2 Item')).toBeVisible());

  // L3 Open
  await userEvent.click(getByText('L3 Trigger'));
  await waitFor(() => expect(getByText('L3 Item')).toBeVisible());

  // back button click
  await userEvent.click(getByLabelText('Back'));
  await waitFor(() => expect(queryByText('L2 Item')).not.toBeInTheDocument());

  // +2 more test
  await userEvent.click(getByText('+2 More'));
  await expect(getByText('Pages')).toBeVisible();
  await userEvent.click(getByText('Show Less'));
  await waitFor(() => expect(getByText('Pages')).not.toBeVisible());
  await expect(getByText('Test Mode')).toBeVisible();

  // Open L2 and close all menus
  await userEvent.click(getAllByText('L2 Trigger')[0]);
  await waitFor(() => expect(getByText('L2 Item')).toBeVisible());
  await userEvent.click(getAllByLabelText('Close')[1]);
  await expect(queryByRole('heading', { name: 'Main Menu' })).not.toBeInTheDocument();
};

export default {
  title: 'Components/Interaction Tests/SideNav/Mobile',
  component: SideNavExample,
  parameters: {
    controls: {
      disable: true,
    },
    a11y: { disable: true },
    essentials: { disable: true },
    actions: { disable: true },
  },
};
