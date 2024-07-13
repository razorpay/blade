import styled from 'styled-components';
import type { StyledAvatarProps } from './types';
import { avatarSizeTokens, avatarBorderRadiusTokens } from './avatarTokens';
import BaseBox from '~components/Box/BaseBox';
import { makeBorderSize, makeSize } from '~utils';

const StyledAvatar = styled(BaseBox)<StyledAvatarProps & { isInteractive?: boolean }>(
  ({ theme, variant, size, isInteractive }) => {
    return {
      display: 'flex',
      width: makeSize(avatarSizeTokens[size]),
      height: makeSize(avatarSizeTokens[size]),
      borderRadius: makeBorderSize(theme.border.radius[avatarBorderRadiusTokens[variant]]),
      outline: `${makeBorderSize(theme.border.width.thinner)} solid ${
        theme.colors.surface.border.gray.subtle
      }`,

      ...(isInteractive
        ? {
            '&:hover': {
              outline: `${makeBorderSize(theme.border.width.thick)} solid ${
                theme.colors.surface.border.gray.muted
              }`,
              borderColor: theme.colors.surface.border.gray.muted,
              backgroundColor: theme.colors.surface.background.gray.moderate,
            },
          }
        : {}),
    };
  },
);

export { StyledAvatar };
