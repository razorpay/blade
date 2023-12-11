import type { ReactElement } from 'react';
import type { StyledBadgeProps } from './types';
import { StyledBadge } from './StyledBadge';
import { iconPadding, iconSize, horizontalPadding, badgeHeight } from './badgeTokens';
import type { IconComponent, IconProps } from '~components/Icons';
import BaseBox from '~components/Box/BaseBox';
import type { Feedback } from '~tokens/theme/theme';
import type { BaseTextProps } from '~components/Typography/BaseText/types';
import { Text } from '~components/Typography';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { StringChildrenType, TestID } from '~utils/types';
import { getStringFromReactText } from '~src/utils/getStringChildren';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { isReactNative, makeSize } from '~utils';
import { throwBladeError } from '~utils/logger';

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
  color?: Feedback | 'primary';
  /**
   * Sets the contrast of the badge.
   *
   * @default 'low'
   */
  emphasis?: 'low' | 'high';
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
  StyledPropsBlade;

const isFeedbackVariant = (variant: string): variant is Feedback => {
  const feedbackVariants = ['information', 'negative', 'neutral', 'notice', 'positive'];
  return feedbackVariants.includes(variant);
};

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
  const badgeVariant = color === 'primary' ? 'blue' : color;
  const props: ColorProps = {
    iconColor: 'feedback.icon.neutral.lowContrast',
    textColor: 'feedback.text.neutral.lowContrast',
    backgroundColor: 'feedback.background.neutral.lowContrast',
  };
  if (isFeedbackVariant(badgeVariant)) {
    props.iconColor = `feedback.icon.${badgeVariant}.${emphasis}Contrast`;
    props.textColor = `feedback.text.${badgeVariant}.${emphasis}Contrast`;
    props.backgroundColor = `feedback.background.${badgeVariant}.${emphasis}Contrast`;
  } else {
    props.iconColor = `badge.icon.${badgeVariant}.${emphasis}Contrast`;
    props.textColor = `badge.text.${badgeVariant}.${emphasis}Contrast`;
    props.backgroundColor = `badge.background.${badgeVariant}.${emphasis}Contrast`;
  }
  return props;
};

const _Badge = ({
  children,
  emphasis = 'low',
  icon: Icon,
  size = 'medium',
  color = 'neutral',
  testID,
  ...styledProps
}: BadgeProps): ReactElement => {
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
      display={(isReactNative() ? 'flex' : 'inline-flex') as never}
      {...metaAttribute({ name: MetaConstants.Badge, testID })}
      {...getStyledProps(styledProps)}
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
          <Text
            {...badgeTextSizes[size]}
            type="normal"
            weight="medium"
            truncateAfterLines={1}
            color={textColor}
          >
            {children}
          </Text>
        </BaseBox>
      </StyledBadge>
    </BaseBox>
  );
};

const Badge = assignWithoutSideEffects(_Badge, {
  displayName: 'Badge',
  componentId: 'Badge',
});

export type { BadgeProps };
export { Badge };
