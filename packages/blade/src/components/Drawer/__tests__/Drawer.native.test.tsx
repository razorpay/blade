/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import type { DrawerProps } from '../';
import { Drawer, DrawerBody, DrawerHeader, DrawerFooter } from '../';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { Badge } from '~components/Badge';
import { Button } from '~components/Button';
import { Text } from '~components/Typography';
import { AnnouncementIcon, DownloadIcon } from '~components/Icons';

jest.mock('~utils/useId', () => ({
  useId: (prefix?: string) => (prefix ? `${prefix}-0` : '0'),
}));

jest.useFakeTimers();

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

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

describe('<Drawer /> (native)', () => {
  it('renders a Drawer', () => {
    const { toJSON } = renderWithTheme(
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
    expect(toJSON()).toMatchSnapshot();
  });

  it('should open the drawer on toggle', () => {
    const { getByText, queryByText } = renderWithTheme(<BasicDrawer />);

    // closed initially: the drawer subtree is not mounted
    expect(queryByText('Test Content')).toBeNull();

    // open
    fireEvent.press(getByText('Toggle Drawer'));
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('should mount the Portal subtree fresh on open and unmount while closed', () => {
    // Regression guard for the P0 fix: the Drawer now follows the proven
    // conditional-Portal-mount pattern (Popover/Tooltip) — the Portal element is
    // mounted only while the drawer is present, so the `@gorhom/portal` add-portal
    // effect fires on open and the subtree actually teleports and renders. While
    // closed nothing is mounted; on open the portal root (testID) and the body
    // content mount together.
    const { getByText, queryByText, queryByTestId } = renderWithTheme(
      <BasicDrawer testID="drawer-root" />,
    );

    // closed: the Portal subtree is not mounted at all
    expect(queryByTestId('drawer-root')).toBeNull();
    expect(queryByText('Test Content')).toBeNull();

    // toggle open -> the Portal mounts fresh and the content renders
    fireEvent.press(getByText('Toggle Drawer'));
    expect(queryByTestId('drawer-root')).toBeTruthy();
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('should mount content while closed when isLazy is false', () => {
    const { getByText } = renderWithTheme(<BasicDrawer isLazy={false} />);

    expect(getByText('Test Content')).toBeTruthy();
  });

  it('should close drawer via the header close button', () => {
    const onDismiss = jest.fn();
    const { getByRole } = renderWithTheme(
      <Drawer isOpen={true} onDismiss={onDismiss} accessibilityLabel="Closable Drawer">
        <DrawerHeader title="Drawer" />
        <DrawerBody>
          <Text>Test Content</Text>
        </DrawerBody>
      </Drawer>,
    );

    // close via Close button in the header -> closeAllDrawers -> onDismiss
    fireEvent.press(getByRole('button', { name: 'Close' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('should dismiss on overlay press', () => {
    const onDismiss = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <Drawer
        isOpen={true}
        onDismiss={onDismiss}
        showOverlay={true}
        accessibilityLabel="Overlay Drawer"
      >
        <DrawerHeader title="Drawer" />
        <DrawerBody>
          <Text>Test Content</Text>
        </DrawerBody>
      </Drawer>,
    );

    fireEvent.press(getByLabelText('Dismiss'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('should throw error when invalid children are passed', () => {
    const Example = (): React.ReactElement => {
      return (
        <Drawer isOpen={true} onDismiss={() => {}}>
          <Text>I am not supposed to be here</Text>
        </Drawer>
      );
    };
    expect(() => renderWithTheme(<Example />)).toThrow(
      '[Blade: Drawer]: Only `DrawerHeader, DrawerBody, DrawerFooter` components are accepted in `Drawer` children',
    );
  });

  it('should render a Drawer with a custom header', () => {
    const { getByText, toJSON } = renderWithTheme(
      <Drawer isOpen={true} onDismiss={() => {}} accessibilityLabel="Custom Header Drawer">
        <DrawerHeader>
          <Text>Custom Header</Text>
        </DrawerHeader>
        <DrawerBody>
          <Text>Custom Content</Text>
        </DrawerBody>
      </Drawer>,
    );
    expect(getByText('Custom Header')).toBeTruthy();
    expect(getByText('Custom Content')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders a Drawer with footer', () => {
    const { getByText, toJSON } = renderWithTheme(
      <Drawer isOpen={true} onDismiss={() => {}} accessibilityLabel="Footer Drawer">
        <DrawerHeader>
          <Text>Custom Header</Text>
        </DrawerHeader>
        <DrawerBody>
          <Text>Custom Content</Text>
        </DrawerBody>
        <DrawerFooter>
          <Button>Footer Button</Button>
        </DrawerFooter>
      </Drawer>,
    );
    expect(getByText('Footer Button')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });
});
