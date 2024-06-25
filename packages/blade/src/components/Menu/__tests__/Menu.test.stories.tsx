/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import type { StoryFn } from '@storybook/react';
import { within, userEvent, waitFor } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { Menu, MenuOverlay, MenuItem, MenuHeader, MenuFooter } from '../';
import type { MenuProps } from '../';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { UserIcon } from '~components/Icons';
import { Text } from '~components/Typography';
import { Link } from '~components/Link';
import { Tooltip, TooltipInteractiveWrapper } from '~components/Tooltip';

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const BasicMenu = ({
  trigger = <Button>Open Menu</Button>,
  ...props
}: Partial<MenuProps> & { trigger?: React.ReactElement }): React.ReactElement => {
  return (
    <Menu {...props}>
      {trigger}
      <MenuOverlay zIndex={1234}>
        <MenuHeader title="Header Title" subtitle="Subtitle" />
        <Box>
          <Text>Custom Slot</Text>
        </Box>
        <MenuItem title="Account" description="Accounts" />
        <MenuItem title="Profile" href="/profile" leading={<UserIcon size="small" />} />
        <MenuItem
          title="Settings"
          trailing={<Text color="surface.text.gray.muted">Cmd + S</Text>}
        />
        <Menu>
          <MenuItem title="Share" />
          <MenuOverlay>
            <MenuItem title="Instagram" />
            <MenuItem title="Whatsapp" />
          </MenuOverlay>
        </Menu>
        <MenuItem title="Log Out" color="negative" />
        <MenuFooter>
          <Button>Apply</Button>
        </MenuFooter>
      </MenuOverlay>
    </Menu>
  );
};

export const MenuOpen: StoryFn<typeof Menu> = (props): React.ReactElement => {
  return <BasicMenu {...props} />;
};

MenuOpen.play = async () => {
  const { getByRole, queryByRole } = within(document.body);

  // Simple menu open / close
  const menuTrigger = getByRole('button', { name: 'Open Menu' });
  await userEvent.click(menuTrigger);
  await waitFor(() => expect(getByRole('menu')).toBeVisible());

  await userEvent.keyboard('{ESCAPE}');
  await waitFor(() => expect(queryByRole('menu')).not.toBeInTheDocument());

  // Submenu open / close
  await userEvent.click(menuTrigger);
  await waitFor(() => expect(getByRole('menu')).toBeVisible());

  await userEvent.hover(getByRole('menuitem', { name: 'Share' }));
  await waitFor(() => expect(getByRole('menuitem', { name: 'Instagram' })).toBeVisible());
};

export const MenuSelect: StoryFn<typeof Menu> = (props): React.ReactElement => {
  const [selectedItem, setSelectedItem] = React.useState('');
  return (
    <Menu {...props}>
      <Link variant="button">Menu: {selectedItem}</Link>
      <MenuOverlay>
        <MenuItem title="Account" onClick={() => setSelectedItem('Account')} />
        <MenuItem title="Profile" onClick={() => setSelectedItem('Profile')} />
      </MenuOverlay>
    </Menu>
  );
};

MenuSelect.play = async () => {
  const { getByRole } = within(document.body);

  // Simple menu open / close
  await userEvent.click(getByRole('button', { name: 'Menu:' }));
  await waitFor(() => expect(getByRole('menu')).toBeVisible());

  await userEvent.click(getByRole('menuitem', { name: 'Profile' }));
  await expect(getByRole('button', { name: 'Menu: Profile' })).toBeInTheDocument();

  await userEvent.click(getByRole('menuitem', { name: 'Account' }));
  await expect(getByRole('button', { name: 'Menu: Account' })).toBeInTheDocument();
};

export const WithCustomTrigger: StoryFn<typeof Menu> = (props): React.ReactElement => {
  return <BasicMenu {...props} trigger={<button>Custom Button</button>} />;
};

WithCustomTrigger.play = async () => {
  const { getByRole, queryByRole } = within(document.body);

  // Simple menu open / close
  const menuTrigger = getByRole('button', { name: 'Custom Button' });
  await userEvent.click(menuTrigger);
  await waitFor(() => expect(getByRole('menu')).toBeVisible());

  await userEvent.keyboard('{ESCAPE}');
  await waitFor(() => expect(queryByRole('menu')).not.toBeInTheDocument());

  // Submenu open / close
  await userEvent.click(menuTrigger);
  await waitFor(() => expect(getByRole('menu')).toBeVisible());

  await userEvent.hover(getByRole('menuitem', { name: 'Share' }));
  await waitFor(() => expect(getByRole('menuitem', { name: 'Instagram' })).toBeVisible());
};

export const WithHoverOpen: StoryFn<typeof Menu> = (props): React.ReactElement => {
  return <BasicMenu {...props} openInteraction="hover" />;
};

WithHoverOpen.play = async () => {
  const { getByRole, queryByRole } = within(document.body);

  // Simple menu open / close
  const menuTrigger = getByRole('button', { name: 'Open Menu' });
  await userEvent.hover(menuTrigger);
  await waitFor(() => expect(getByRole('menu')).toBeVisible());

  await sleep(500);
  await userEvent.unhover(menuTrigger);
  await waitFor(() => expect(queryByRole('menu')).not.toBeInTheDocument());
};

export const ListNavigation: StoryFn<typeof Menu> = (props): React.ReactElement => {
  return <BasicMenu {...props} />;
};

ListNavigation.play = async () => {
  const { getByRole, queryByRole } = within(document.body);

  // Simple menu open / close
  const menuTrigger = getByRole('button', { name: 'Open Menu' });
  menuTrigger.focus();
  await userEvent.keyboard('{ENTER}');
  await waitFor(() => expect(getByRole('menu')).toBeVisible());

  await userEvent.keyboard('{TAB}');
  await expect(getByRole('menuitem', { name: 'Account Accounts' })).toHaveFocus();
  await userEvent.keyboard('{ArrowDown}');
  await sleep(100);
  await expect(getByRole('menuitem', { name: 'Profile' })).toHaveFocus();
  await userEvent.keyboard('{ArrowDown}');
  await userEvent.keyboard('{ArrowDown}');
  await sleep(100);
  await expect(getByRole('menuitem', { name: 'Share' })).toHaveFocus();
  await userEvent.keyboard('{ArrowRight}');
  await waitFor(() => expect(getByRole('menuitem', { name: 'Instagram' })).toBeVisible());
  await sleep(100);
  await expect(getByRole('menuitem', { name: 'Instagram' })).toHaveFocus();
  await userEvent.keyboard('{ArrowDown}');
  await sleep(100);
  await expect(getByRole('menuitem', { name: 'Whatsapp' })).toHaveFocus();
  await userEvent.keyboard('{ArrowUp}');
  await userEvent.keyboard('{ArrowLeft}');
  await sleep(100);
  await expect(getByRole('menuitem', { name: 'Share' })).toHaveFocus();
  await userEvent.keyboard('{TAB}');
  await userEvent.keyboard('{TAB}');
  await sleep(100);
  await expect(getByRole('button', { name: 'Apply' })).toHaveFocus();

  await userEvent.keyboard('{ESCAPE}');
  await sleep(100);
  await waitFor(() => expect(queryByRole('menu')).not.toBeInTheDocument());
  await waitFor(() => expect(getByRole('button', { name: 'Open Menu' })).toHaveFocus());
};

export const WithTooltip: StoryFn<typeof Menu> = (props): React.ReactElement => {
  return (
    <Box paddingTop="spacing.10">
      <Tooltip content="Hi from tooltip" placement="top">
        <TooltipInteractiveWrapper>
          <BasicMenu {...props} />
        </TooltipInteractiveWrapper>
      </Tooltip>
    </Box>
  );
};

WithTooltip.play = async () => {
  const { getByRole, queryByRole, queryByText } = within(document.body);

  // Simple menu open / close
  const menuTrigger = getByRole('button', { name: 'Open Menu' });
  await userEvent.hover(menuTrigger);
  await sleep(600);
  await expect(queryByText('Hi from tooltip')).toBeVisible();
  await userEvent.click(menuTrigger);
  await waitFor(() => expect(getByRole('menu')).toBeVisible());

  await userEvent.keyboard('{ESCAPE}');
  await waitFor(() => expect(queryByRole('menu')).not.toBeInTheDocument());

  // Submenu open / close
  await userEvent.click(menuTrigger);
  await waitFor(() => expect(getByRole('menu')).toBeVisible());

  await userEvent.hover(getByRole('menuitem', { name: 'Share' }));
  await waitFor(() => expect(getByRole('menuitem', { name: 'Instagram' })).toBeVisible());
};

export default {
  title: 'Components/Interaction Tests/Menu',
  component: Menu,
  parameters: {
    controls: {
      disable: true,
    },
    a11y: { disable: true },
    essentials: { disable: true },
    actions: { disable: true },
  },
};
