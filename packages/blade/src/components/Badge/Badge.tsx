import type { ReactElement } from 'react';
import type { CSSObject } from 'styled-components';
import styled from 'styled-components';
import type { StyledBadgeProps } from './types';
import { StyledBadge } from './StyledBadge';
import { useTheme } from '~components/BladeProvider';
import type { IconComponent, IconProps } from '~components/Icons';
import { BaseText } from '~components/Typography/BaseText';
import { getPlatformType } from '~utils';
import Box from '~components/Box';
import type { Feedback } from '~tokens/theme/theme';
import type { BaseTextProps } from '~components/Typography/BaseText/types';

type BadgeProps = {
  /**
   * Sets the label for the badge.
   *
   */
  children: string;
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
  size?: 'small' | 'medium';
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
};

const isFeedbackVariant = (variant: string): variant is Feedback => {
  const feedbackVariants = ['information', 'negative', 'neutral', 'notice', 'positive'];
  return feedbackVariants.includes(variant);
};

type ColorProps = {
  iconColor: IconProps['color'];
  textColor: BaseTextProps['color'];
  backgroundColor: StyledBadgeProps['backgroundColor'];
  borderColor: StyledBadgeProps['borderColor'];
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
    borderColor: 'feedback.border.neutral.lowContrast',
  };
  if (isFeedbackVariant(variant)) {
    props.iconColor = `feedback.icon.${variant}.${contrast}Contrast`;
    props.textColor = `feedback.text.${variant}.${contrast}Contrast`;
    props.backgroundColor = `feedback.background.${variant}.${contrast}Contrast`;
    props.borderColor = `feedback.border.${variant}.${contrast}Contrast`;
  } else {
    props.iconColor = `badge.icon.${variant}.${contrast}Contrast`;
    props.textColor = `badge.text.${variant}.${contrast}Contrast`;
    props.backgroundColor = `badge.background.${variant}.${contrast}Contrast`;
    props.borderColor = `badge.border.${variant}.${contrast}Contrast`;
  }
  return props;
};

const StyledBaseText = styled(BaseText)(
  (): CSSObject => {
    if (getPlatformType() !== 'react-native') {
      return {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      };
    }
    return {};
  },
);

const Badge = ({
  children,
  contrast = 'low',
  fontWeight = 'regular',
  icon: Icon,
  size = 'medium',
  variant = 'neutral',
}: BadgeProps): ReactElement => {
  if (!children?.trim()) {
    throw new Error('[Blade: Badge]: Text as children is required for Badge.');
  }
  const { platform } = useTheme();
  const { backgroundColor, borderColor, iconColor, textColor } = getColorProps({
    variant,
    contrast,
  });
  return (
    <StyledBadge
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      size={size}
      platform={platform}
    >
      <Box
        paddingRight="spacing.3"
        paddingLeft="spacing.3"
        display="flex"
        flex={1}
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        overflow="hidden"
      >
        {Icon ? (
          <Box paddingRight={Boolean(Icon) ? 'spacing.2' : 'spacing.0'} display="flex">
            <Icon color={iconColor} size="small" />
          </Box>
        ) : null}
        <StyledBaseText
          fontSize={75}
          fontWeight={fontWeight}
          lineHeight="s"
          color={textColor}
          textAlign="center"
          truncateAfterLines={1}
        >
          {children}
        </StyledBaseText>
      </Box>
    </StyledBadge>
  );
};

export { Badge, BadgeProps };
