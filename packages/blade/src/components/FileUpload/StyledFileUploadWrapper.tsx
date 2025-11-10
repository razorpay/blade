import type { DefaultTheme, StyledComponent } from 'styled-components';
import styled from 'styled-components';
import type { StyledFileUploadWrapperProps } from './types';
import { fileUploadMotionTokens, fileUploadColorTokens } from './fileUploadTokens';
import getIn from '~utils/lodashButBetter/get';
import BaseBox from '~components/Box/BaseBox';
import { makeMotionTime } from '~utils/makeMotionTime';
import { castWebType } from '~utils';

const StyledFileUploadWrapper: StyledComponent<
  typeof BaseBox,
  DefaultTheme,
  StyledFileUploadWrapperProps,
  never
> = styled(BaseBox)<StyledFileUploadWrapperProps>(({ theme, isDisabled, isActive }) => {
  const easing = getIn(theme.motion, fileUploadMotionTokens.easing);
  const duration = castWebType(
    makeMotionTime(getIn(theme.motion, fileUploadMotionTokens.duration)),
  );

  return {
    display: 'flex',
    borderStyle: 'dashed',
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
});

export { StyledFileUploadWrapper };
