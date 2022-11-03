import type { ReactElement } from 'react';
import { useCallback } from 'react';
import { useTheme } from '~components/BladeProvider';
import Box from '~components/Box';
import Svg from '~components/Icons/_Svg';
import Circle from '~components/Icons/_Svg/Circle';
import { Text } from '~components/Typography';

import type { Feedback } from '~tokens/theme/theme';
import { getPlatformType, makeAccessible } from '~utils';

type IndicatorCommonProps = {
  /**
   * Sets the color tone
   *
   * @default neutral
   */
  intent?: Feedback;

  /**
   * Size of the indicator
   *
   * @default medium
   */
  size?: 'xsmall' | 'small' | 'medium';
};

type IndicatorWithoutA11yLabel = {
  /**
   * A text label to show alongside the indicator dot
   */
  children: string;

  /**
   * a11y label for screen readers
   */
  accessibilityLabel?: string;
};

type IndicatorWithA11yLabel = {
  /**
   * a11y label for screen readers
   */
  accessibilityLabel: string;

  /**
   * A text label to show alongside the indicator dot
   */
  children?: string;
};

type IndicatorProps = IndicatorCommonProps & (IndicatorWithA11yLabel | IndicatorWithoutA11yLabel);

type Dimensions = {
  svgSize: string;
  textSize: 'small' | 'medium';
};

const Indicator = ({
  accessibilityLabel,
  children,
  size = 'medium',
  intent = 'neutral',
}: IndicatorProps): ReactElement => {
  const { theme } = useTheme();

  const fillColor = theme.colors.feedback.background[intent].highContrast;
  const strokeColor = theme.colors.brand.gray[200];
  const getDimension = useCallback((): Dimensions => {
    switch (size) {
      case 'small':
        return { svgSize: '8', textSize: 'small' };
      case 'xsmall':
        return { svgSize: '6', textSize: 'small' };
      default:
        return { svgSize: '10', textSize: 'medium' };
    }
  }, [size]);
  const dimensions = getDimension();

  const isReactNative = getPlatformType() === 'react-native';
  const isWeb = !isReactNative;
  const a11yProps = makeAccessible({
    label: accessibilityLabel,
    ...(isWeb && { role: 'status' }),
  });

  return (
    <Box display="flex" flexDirection="row" alignItems="center" {...a11yProps}>
      <Svg width={dimensions.svgSize} height={dimensions.svgSize} viewBox="0 0 12 12" fill="none">
        <Circle cx="6" cy="6" r="5.5" fill={fillColor} stroke={strokeColor} />
      </Svg>
      <Box marginLeft="spacing.2">
        <Text contrast="low" size={dimensions.textSize}>
          {children}
        </Text>
      </Box>
    </Box>
  );
};

export { IndicatorProps, Indicator };
