import styled from 'styled-components';
import getIn from '~utils/lodashButBetter/get';
import { castWebType, makeSize } from '~utils';
import type { StyledFileUploadItemWrapperProps } from './types';
import {
  fileUploadItemBackgroundColors,
  fileUploadMotionTokens,
  fileUploadHeightTokens,
} from './fileUploadTokens';
import BaseBox from '~components/Box/BaseBox';
import { makeMotionTime } from '~utils/makeMotionTime';

const StyledFileUploadItemWrapper = styled(BaseBox)<StyledFileUploadItemWrapperProps>(
  ({ theme, status, size }) => {
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

      ...(status !== 'uploading' && {
        '&:hover': {
          backgroundColor: getIn(theme.colors, fileUploadItemBackgroundColors[status].hover),
        },
      }),
    };
  },
);

export { StyledFileUploadItemWrapper };
