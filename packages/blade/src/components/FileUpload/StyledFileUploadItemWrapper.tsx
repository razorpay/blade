import styled from 'styled-components';
import type { StyledFileUploadItemWrapperProps } from './types';
import { fileUploadItemBackgroundColors, fileUploadMotionTokens } from './fileUploadTokens';
import getIn from '~utils/lodashButBetter/get';
import BaseBox from '~components/Box/BaseBox';
import { makeMotionTime } from '~utils/makeMotionTime';
import { castWebType } from '~utils';

const StyledFileUploadItemWrapper = styled(BaseBox)<StyledFileUploadItemWrapperProps>(
  ({ theme, status }) => {
    const easing = getIn(theme.motion, fileUploadMotionTokens.easing);
    const duration = castWebType(
      makeMotionTime(getIn(theme.motion, fileUploadMotionTokens.duration)),
    );

    return {
      display: 'flex',
      justifyContent: 'space-between',
      borderStyle: 'solid',
      minHeight: '56px',
      width: '100%',
      backgroundColor: getIn(theme.colors, fileUploadItemBackgroundColors[status].default),
      transitionProperty: 'background-color',
      transitionTimingFunction: easing,
      transitionDuration: duration,

      ...(status !== 'uploading' && {
        '&:hover': {
          backgroundColor: getIn(theme.colors, fileUploadItemBackgroundColors[status].hover),
        },
      }),
    };
  },
);

export { StyledFileUploadItemWrapper };
