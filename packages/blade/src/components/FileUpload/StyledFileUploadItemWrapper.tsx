import styled from 'styled-components';
import type { StyledFileUploadItemWrapperProps } from './types';
import { fileUploadItemBackgroundColors, fileUploadMotionTokens } from './fileUploadTokens';
import getIn from '~utils/lodashButBetter/get';
import BaseBox from '~components/Box/BaseBox';
import { makeMotionTime } from '~utils/makeMotionTime';
import { castWebType, makeSize } from '~utils';
import { size } from '~tokens/global';

const StyledFileUploadItemWrapper = styled(BaseBox)<StyledFileUploadItemWrapperProps>(
  ({ theme, status }) => {
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
      height: makeSize(size[56]),
      width: '100%',
      backgroundColor: getIn(theme.colors, fileUploadItemBackgroundColors[status].default),
      transitionProperty: 'background-color',
      transitionTimingFunction: easing,
      transitionDuration: duration,
      borderColor: theme.colors.interactive.border.neutral.faded,
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
