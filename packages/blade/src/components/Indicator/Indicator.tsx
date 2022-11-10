import type { ReactElement } from 'react';
import { useCallback } from 'react';
import { useTheme } from '~components/BladeProvider';
import Box from '~components/Box';
import Svg from '~components/Icons/_Svg';
import Circle from '~components/Icons/_Svg/Circle';
import { Heading, Text } from '~components/Typography';

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
  size?: 'small' | 'medium' | 'large';
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
  const strokeColor = theme.colors.brand.gray.a100.highContrast;
  const getDimension = useCallback((): Dimensions => {
    switch (size) {
      case 'small':
        return { svgSize: '6', textSize: 'small' };
      case 'large':
        return { svgSize: '10', textSize: 'small' };
      default:
        return { svgSize: '8', textSize: 'medium' };
    }
  }, [size]);
  const dimensions = getDimension();

  const isReactNative = getPlatformType() === 'react-native';
  const isWeb = !isReactNative;
  const a11yProps = makeAccessible({
    label: accessibilityLabel ?? children,
    ...(isWeb && { role: 'status' }),
  });

  const textLabel =
    size === 'large' && children ? (
      <Heading contrast="low" type="subtle" weight="regular" size={dimensions.textSize}>
        {children}
      </Heading>
    ) : (
      <Text contrast="low" type="subtle" size={dimensions.textSize}>
        {children}
      </Text>
    );

  return (
    <Box display="flex" flexDirection="row" alignItems="center" {...a11yProps}>
      <Svg width={dimensions.svgSize} height={dimensions.svgSize} viewBox="0 0 10 10" fill="none">
        <Circle cx="5" cy="5" r="5" fill={fillColor} />
        <Circle cx="5" cy="5" r="4.75" stroke={strokeColor} strokeWidth="0.5" />
      </Svg>
      <Box marginLeft="spacing.2">{textLabel}</Box>
    </Box>
  );
};

export { IndicatorProps, Indicator };
