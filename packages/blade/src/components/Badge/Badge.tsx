import type { ReactElement } from 'react';
import type { CSSObject } from 'styled-components';
import styled from 'styled-components';
import { StyledBadge } from './StyledBadge';
import { useTheme } from '~components/BladeProvider';
import type { IconComponent } from '~components/Icons';
import { BaseText } from '~components/Typography/BaseText';
import { getPlatformType } from '~utils';
import Box from '~components/Box';

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
  variant?: 'positive' | 'negative' | 'notice' | 'information' | 'neutral';
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

  return (
    <StyledBadge variant={variant} contrast={contrast} size={size} platform={platform}>
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
          <Box paddingRight={Boolean(Icon) ? 'spacing.1' : 'spacing.0'} display="flex">
            <Icon color={`feedback.icon.${variant}.${contrast}Contrast`} size="xsmall" />
          </Box>
        ) : null}
        <StyledBaseText
          fontSize={75}
          fontWeight={fontWeight}
          lineHeight="s"
          color={`feedback.text.${variant}.${contrast}Contrast`}
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
