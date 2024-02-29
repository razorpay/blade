import styled from 'styled-components';
import type { StyledFileUploadWrapperProps } from './types';
import { fileUploadMotionTokens, fileUploadColorTokens } from './fileUploadTokens';
import getIn from '~utils/lodashButBetter/get';
import BaseBox from '~components/Box/BaseBox';
import { makeMotionTime } from '~utils/makeMotionTime';
import { castWebType, makeSize } from '~utils';
import { size } from '~tokens/global';

const StyledFileUploadWrapper = styled(BaseBox)<StyledFileUploadWrapperProps>(
  ({ theme, isDisabled, isActive }) => {
    const easing = getIn(theme.motion, fileUploadMotionTokens.easing);
    const duration = castWebType(
      makeMotionTime(getIn(theme.motion, fileUploadMotionTokens.duration)),
    );

    return {
      display: 'flex',
      borderStyle: 'dashed',
      height: makeSize(size[56]),
      width: '100%',
      transitionProperty: 'background-color',
      transitionTimingFunction: easing,
      transitionDuration: duration,
      borderColor: getIn(
        theme.colors,
        fileUploadColorTokens.border[isDisabled ? 'disabled' : 'default'],
      ),

      ...(isActive && {
        backgroundColor: getIn(theme.colors, fileUploadColorTokens.background.active),
      }),

      ...(!isDisabled &&
        !isActive && {
          '&:hover': {
            backgroundColor: getIn(theme.colors, fileUploadColorTokens.background.hover),
          },
        }),
    };
  },
);

export { StyledFileUploadWrapper };
