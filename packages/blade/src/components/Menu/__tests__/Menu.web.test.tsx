/* eslint-disable @typescript-eslint/no-empty-function */
import userEvents from '@testing-library/user-event';
import { act, waitFor } from '@testing-library/react';
import React from 'react';
import type { MenuProps } from '../';
import { Menu, MenuOverlay, MenuItem, MenuHeader, MenuFooter } from '../';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Button } from '~components/Button';
import assertAccessible from '~utils/testing/assertAccessible.web';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { UserIcon } from '~components/Icons';

const BasicMenu = (props: Partial<MenuProps>): React.ReactElement => {
  return (
    <Menu {...props}>
      <Button>Open Menu</Button>
      <MenuOverlay zIndex={1234}>
        <MenuHeader title="Header Title" subtitle="Subtitle" />
        <Box>
          <Text>Custom Slot</Text>
        </Box>
        <MenuItem href="/accounts" title="Account" description="Accounts" />
        <MenuItem title="Profile" leading={<UserIcon size="small" />} />
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
          <Text>Footer slot</Text>
        </MenuFooter>
      </MenuOverlay>
    </Menu>
  );
};

describe('Menu', () => {
  it('renders a Menu', async () => {
    const user = userEvents.setup();
    const { getByRole } = renderWithTheme(<BasicMenu />);
    await user.click(getByRole('button', { name: 'Open Menu' }));
    await waitFor(() => expect(getByRole('menu')).toBeVisible());
    expect(document.body).toMatchSnapshot();
  });

  it('should open and close menu', async () => {
    const user = userEvents.setup();

    const onOpenChange = jest.fn();

    const { getByRole, queryByRole } = renderWithTheme(<BasicMenu onOpenChange={onOpenChange} />);
    expect(queryByRole('menu')).not.toBeInTheDocument();
    await user.click(getByRole('button', { name: 'Open Menu' }));
    await waitFor(() => expect(getByRole('menu')).toBeVisible());
    await user.keyboard('{ESCAPE}');
    await waitFor(() => expect(queryByRole('menu')).not.toBeInTheDocument());
    expect(onOpenChange).toHaveBeenCalledTimes(2);
  });

  it('should open and close menu in controlled example', async () => {
    const user = userEvents.setup();

    const ControlledMenu = (): React.ReactElement => {
      const [isOpen, setIsOpen] = React.useState(false);
      return (
        <>
          <Button onClick={() => setIsOpen(true)}>Controlled Open</Button>
          <BasicMenu isOpen={isOpen} onOpenChange={({ isOpen }) => setIsOpen(isOpen)} />
        </>
      );
    };

    const { getByRole, queryByRole } = renderWithTheme(<ControlledMenu />);
    expect(queryByRole('menu')).not.toBeInTheDocument();
    await user.click(getByRole('button', { name: 'Controlled Open' }));
    await waitFor(() => expect(getByRole('menu')).toBeVisible());
    await user.keyboard('{ESCAPE}');
    await waitFor(() => expect(queryByRole('menu')).not.toBeInTheDocument());
  });

  it('should pass a11y for menu and menuitem role', async () => {
    const user = userEvents.setup();
    const { getByRole } = renderWithTheme(<BasicMenu />);
    await act(() => user.click(getByRole('button', { name: 'Open Menu' })));
    await waitFor(() => expect(getByRole('menu')).toBeVisible());
    const menu = getByRole('menu');
    await assertAccessible(menu);

    // should render correct tags for anchor and button in menu items
    expect(getByRole('menuitem', { name: 'Account Accounts' }).tagName).toBe('A');
    expect(getByRole('menuitem', { name: 'Profile' }).tagName).toBe('BUTTON');
  });
  it('should support data-analytics attribute', async () => {
    const user = userEvents.setup();
    const { getByRole } = renderWithTheme(
      <Menu>
        <Button>Open Menu</Button>
        <MenuOverlay zIndex={1234} data-analytics-menu="user">
          <MenuHeader
            title="Header Title"
            subtitle="Subtitle"
            data-analytics-menu-header="header title"
          />
          <Box>
            <Text>Custom Slot</Text>
          </Box>
          <MenuItem
            href="/accounts"
            title="Account"
            description="Accounts"
            data-analytics-menu-item="account"
          />
          <MenuItem title="Profile" leading={<UserIcon size="small" />} />
          <MenuItem
            title="Settings"
            trailing={<Text color="surface.text.gray.muted">Cmd + S</Text>}
          />
          <MenuItem title="Log Out" color="negative" />
          <MenuFooter data-analytics-menu-footer>
            <Text>Footer slot</Text>
          </MenuFooter>
        </MenuOverlay>
      </Menu>,
    );
    await act(() => user.click(getByRole('button', { name: 'Open Menu' })));
    await waitFor(() => expect(getByRole('menu')).toBeVisible());
    expect(document.body).toMatchSnapshot();
  });
});
