import styled from 'styled-components';
import type { AvatarButtonProps } from './types';
import { avatarSizeTokens, avatarColorTokens, avatarBorderRadiusTokens } from './avatarTokens';
import { makeBorderSize, makeSize } from '~utils';
import getIn from '~utils/lodashButBetter/get';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';

const StyledAvatarButton = styled.button<AvatarButtonProps>(
  ({ theme, size = 'medium', variant = 'circle', color = 'neutral' }) => {
    return {
      textAlign: 'center',
      textDecoration: 'none',
      cursor: 'pointer',
      minHeight: makeSize(avatarSizeTokens[size]),
      height: makeSize(avatarSizeTokens[size]),
      width: makeSize(avatarSizeTokens[size]),
      border: 'none',
      borderRadius: makeBorderSize(theme.border.radius[avatarBorderRadiusTokens[variant]]),
      backgroundColor: getIn(theme.colors, avatarColorTokens.background[color]),

      img: {
        display: 'block',
        height: avatarSizeTokens[size],
        width: avatarSizeTokens[size],
        borderRadius: makeBorderSize(theme.border.radius[avatarBorderRadiusTokens[variant]]),
        objectFit: 'cover',
      },

      '&:focus-visible': {
        ...getFocusRingStyles({ theme }),
      },
    };
  },
);

export { StyledAvatarButton };
