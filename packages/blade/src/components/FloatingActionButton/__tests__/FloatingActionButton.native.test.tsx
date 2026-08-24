import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { FloatingActionButton } from '../FloatingActionButton';
import { PlusIcon } from '~components/Icons';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

const SAFE_AREA_BOTTOM_INSET = 34;

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: SAFE_AREA_BOTTOM_INSET, left: 0 }),
}));

describe('<FloatingActionButton /> (native)', () => {
  it('should render with a label', () => {
    const { toJSON } = renderWithTheme(
      <FloatingActionButton icon={PlusIcon}>Create payment</FloatingActionButton>,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render as an icon-only button when children is omitted', () => {
    const { toJSON } = renderWithTheme(
      <FloatingActionButton icon={PlusIcon} accessibilityLabel="Create payment" />,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it.each(['primary', 'white', 'black'] as const)('should render %s color', (color) => {
    const { toJSON } = renderWithTheme(
      <FloatingActionButton icon={PlusIcon} color={color}>
        Create payment
      </FloatingActionButton>,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should lift itself above the bottom safe area inset', () => {
    const { getByTestId } = renderWithTheme(
      <FloatingActionButton icon={PlusIcon} testID="fab">
        Create payment
      </FloatingActionButton>,
    );

    expect(getByTestId('fab')).toHaveStyle({
      position: 'absolute',
      bottom: SAFE_AREA_BOTTOM_INSET,
    });
  });

  it('should align to the end of the row by default', () => {
    const { getByTestId } = renderWithTheme(
      <FloatingActionButton icon={PlusIcon} testID="fab">
        Create payment
      </FloatingActionButton>,
    );

    expect(getByTestId('fab')).toHaveStyle({ justifyContent: 'flex-end' });
  });

  it.each([
    ['bottom-start', 'flex-start'],
    ['bottom', 'center'],
    ['bottom-end', 'flex-end'],
  ] as const)('should align %s to %s', (placement, justifyContent) => {
    const { getByTestId } = renderWithTheme(
      <FloatingActionButton icon={PlusIcon} placement={placement} testID="fab">
        Create payment
      </FloatingActionButton>,
    );

    expect(getByTestId('fab')).toHaveStyle({ justifyContent });
  });

  it('should not swallow touches meant for the content behind it', () => {
    const { getByTestId } = renderWithTheme(
      <FloatingActionButton icon={PlusIcon} testID="fab">
        Create payment
      </FloatingActionButton>,
    );

    expect(getByTestId('fab')).toHaveStyle({ pointerEvents: 'box-none' });
  });

  it('should call onClick when pressed', () => {
    const onClick = jest.fn();
    const { getByRole } = renderWithTheme(
      <FloatingActionButton icon={PlusIcon} onClick={onClick}>
        Create payment
      </FloatingActionButton>,
    );

    fireEvent.press(getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when disabled', () => {
    const onClick = jest.fn();
    const { getByRole } = renderWithTheme(
      <FloatingActionButton icon={PlusIcon} isDisabled onClick={onClick}>
        Create payment
      </FloatingActionButton>,
    );

    fireEvent.press(getByRole('button'));

    expect(onClick).not.toHaveBeenCalled();
  });

  it('should expose the accessibilityLabel of an icon-only button', () => {
    const { getByLabelText } = renderWithTheme(
      <FloatingActionButton icon={PlusIcon} accessibilityLabel="Create payment" />,
    );

    expect(getByLabelText('Create payment')).toBeTruthy();
  });
});
