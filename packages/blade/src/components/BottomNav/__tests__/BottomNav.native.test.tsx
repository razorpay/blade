import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { BottomNav, BottomNavItem } from '../BottomNav.native';
import { PaymentGatewayIcon, TransactionsIcon, PaymentLinkIcon } from '~components/Icons';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 34, left: 0 }),
}));

const renderBottomNav = ({
  activeItem = 'payments',
  onPress = jest.fn(),
}: { activeItem?: string; onPress?: jest.Mock } = {}): ReturnType<typeof renderWithTheme> => {
  return renderWithTheme(
    <BottomNav>
      <BottomNavItem
        title="Payments"
        icon={PaymentGatewayIcon}
        isActive={activeItem === 'payments'}
        onClick={onPress}
        testID="bottomnav-item-payments"
      />
      <BottomNavItem
        title="Transactions"
        icon={TransactionsIcon}
        isActive={activeItem === 'transactions'}
        onClick={onPress}
        testID="bottomnav-item-transactions"
      />
      <BottomNavItem
        title="Links"
        icon={PaymentLinkIcon}
        isActive={activeItem === 'links'}
        onClick={onPress}
        testID="bottomnav-item-links"
      />
    </BottomNav>,
  );
};

describe('<BottomNav /> (native)', () => {
  it('should render', () => {
    const { toJSON } = renderBottomNav();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with active item', () => {
    const { toJSON } = renderBottomNav({ activeItem: 'transactions' });
    expect(toJSON()).toMatchSnapshot();
  });

  it('should call onClick when an item is pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = renderBottomNav({ onPress });

    fireEvent.press(getByTestId('bottomnav-item-payments'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should set accessibilityCurrent on active item', () => {
    const { getByTestId } = renderBottomNav({ activeItem: 'transactions' });

    expect(getByTestId('bottomnav-item-transactions').props.accessibilityCurrent).toBe('page');
  });

  it('should set accessibilityRole to tab on all items', () => {
    const { getByTestId } = renderBottomNav();

    expect(getByTestId('bottomnav-item-payments').props.accessibilityRole).toBe('tab');
  });
});
