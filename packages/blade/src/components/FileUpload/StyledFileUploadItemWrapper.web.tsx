import styled from 'styled-components';
import type { StyledFileUploadItemWrapperProps } from './types';
import {
  fileUploadItemBackgroundColors,
  fileUploadMotionTokens,
  fileUploadHeightTokens,
} from './fileUploadTokens';
import getIn from '~utils/lodashButBetter/get';
import { castWebType, makeSize, useTheme } from '~utils';
import { colors as globalColors } from '~tokens/global';
import BaseBox from '~components/Box/BaseBox';
import { makeMotionTime } from '~utils/makeMotionTime';

const StyledFileUploadItemWrapper = styled(BaseBox)<StyledFileUploadItemWrapperProps>(
  ({ theme, status, size }) => {
    const { colorScheme } = useTheme();
    const boxShadowColor =
      colorScheme === 'light'
        ? globalColors.neutral.blueGrayLight.a906
        : globalColors.neutral.black[50];
    const easing = getIn(theme.motion, fileUploadMotionTokens.easing);
    const duration = castWebType(
      makeMotionTime(getIn(theme.motion, fileUploadMotionTokens.duration)),
    );

    return {
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'space-between',
      borderStyle: 'solid',
      minHeight: makeSize(fileUploadHeightTokens[size === 'variable' ? 'large' : size]),
      width: '100%',
      backgroundColor: getIn(theme.colors, fileUploadItemBackgroundColors[status].default),
      transitionProperty: 'background-color',
      transitionTimingFunction: easing,
      transitionDuration: duration,
      borderColor:
        status === 'error'
          ? theme.colors.interactive.border.negative.faded
          : theme.colors.surface.border.gray.subtle,
      wordBreak: 'break-all',
      boxShadow: `0px 0.5px 4px 0px ${boxShadowColor}`,

      ...(status !== 'uploading' && {
        '&:hover': {
          backgroundColor: getIn(theme.colors, fileUploadItemBackgroundColors[status].hover),
        },
      }),
    };
  },
);

export { StyledFileUploadItemWrapper };
