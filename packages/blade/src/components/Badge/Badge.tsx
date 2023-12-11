import type { ReactElement } from 'react';
import type { StyledBadgeProps } from './types';
import { StyledBadge } from './StyledBadge';
import { iconPadding, iconSize, horizontalPadding, verticalPadding } from './badgeTokens';
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
import { isReactNative } from '~utils';
import { throwBladeError } from '~utils/logger';

type BadgeProps = {
  /**
   * Sets the label for the badge.
   *
   */
  children: StringChildrenType;
  /**
   * This prop is deprecated in favor of `color`.
   *
   * @deprecated Use the `color` prop instead
   * @default 'neutral'
   */
  variant?: Feedback | 'blue';
  /**
   * Sets the color of the badge.
   *
   * @default 'neutral'
   */
  color?: Feedback | 'default';
  /**
   * Sets the contrast of the badge.
   *
   * @default 'low'
   */
  contrast?: 'low' | 'high';
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
  /**
   * Sets the fontWeight of the label.
   *
   * @default 'regular'
   */
  fontWeight?: 'regular' | 'medium' | 'semibold';
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
  variant,
  contrast,
}: {
  variant: NonNullable<BadgeProps['color'] | 'blue'>;
  contrast: NonNullable<BadgeProps['contrast']>;
}): ColorProps => {
  const badgeVariant = variant === 'default' ? 'blue' : variant;
  const props: ColorProps = {
    iconColor: 'feedback.icon.neutral.lowContrast',
    textColor: 'feedback.text.neutral.lowContrast',
    backgroundColor: 'feedback.background.neutral.lowContrast',
  };
  if (isFeedbackVariant(badgeVariant)) {
    props.iconColor = `feedback.icon.${badgeVariant}.${contrast}Contrast`;
    props.textColor = `feedback.text.${badgeVariant}.${contrast}Contrast`;
    props.backgroundColor = `feedback.background.${badgeVariant}.${contrast}Contrast`;
  } else {
    props.iconColor = `badge.icon.${badgeVariant}.${contrast}Contrast`;
    props.textColor = `badge.text.${badgeVariant}.${contrast}Contrast`;
    props.backgroundColor = `badge.background.${badgeVariant}.${contrast}Contrast`;
  }
  return props;
};

const _Badge = ({
  children,
  contrast = 'low',
  fontWeight = 'medium',
  icon: Icon,
  size = 'medium',
  // TODO: Remove variant prop in next major release in favor of color prop
  variant = 'neutral',
  color,
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

  const badgeVariant = color ?? variant;
  const { backgroundColor, iconColor, textColor } = getColorProps({
    variant: badgeVariant,
    contrast,
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
      <StyledBadge backgroundColor={backgroundColor} size={size} textAlign={'left' as never}>
        <BaseBox
          paddingRight={horizontalPadding[size]}
          paddingLeft={horizontalPadding[size]}
          paddingTop={verticalPadding[size]}
          paddingBottom={verticalPadding[size]}
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
            weight={fontWeight}
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
