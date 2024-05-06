import type { ReactElement } from 'react';
import { useCallback } from 'react';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import Svg from '~components/Icons/_Svg';
import Circle from '~components/Icons/_Svg/Circle';
import { Text } from '~components/Typography';
import { size as sizeToken } from '~tokens/global';
import { getStringFromReactText } from '~src/utils/getStringChildren';
import type { StringChildrenType, TestID } from '~utils/types';
import type { FeedbackColors } from '~tokens/theme/theme';
import { isReactNative } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { makeAccessible } from '~utils/makeAccessible';

type IndicatorCommonProps = {
  /**
   * Sets the color tone
   *
   * @default neutral
   */
  color?: FeedbackColors | 'primary';

  /**
   * Size of the indicator
   *
   * @default medium
   */
  size?: 'small' | 'medium' | 'large';
} & TestID &
  StyledPropsBlade;

type IndicatorWithoutA11yLabel = {
  /**
   * A text label to show alongside the indicator dot
   */
  children: StringChildrenType;

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
  children?: StringChildrenType;
};

type IndicatorProps = IndicatorCommonProps & (IndicatorWithA11yLabel | IndicatorWithoutA11yLabel);

type Dimensions = {
  svgSize: number;
  textSize: 'small' | 'medium';
};

const Indicator = ({
  accessibilityLabel,
  children,
  size = 'medium',
  color = 'neutral',
  testID,
  ...styledProps
}: IndicatorProps): ReactElement => {
  const { theme } = useTheme();
  const childrenString = getStringFromReactText(children);

  const fillColor =
    color === 'primary'
      ? theme.colors.surface.background.primary.intense
      : theme.colors.feedback.background[color].intense;
  const getDimension = useCallback((): Dimensions => {
    switch (size) {
      case 'small':
        return { svgSize: sizeToken[6], textSize: 'small' };
      case 'large':
        return { svgSize: sizeToken[10], textSize: 'medium' };
      default:
        return { svgSize: sizeToken[8], textSize: 'medium' };
    }
  }, [size]);
  const dimensions = getDimension();

  const isWeb = !isReactNative();
  const a11yProps = makeAccessible({
    label: accessibilityLabel ?? childrenString,
    ...(isWeb && { role: 'status' }),
  });

  return (
    <BaseBox
      display={(isWeb ? 'inline-flex' : 'flex') as never}
      {...a11yProps}
      {...metaAttribute({ name: MetaConstants.Indicator, testID })}
      {...getStyledProps(styledProps)}
    >
      <BaseBox display="flex" flexDirection="row" alignItems="center">
        <Svg
          width={String(dimensions.svgSize)}
          height={String(dimensions.svgSize)}
          viewBox="0 0 10 10"
          fill="none"
        >
          <Circle cx="5" cy="5" r="5" fill={fillColor} />
        </Svg>
        <BaseBox marginLeft="spacing.2">
          <Text
            weight="medium"
            color="surface.text.gray.subtle"
            textAlign="left"
            size={dimensions.textSize}
          >
            {children}
          </Text>
        </BaseBox>
      </BaseBox>
    </BaseBox>
  );
};

export type { IndicatorProps };
export { Indicator };
