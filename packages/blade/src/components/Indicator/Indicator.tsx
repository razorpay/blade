import type { ReactElement } from 'react';
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
   * Sets the emphasis of the indicator
   *
   * If set to intense it will show a background circle
   *
   * @default subtle
   */
  emphasis?: 'subtle' | 'intense';

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

const textSizeMapping = {
  small: 'small',
  large: 'medium',
  medium: 'medium',
} as const;

const indicatorDotSizes = {
  subtle: {
    small: {
      outer: 0,
      inner: sizeToken[6],
    },
    medium: {
      outer: 0,
      inner: sizeToken[8],
    },
    large: {
      outer: 0,
      inner: sizeToken[10],
    },
  },
  intense: {
    small: {
      outer: sizeToken[16],
      inner: sizeToken[8],
    },
    medium: {
      outer: sizeToken[20],
      inner: sizeToken[10],
    },
    large: {
      outer: sizeToken[24],
      inner: sizeToken[12],
    },
  },
} as const;

const Indicator = ({
  accessibilityLabel,
  children,
  size = 'medium',
  color = 'neutral',
  emphasis = 'subtle',
  testID,
  ...styledProps
}: IndicatorProps): ReactElement => {
  const { theme } = useTheme();
  const childrenString = getStringFromReactText(children);
  const isIntense = emphasis === 'intense';
  const isPrimary = color === 'primary';

  const fillColorOuter = isPrimary
    ? theme.colors.surface.background.primary.subtle
    : theme.colors.feedback.background[color].subtle;
  const fillColorInner = isPrimary
    ? theme.colors.surface.icon.primary.normal
    : theme.colors.feedback.icon[color].intense;

  const isWeb = !isReactNative();
  const a11yProps = makeAccessible({
    label: accessibilityLabel ?? childrenString,
    ...(isWeb && { role: 'status' }),
  });

  const svgSize = isIntense
    ? indicatorDotSizes[emphasis][size].outer
    : indicatorDotSizes[emphasis][size].inner;

  return (
    <BaseBox
      display={(isWeb ? 'inline-flex' : 'flex') as never}
      {...a11yProps}
      {...metaAttribute({ name: MetaConstants.Indicator, testID })}
      {...getStyledProps(styledProps)}
    >
      <BaseBox display="flex" flexDirection="row" alignItems="center">
        <Svg width={String(svgSize)} height={String(svgSize)} viewBox="0 0 10 10" fill="none">
          {isIntense ? (
            <>
              <Circle cx="5" cy="5" r="5" fill={fillColorOuter} />
              <Circle cx="5" cy="5" r="2.5" fill={fillColorInner} />
            </>
          ) : (
            <Circle cx="5" cy="5" r="5" fill={fillColorInner} />
          )}
        </Svg>
        <BaseBox marginLeft="spacing.2">
          <Text
            weight="medium"
            color="surface.text.gray.subtle"
            textAlign="left"
            size={textSizeMapping[size]}
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
