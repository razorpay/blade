import type { ReactElement } from 'react';
import { useCallback } from 'react';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import Svg from '~components/Icons/_Svg';
import Circle from '~components/Icons/_Svg/Circle';
import { Text } from '~components/Typography';

import type { Feedback } from '~tokens/theme/theme';
import { metaAttribute, getPlatformType, makeAccessible, MetaConstants } from '~utils';
import { getStyledProps } from '~components/Box/styled-props';
import type { StyledProps } from '~components/Box/styled-props';

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
} & StyledProps;

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
  ...styledProps
}: IndicatorProps): ReactElement => {
  const { theme } = useTheme();

  const fillColor = theme.colors.feedback.background[intent].highContrast;
  const strokeColor = theme.colors.brand.gray.a100.highContrast;
  const getDimension = useCallback((): Dimensions => {
    switch (size) {
      case 'small':
        return { svgSize: '6', textSize: 'small' };
      case 'large':
        return { svgSize: '10', textSize: 'medium' };
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

  return (
    <BaseBox
      {...getStyledProps(styledProps)}
      display="flex"
      flexDirection="row"
      alignItems="center"
      {...a11yProps}
      {...metaAttribute(MetaConstants.Component, MetaConstants.Indicator)}
    >
      <Svg width={dimensions.svgSize} height={dimensions.svgSize} viewBox="0 0 10 10" fill="none">
        <Circle cx="5" cy="5" r="5" fill={fillColor} />
        <Circle cx="5" cy="5" r="4.75" stroke={strokeColor} strokeWidth="0.5" />
      </Svg>
      <BaseBox marginLeft="spacing.2">
        <Text contrast="low" type="subtle" size={dimensions.textSize}>
          {children}
        </Text>
      </BaseBox>
    </BaseBox>
  );
};

export { IndicatorProps, Indicator };
