/* eslint-disable @typescript-eslint/no-empty-function */
import userEvents from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import React from 'react';
import type { DrawerProps } from '../';
import { Drawer, DrawerBody, DrawerHeader } from '../';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Badge } from '~components/Badge';
import { Button } from '~components/Button';
import { Text } from '~components/Typography';
import { AnnouncementIcon, DownloadIcon } from '~components/Icons';

const BasicDrawer = (props: Partial<DrawerProps>): React.ReactElement => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Drawer
        {...props}
        isOpen={isOpen}
        onDismiss={() => {
          setIsOpen(false);
          props.onDismiss?.();
        }}
        accessibilityLabel="Test Drawer"
      >
        <DrawerHeader title="Drawer" />
        <DrawerBody>
          <Text>Test Content</Text>
        </DrawerBody>
      </Drawer>
      <Button onClick={() => setIsOpen(true)}>Toggle Drawer</Button>
    </>
  );
};

describe('Drawer', () => {
  it('renders a Drawer', () => {
    const { getByRole } = renderWithTheme(
      <Drawer isOpen={true} onDismiss={() => {}} accessibilityLabel="Test Drawer">
        <DrawerHeader
          leading={<AnnouncementIcon size="large" />}
          title="Address Details"
          subtitle="Saving addresses will improve your checkout experience"
          trailing={<Button icon={DownloadIcon} />}
          titleSuffix={<Badge color="positive">NEW</Badge>}
        />
        <DrawerBody>
          <Text>Test Content</Text>
        </DrawerBody>
      </Drawer>,
    );
    expect(getByRole('dialog')).toMatchSnapshot();
  });

  it('should open and close drawer', async () => {
    const user = userEvents.setup();

    const onDismiss = jest.fn();

    const { getByRole, queryByRole } = renderWithTheme(<BasicDrawer onDismiss={onDismiss} />);
    await user.click(getByRole('button', { name: 'Toggle Drawer' }));
    await waitFor(() => expect(getByRole('dialog')).toBeVisible());
    await user.click(getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('should dismiss on overlay click', async () => {
    const user = userEvents.setup();
    const onDismiss = jest.fn();

    const { getByRole, getByTestId } = renderWithTheme(
      <BasicDrawer showOverlay={true} onDismiss={onDismiss} />,
    );
    await user.click(getByRole('button'));
    await user.click(getByTestId('drawer-overlay'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('should throw error when invalid children are passed', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    const Example = (): React.ReactElement => {
      return (
        <Drawer isOpen={true} onDismiss={() => {}}>
          <Text>I am not supposed to be here</Text>
        </Drawer>
      );
    };
    expect(() => renderWithTheme(<Example />)).toThrow(
      '[Blade: Drawer]: Only `DrawerHeader, DrawerBody` components are accepted in `Drawer` children',
    );
    mockConsoleError.mockRestore();
  });

  it('renders a Drawer with custom zIndex', async () => {
    const { getByTestId } = renderWithTheme(
      <Drawer
        isOpen={true}
        onDismiss={() => {}}
        accessibilityLabel="Test Drawer"
        testID="drawer"
        zIndex={9999}
      >
        <DrawerBody>
          <Text>Test Content</Text>
        </DrawerBody>
      </Drawer>,
    );
    await waitFor(() =>
      expect(getByTestId('drawer')).toHaveStyle({
        position: 'fixed',
        zIndex: 9999,
      }),
    );
  });

  it('Should support adding data-analytics attribute', () => {
    const { getByTestId } = renderWithTheme(
      <Drawer
        isOpen={true}
        onDismiss={() => {}}
        accessibilityLabel="Test Drawer"
        testID="drawer"
        data-analytics-drawer="drawer-analytics"
      >
        <DrawerBody>
          <Text>Test Content</Text>
        </DrawerBody>
      </Drawer>,
    );
    expect(getByTestId('drawer')).toHaveAttribute('data-analytics-drawer', 'drawer-analytics');
  });
});
