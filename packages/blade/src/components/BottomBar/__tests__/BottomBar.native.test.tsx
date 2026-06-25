import React from 'react';
import { Text } from 'react-native';
import { BottomBar } from '../BottomBar.native';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 34, left: 0 }),
}));

const renderBottomBar = (): ReturnType<typeof renderWithTheme> => {
  return renderWithTheme(
    <BottomBar testID="bottombar-test">
      <Text>Cancel</Text>
      <Text>Continue</Text>
    </BottomBar>,
  );
};

describe('<BottomBar /> (native)', () => {
  it('should render', () => {
    const { toJSON } = renderBottomBar();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should set accessibilityRole to group', () => {
    const { getByTestId } = renderBottomBar();

    expect(getByTestId('bottombar-test').props.accessibilityRole).toBe('summary');
  });

  it('should support accessibilityLabel', () => {
    const { getByTestId } = renderWithTheme(
      <BottomBar testID="bottombar-test" accessibilityLabel="Bottom action bar">
        <Text>Cancel</Text>
        <Text>Continue</Text>
      </BottomBar>,
    );
    expect(getByTestId('bottombar-test').props.accessibilityLabel).toBe('Bottom action bar');
  });
});
