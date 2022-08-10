import type { ReactElement } from 'react';
import type { CSSObject } from 'styled-components';
import styled from 'styled-components';
import { StyledBadge } from './StyledBadge';
import type { IconComponent } from '~components/Icons';
import { BaseText } from '~components/Typography/BaseText';
import { getPlatformType } from '~utils';
import Box from '~components/Box';

type BadgeProps = {
  children: string;
  variant?: 'positive' | 'negative' | 'notice' | 'information' | 'neutral';
  contrast?: 'low' | 'high';
  size?: 'small' | 'medium';
  icon?: IconComponent;
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

  return (
    <StyledBadge variant={variant} contrast={contrast} size={size}>
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
