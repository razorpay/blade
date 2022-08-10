import type { ReactElement } from 'react';
import type { CSSObject } from 'styled-components';
import styled from 'styled-components';
import { StyledBadge } from './StyledBadge';
import { minHeight as badgeMinHeight } from './badgeTokens';
import type { IconComponent, IconProps } from '~components/Icons';
import type { BaseTextProps } from '~components/Typography/BaseText';
import { BaseText } from '~components/Typography/BaseText';
import type { Theme } from '~components/BladeProvider';
import { useTheme } from '~components/BladeProvider';
import { getIn, getPlatformType, makeBorderSize, makeSize } from '~utils';
import Box from '~components/Box';
import type { DotNotationSpacingStringToken } from '~src/_helpers/types';

type BadgeProps = {
  children: string;
  variant?: 'positive' | 'negative' | 'notice' | 'information' | 'neutral';
  contrast?: 'low' | 'high';
  size?: 'small' | 'medium';
  icon?: IconComponent;
  fontWeight?: 'regular' | 'bold';
};

type BadgeStyleProps = {
  backgroundColor: string;
  borderColor: string;
  borderWidth: string;
  textColor: BaseTextProps['color'];
  textSize: BaseTextProps['fontSize'];
  lineHeight: BaseTextProps['lineHeight'];
  iconColor: IconProps['color'];
  iconSize: IconProps['size'];
  minHeight: string;
  iconSpacing: DotNotationSpacingStringToken;
  borderRadius: string;
};

const getProps = ({
  variant,
  contrast,
  size,
  hasIcon,
  theme,
}: {
  variant: NonNullable<BadgeProps['variant']>;
  contrast: NonNullable<BadgeProps['contrast']>;
  size: NonNullable<BadgeProps['size']>;
  hasIcon?: boolean;
  theme: Theme;
}): BadgeStyleProps => {
  const props: BadgeStyleProps = {
    backgroundColor: getIn(theme, `colors.feedback.background.${variant}.${contrast}Contrast`),
    borderColor: getIn(theme, `colors.feedback.border.${variant}.${contrast}Contrast`),
    borderWidth: makeBorderSize(theme.border.width.thin),
    borderRadius: makeBorderSize(theme.border.radius.max),
    textColor: `feedback.text.${variant}.${contrast}Contrast`,
    textSize: 75,
    lineHeight: 's',
    iconColor: `feedback.icon.${variant}.${contrast}Contrast`,
    iconSize: 'xsmall',
    minHeight: makeSize(badgeMinHeight[size]),
    iconSpacing: hasIcon ? 'spacing.1' : 'spacing.0',
  };
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

  const { theme } = useTheme();
  const {
    backgroundColor,
    minHeight,
    borderColor,
    borderRadius,
    borderWidth,
    iconColor,
    iconSize,
    iconSpacing,
    textColor,
    textSize,
    lineHeight,
  } = getProps({
    variant,
    contrast,
    size,
    hasIcon: Boolean(Icon),
    theme,
  });
  return (
    <StyledBadge
      backgroundColor={backgroundColor}
      minHeight={minHeight}
      borderColor={borderColor}
      borderRadius={borderRadius}
      borderWidth={borderWidth}
    >
      <Box
        paddingRight="spacing.2"
        paddingLeft="spacing.2"
        display="flex"
        flex={1}
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        overflow="hidden"
      >
        {Icon ? (
          <Box paddingRight={iconSpacing} display="flex">
            <Icon color={iconColor} size={iconSize} />
          </Box>
        ) : null}
        <StyledBaseText
          fontSize={textSize}
          fontWeight={fontWeight}
          lineHeight={lineHeight}
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
