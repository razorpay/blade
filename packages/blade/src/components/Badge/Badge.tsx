import React from 'react';
import type { ReactElement } from 'react';
import type { StyledBadgeProps } from './types';
import { StyledBadge } from './StyledBadge';
import { iconPadding, iconSize, horizontalPadding, badgeHeight } from './badgeTokens';
import type { IconComponent, IconProps } from '~components/Icons';
import BaseBox from '~components/Box/BaseBox';
import type { FeedbackColors, SubtleOrIntense } from '~tokens/theme/theme';
import type { BaseTextProps } from '~components/Typography/BaseText/types';
import { Text } from '~components/Typography';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type {
  DataAnalyticsAttribute,
  BladeElementRef,
  StringChildrenType,
  TestID,
} from '~utils/types';
import { getStringFromReactText } from '~src/utils/getStringChildren';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { isReactNative, makeSize } from '~utils';
import { throwBladeError } from '~utils/logger';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

type BadgeProps = {
  /**
   * Sets the label for the badge.
   *
   */
  children: StringChildrenType;
  /**
   * Sets the color of the badge.
   *
   * @default 'neutral'
   */
  color?: FeedbackColors | 'primary';
  /**
   * Sets the contrast of the badge.
   *
   * @default 'subtle'
   */
  emphasis?: SubtleOrIntense;
  /**
   * Sets the size of the badge.
   *
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Icon to be displayed in the badge.
   * Accepts a component of type `IconComponent` from Blade.
   *
   */
  icon?: IconComponent;
} & TestID &
  StyledPropsBlade &
  DataAnalyticsAttribute;

type ColorProps = {
  iconColor: IconProps['color'];
  textColor: BaseTextProps['color'];
  backgroundColor: StyledBadgeProps['backgroundColor'];
};

const getColorProps = ({
  color,
  emphasis,
}: {
  color: NonNullable<BadgeProps['color']>;
  emphasis: NonNullable<BadgeProps['emphasis']>;
}): ColorProps => {
  const props: ColorProps = {
    iconColor: 'feedback.icon.neutral.intense',
    textColor: 'feedback.text.neutral.intense',
    backgroundColor: 'feedback.background.neutral.subtle',
  };

  if (color === 'primary') {
    // primary color badge
    props.textColor =
      emphasis === 'intense' ? `surface.text.staticWhite.normal` : `surface.text.primary.normal`;
    props.iconColor =
      emphasis === 'intense' ? `surface.icon.staticWhite.normal` : `surface.icon.primary.normal`;
    props.backgroundColor = `surface.background.primary.${emphasis}`;
  } else {
    // feedback colors badge
    props.textColor =
      emphasis === 'intense' ? `surface.text.staticWhite.normal` : `feedback.text.${color}.intense`;
    props.iconColor =
      emphasis === 'intense' ? `surface.icon.staticWhite.normal` : `feedback.icon.${color}.intense`;
    props.backgroundColor = `feedback.background.${color}.${emphasis}`;
  }

  return props;
};

const _Badge = (
  {
    children,
    emphasis = 'subtle',
    icon: Icon,
    size = 'medium',
    color = 'neutral',
    testID,
    ...props
  }: BadgeProps,
  ref: React.Ref<BladeElementRef>,
): ReactElement => {
  const childrenString = getStringFromReactText(children);
  if (__DEV__) {
    if (!childrenString?.trim()) {
      throwBladeError({
        message: 'Text as children is required for Badge.',
        moduleName: 'Badge',
      });
    }
  }

  const { backgroundColor, iconColor, textColor } = getColorProps({
    color,
    emphasis,
  });

  const badgeTextSizes = {
    small: {
      variant: 'body',
      size: 'xsmall',
    },
    medium: {
      variant: 'body',
      size: 'small',
    },
    large: {
      variant: 'body',
      size: 'small',
    },
  } as const;

  return (
    <BaseBox
      ref={ref as never}
      display={(isReactNative() ? 'flex' : 'inline-flex') as never}
      {...metaAttribute({ name: MetaConstants.Badge, testID })}
      {...getStyledProps(props)}
      {...makeAnalyticsAttribute(props)}
    >
      <StyledBadge
        height={makeSize(badgeHeight[size])}
        backgroundColor={backgroundColor}
        size={size}
        textAlign={'left' as never}
      >
        <BaseBox
          paddingX={horizontalPadding[size]}
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          overflow="hidden"
        >
          {Icon ? (
            <BaseBox paddingRight={Boolean(Icon) ? iconPadding[size] : 'spacing.0'} display="flex">
              <Icon color={iconColor} size={iconSize[size]} />
            </BaseBox>
          ) : null}
          <Text {...badgeTextSizes[size]} weight="medium" truncateAfterLines={1} color={textColor}>
            {children}
          </Text>
        </BaseBox>
      </StyledBadge>
    </BaseBox>
  );
};

const Badge = assignWithoutSideEffects(React.forwardRef(_Badge), {
  displayName: 'Badge',
  componentId: 'Badge',
});

export type { BadgeProps };
export { Badge };
