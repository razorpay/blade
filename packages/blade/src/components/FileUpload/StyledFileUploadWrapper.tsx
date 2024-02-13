import styled from 'styled-components';
import type { StyledFileUploadWrapperProps } from './types';
import { fileUploadMotionTokens } from './fileUploadTokens';
import getIn from '~utils/lodashButBetter/get';
import BaseBox from '~components/Box/BaseBox';
import { makeMotionTime } from '~utils/makeMotionTime';
import { castWebType } from '~utils';

const StyledFileUploadWrapper = styled(BaseBox)<StyledFileUploadWrapperProps>(
  ({ theme, isDisabled }) => {
    const easing = getIn(theme.motion, fileUploadMotionTokens.easing);
    const duration = castWebType(
      makeMotionTime(getIn(theme.motion, fileUploadMotionTokens.duration)),
    );

    return {
      display: 'flex',
      borderStyle: 'dashed',
      height: '54px',

      ...(!isDisabled && {
        '&:hover': {
          // backgroundColor: getIn(
          //   theme.colors,
          //   fileUploadColorTokens.background[isChecked && color ? color : 'unchecked'].hover,
          // ),
          transitionTimingFunction: easing,
          transitionDuration: duration,
        },
      }),
    };
  },
);

export { StyledFileUploadWrapper };
