import { StyleSheet, View } from 'react-native';
import type { ViewStyle } from 'react-native';
import type { ReactTestInstance } from 'react-test-renderer';
import { CounterInput } from '../CounterInput';
import { COUNTER_INPUT_TOKEN } from '../token';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

const getViewStyles = (root: ReactTestInstance): ViewStyle[] =>
  root.findAllByType(View).map(({ props }) => StyleSheet.flatten<ViewStyle>(props.style) ?? {});

const sizeCases = [
  ['xsmall', 22.4, 29.6],
  ['medium', 24.8, 33.2],
  ['large', 27.2, 36.8],
] as const;

describe('<CounterInput />', () => {
  it.each(sizeCases)(
    'should size the native field from value digits for %s',
    (size, twoDigitWidth, threeDigitWidth) => {
      const twoDigitResult = renderWithTheme(<CounterInput value={5} size={size} />);
      const twoDigitFieldStyle = getViewStyles(twoDigitResult.root).find(
        ({ flex, minWidth }) => flex === 1 && typeof minWidth === 'number',
      );

      expect(twoDigitFieldStyle?.minWidth).toBeCloseTo(twoDigitWidth);
      twoDigitResult.unmount();

      const threeDigitResult = renderWithTheme(<CounterInput value={100} size={size} />);
      const threeDigitViewStyles = getViewStyles(threeDigitResult.root);
      const threeDigitFieldStyle = threeDigitViewStyles.find(
        ({ flex, minWidth }) => flex === 1 && typeof minWidth === 'number',
      );
      const containerStyle = threeDigitViewStyles.find(
        ({ height }) => height === COUNTER_INPUT_TOKEN.height[size],
      );

      expect(threeDigitFieldStyle?.minWidth).toBeCloseTo(threeDigitWidth);
      expect(containerStyle).toMatchObject({
        minWidth: COUNTER_INPUT_TOKEN.width[size],
        height: COUNTER_INPUT_TOKEN.height[size],
        alignSelf: 'flex-start',
      });
      expect(threeDigitResult.getByRole('spinbutton')).toHaveStyle({
        fontVariant: ['tabular-nums'],
      });
    },
  );
});
