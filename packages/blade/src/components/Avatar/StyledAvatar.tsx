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
import { getBackgroundColorToken } from '~components/Button/BaseButton/BaseButton';
import getIn from '~utils/lodashButBetter/get';
import getBaseTextStyles from '~components/Typography/BaseText/getBaseTextStyles';
import { getTextProps, getHeadingProps } from '~components/Typography';

const StyledAvatar = styled(BaseBox)<StyledAvatarProps>(({ theme, variant, color, size }) => {
  return {
    width: 'fit-content',
    // borderWidth: makeBorderSize(theme.border.width.thinner),
    borderRadius: makeBorderSize(theme.border.radius[avatarBorderRadiusTokens[variant]]),
    // borderColor: getIn(theme.colors, 'surface.border.gray.subtle'),
    // borderStyle: 'solid',

    // '&:hover': {
    //   borderColor: getIn(theme.colors, 'surface.border.gray.muted'),

    //   'button[role="button"]': {
    //     borderColor: getIn(theme.colors, 'surface.border.gray.muted'),
    //     backgroundColor: getIn(theme.colors, avatarColorTokens.background[color]),
    //   },
    // },

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
      borderWidth: makeBorderSize(theme.border.width.thin),
      borderRadius: makeBorderSize(theme.border.radius[avatarBorderRadiusTokens[variant]]),
      borderColor: getIn(theme.colors, 'transparent'),
      backgroundColor: getIn(theme.colors, avatarColorTokens.background[color]),

      img: {
        display: 'block',
        height: avatarSizeTokens[size],
        width: avatarSizeTokens[size],
        borderRadius: makeBorderSize(theme.border.radius[avatarBorderRadiusTokens[variant]]),
        objectFit: 'cover',
      },

      '&:hover': {
        borderColor: getIn(theme.colors, 'surface.border.gray.muted'),
        backgroundColor: getIn(theme.colors, avatarColorTokens.background[color]),
      },

      '&:focus': {
        backgroundColor: getIn(
          theme.colors,
          getBackgroundColorToken({
            property: 'background',
            variant: 'secondary',
            color,
            state: 'default',
          }),
        ),
      },
    },
  };
});

export { StyledAvatar };
