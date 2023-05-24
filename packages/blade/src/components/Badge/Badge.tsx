import type { ReactElement } from 'react';
import type { StyledBadgeProps } from './types';
import { StyledBadge } from './StyledBadge';
import { iconPadding, iconSize, horizontalPadding, verticalPadding } from './badgeTokens';
import type { IconComponent, IconProps } from '~components/Icons';
import BaseBox from '~components/Box/BaseBox';
import type { Feedback } from '~tokens/theme/theme';
import type { BaseTextProps } from '~components/Typography/BaseText/types';
import { Text } from '~components/Typography';
import { metaAttribute, MetaConstants } from '~utils';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { StringChildrenType, TestID } from '~src/_helpers/types';
import { getStringFromReactText } from '~src/utils/getStringChildren';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

type BadgeProps = {
  /**
   * Sets the label for the badge.
   *
   */
  children: StringChildrenType;
  /**
   * Sets the variant of the badge.
   *
   * @default 'neutral'
   */
  variant?: Feedback | 'blue';
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
  fontWeight?: 'regular' | 'bold';
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
  variant: NonNullable<BadgeProps['variant']>;
  contrast: NonNullable<BadgeProps['contrast']>;
}): ColorProps => {
  const props: ColorProps = {
    iconColor: 'feedback.icon.neutral.lowContrast',
    textColor: 'feedback.text.neutral.lowContrast',
    backgroundColor: 'feedback.background.neutral.lowContrast',
  };
  if (isFeedbackVariant(variant)) {
    props.iconColor = `feedback.icon.${variant}.${contrast}Contrast`;
    props.textColor = `feedback.text.${variant}.${contrast}Contrast`;
    props.backgroundColor = `feedback.background.${variant}.${contrast}Contrast`;
  } else {
    props.iconColor = `badge.icon.${variant}.${contrast}Contrast`;
    props.textColor = `badge.text.${variant}.${contrast}Contrast`;
    props.backgroundColor = `badge.background.${variant}.${contrast}Contrast`;
  }
  return props;
};

const _Badge = ({
  children,
  contrast = 'low',
  fontWeight = 'regular',
  icon: Icon,
  size = 'medium',
  variant = 'neutral',
  testID,
  ...styledProps
}: BadgeProps): ReactElement => {
  const childrenString = getStringFromReactText(children);
  if (!childrenString?.trim()) {
    throw new Error('[Blade: Badge]: Text as children is required for Badge.');
  }
  const { backgroundColor, iconColor, textColor } = getColorProps({
    variant,
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
    <StyledBadge
      backgroundColor={backgroundColor}
      size={size}
      {...metaAttribute({ name: MetaConstants.Badge, testID })}
      {...getStyledProps(styledProps)}
    >
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
  );
};

const Badge = assignWithoutSideEffects(_Badge, {
  displayName: 'Badge',
  componentId: 'Badge',
});

export { Badge, BadgeProps };
