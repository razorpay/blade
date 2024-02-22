/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import type { StoryFn } from '@storybook/react';
import { within, userEvent, waitFor } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { Drawer, DrawerBody, DrawerHeader } from '../';
import type { DrawerProps } from '../';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { Badge } from '~components/Badge';
import { DownloadIcon } from '~components/Icons';
import { Heading } from '~components/Typography';

const BasicDrawer = (args: DrawerProps): React.ReactElement => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  return (
    <Box>
      <Button onClick={() => setIsDrawerOpen(!isDrawerOpen)}>Toggle Drawer</Button>
      <Drawer {...args} isOpen={isDrawerOpen} onDismiss={() => setIsDrawerOpen(false)}>
        <DrawerHeader
          title="Vendor Payment Details"
          titleSuffix={<Badge color="positive">New</Badge>}
          subtitle="See your payment details here"
          trailing={<Button icon={DownloadIcon} />}
        />
        <DrawerBody>
          <Box display="flex" alignItems="center">
            <Heading>Drawer Heading</Heading>
          </Box>
        </DrawerBody>
      </Drawer>
    </Box>
  );
};

const StackedDrawer = (args: DrawerProps): React.ReactElement => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isSecondDrawerOpen, setIsSecondDrawerOpen] = React.useState(false);

  return (
    <Box>
      <Button onClick={() => setIsDrawerOpen(!isDrawerOpen)}>Toggle Drawer</Button>
      <Drawer {...args} isOpen={isDrawerOpen} onDismiss={() => setIsDrawerOpen(false)}>
        <DrawerHeader
          title="Vendor Payment Details"
          titleSuffix={<Badge color="positive">New</Badge>}
          subtitle="See your payment details here"
          trailing={<Button icon={DownloadIcon} />}
        />
        <DrawerBody>
          <Box display="flex" alignItems="center">
            <Heading>Drawer Heading</Heading>
            <Button
              onClick={() => {
                setIsSecondDrawerOpen(true);
              }}
            >
              Open 2nd Drawer
            </Button>
          </Box>
        </DrawerBody>
      </Drawer>

      <Drawer isOpen={isSecondDrawerOpen} onDismiss={() => setIsSecondDrawerOpen(false)}>
        <DrawerHeader title="Stacked Drawer" trailing={<Button icon={DownloadIcon} />} />
        <DrawerBody>
          <Box display="flex" alignItems="center">
            <Heading>Drawer 2 Heading</Heading>
          </Box>
        </DrawerBody>
      </Drawer>
    </Box>
  );
};

export const DrawerOpen: StoryFn<typeof Drawer> = (props): React.ReactElement => {
  return <BasicDrawer {...props} />;
};

DrawerOpen.play = async () => {
  const { getByRole, queryByRole, getByTestId, queryByTestId } = within(document.body);

  await expect(queryByRole('heading', { name: 'Drawer Heading' })).not.toBeInTheDocument();
  const drawerToggleButton = getByRole('button', { name: 'Toggle Drawer' });
  await userEvent.click(drawerToggleButton);
  await waitFor(() => expect(getByRole('heading', { name: 'Drawer Heading' })).toBeVisible());
  await expect(getByTestId('drawer-overlay')).toBeVisible();
  await userEvent.click(getByTestId('drawer-overlay'));
  await waitFor(() =>
    expect(queryByRole('heading', { name: 'Drawer Heading' })).not.toBeInTheDocument(),
  );
  await expect(queryByTestId('drawer-overlay')).not.toBeInTheDocument();
};

export const NoOverlay: StoryFn<typeof Drawer> = (props): React.ReactElement => {
  return <BasicDrawer {...props} showOverlay={false} />;
};

NoOverlay.play = async () => {
  const { getByRole, queryByRole, queryByTestId } = within(document.body);

  await expect(queryByRole('heading', { name: 'Drawer Heading' })).not.toBeInTheDocument();
  const drawerToggleButton = getByRole('button', { name: 'Toggle Drawer' });
  await userEvent.click(drawerToggleButton);
  await waitFor(() => expect(getByRole('heading', { name: 'Drawer Heading' })).toBeVisible());
  await expect(queryByTestId('drawer-overlay')).not.toBeInTheDocument();
  await userEvent.click(drawerToggleButton);
  await waitFor(() =>
    expect(queryByRole('heading', { name: 'Drawer Heading' })).not.toBeInTheDocument(),
  );
};

export const StackingDrawerOpen: StoryFn<typeof Drawer> = (props): React.ReactElement => {
  return <StackedDrawer {...props} />;
};

StackingDrawerOpen.play = async () => {
  const { getByRole, queryByRole, getAllByLabelText, getByText, queryByText } = within(
    document.body,
  );

  // first drawer open
  await expect(queryByRole('heading', { name: 'Drawer Heading' })).not.toBeInTheDocument();
  const drawerToggleButton = getByRole('button', { name: 'Toggle Drawer' });
  await userEvent.click(drawerToggleButton);
  await waitFor(() => expect(getByRole('heading', { name: 'Drawer Heading' })).toBeVisible());

  // 2nd drawer open
  await expect(queryByRole('heading', { name: 'Drawer 2 Heading' })).not.toBeInTheDocument();
  await userEvent.click(getByRole('button', { name: 'Open 2nd Drawer' }));
  await waitFor(() => expect(getByText('Drawer 2 Heading')).toBeVisible());

  const closeButtons = getAllByLabelText('Close');

  // 2nd drawer close
  await userEvent.click(closeButtons[1]);
  await waitFor(() => expect(queryByText('Drawer 2 Heading')).not.toBeInTheDocument());
  await expect(getByRole('heading', { name: 'Drawer Heading' })).toBeVisible();

  // 1st drawer close
  await userEvent.click(closeButtons[0]);
  await waitFor(() =>
    expect(queryByRole('heading', { name: 'Drawer Heading' })).not.toBeInTheDocument(),
  );
};

export const KeyboardNavigations: StoryFn<typeof Drawer> = (props): React.ReactElement => {
  return <StackedDrawer {...props} />;
};

KeyboardNavigations.play = async () => {
  const { getByRole, queryByRole, getByText, queryByText } = within(document.body);

  // first drawer open
  await expect(queryByRole('heading', { name: 'Drawer Heading' })).not.toBeInTheDocument();
  const drawerToggleButton = getByRole('button', { name: 'Toggle Drawer' });
  drawerToggleButton.focus();
  await userEvent.keyboard('{Enter}');
  await waitFor(() => expect(getByRole('heading', { name: 'Drawer Heading' })).toBeVisible());
  await expect(getByRole('button', { name: 'Close' })).toHaveFocus();

  // 2nd drawer open
  await expect(queryByRole('heading', { name: 'Drawer 2 Heading' })).not.toBeInTheDocument();
  await userEvent.keyboard('{Tab}');
  await userEvent.keyboard('{Enter}');
  await waitFor(() => expect(getByText('Drawer 2 Heading')).toBeVisible());

  // 2nd drawer close
  await userEvent.keyboard('{Enter}');
  await waitFor(() => expect(queryByText('Drawer 2 Heading')).not.toBeInTheDocument());
  await expect(getByRole('heading', { name: 'Drawer Heading' })).toBeVisible();

  // 1st drawer close
  await userEvent.keyboard('{Escape}');
  await waitFor(() =>
    expect(queryByRole('heading', { name: 'Drawer Heading' })).not.toBeInTheDocument(),
  );
  await waitFor(() => expect(drawerToggleButton).toHaveFocus());
};

export default {
  title: 'Components/Interaction Tests/Drawer',
  component: Drawer,
  parameters: {
    controls: {
      disable: true,
    },
    a11y: { disable: true },
    essentials: { disable: true },
    actions: { disable: true },
  },
};
