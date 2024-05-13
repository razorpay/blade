import styled from 'styled-components';
import type { StyledAvatarProps } from './types';
import {
  avatarSizeTokens,
  avatarTextSizeMapping,
  avatarColorTokens,
  avatarBorderRadiusTokens,
} from './avatarTokens';
import BaseBox from '~components/Box/BaseBox';
import { makeBorderSize, makeSize } from '~utils';
import getIn from '~utils/lodashButBetter/get';
import getBaseTextStyles from '~components/Typography/BaseText/getBaseTextStyles';
import { getTextProps, getHeadingProps } from '~components/Typography';

const StyledAvatar = styled(BaseBox)<StyledAvatarProps>(({ theme, variant, color, size }) => {
  return {
    width: makeSize(avatarSizeTokens[size]),
    height: makeSize(avatarSizeTokens[size]),
    borderRadius: makeBorderSize(theme.border.radius[avatarBorderRadiusTokens[variant]]),

    'div[data-blade-component="base-text"]': {
      ...getBaseTextStyles({
        theme,
        ...(size === 'xlarge'
          ? {
              ...getHeadingProps({
                size: avatarTextSizeMapping[size].size,
                weight: 'semibold',
                color: getIn(theme.colors, avatarColorTokens.text[color]),
              }),
            }
          : {
              ...getTextProps({
                variant: avatarTextSizeMapping[size].variant,
                size: avatarTextSizeMapping[size].size,
                weight: 'semibold',
                color: getIn(theme.colors, avatarColorTokens.text[color]),
              }),
            }),
      }),
    },

    'button[role="button"]': {
      minHeight: makeSize(avatarSizeTokens[size]),
      height: makeSize(avatarSizeTokens[size]),
      width: makeSize(avatarSizeTokens[size]),
      borderWidth: makeBorderSize(theme.border.width.thinner),
      borderRadius: makeBorderSize(theme.border.radius[avatarBorderRadiusTokens[variant]]),
      borderColor: theme.colors.surface.border.gray.subtle,
      outline: 'none',
      backgroundColor: getIn(theme.colors, avatarColorTokens.background[color]),
      transition: `border-color ${theme.motion.duration.xquick} ${theme.motion.easing.standard.effective}, outline ${theme.motion.duration.xquick} ${theme.motion.easing.standard.effective}`,

      img: {
        display: 'block',
        height: avatarSizeTokens[size],
        width: avatarSizeTokens[size],
        borderRadius: makeBorderSize(theme.border.radius[avatarBorderRadiusTokens[variant]]),
        objectFit: 'cover',
      },

      '&:hover': {
        outline: `${makeBorderSize(theme.border.width.thick)} solid ${
          theme.colors.surface.border.gray.muted
        }`,
        border: theme.colors.surface.border.gray.muted,
        backgroundColor: getIn(theme.colors, avatarColorTokens.background[color]),
      },
    },
  };
});

export { StyledAvatar };
