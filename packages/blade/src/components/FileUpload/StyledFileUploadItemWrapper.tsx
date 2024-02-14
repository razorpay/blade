import styled from 'styled-components';
import type { StyledFileUploadItemWrapperProps } from './types';
import { fileUploadItemBackgroundColors } from './fileUploadTokens';
import getIn from '~utils/lodashButBetter/get';
import BaseBox from '~components/Box/BaseBox';
import { makeMotionTime } from '~utils/makeMotionTime';
import { castWebType } from '~utils';

const StyledFileUploadItemWrapper = styled(BaseBox)<StyledFileUploadItemWrapperProps>(
  ({ theme, status }) => {
    return {
      display: 'flex',
      justifyContent: 'space-between',
      borderStyle: 'solid',
      height: '54px',
      width: '100%',
      backgroundColor: getIn(theme.colors, fileUploadItemBackgroundColors[status].default),

      ...(status !== 'uploading' && {
        '&:hover': {
          backgroundColor: getIn(theme.colors, fileUploadItemBackgroundColors[status].hover),

          //   transitionTimingFunction: easing,
          //   transitionDuration: duration,
        },
      }),
    };
  },
);

export { StyledFileUploadItemWrapper };
