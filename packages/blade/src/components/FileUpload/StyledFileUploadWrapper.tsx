import styled from 'styled-components';
import type { StyledFileUploadWrapperProps } from './types';
import { fileUploadMotionTokens, fileUploadColorTokens } from './fileUploadTokens';
import getIn from '~utils/lodashButBetter/get';
import BaseBox from '~components/Box/BaseBox';
import { makeMotionTime } from '~utils/makeMotionTime';
import { castWebType } from '~utils';

const StyledFileUploadWrapper = styled(BaseBox)<StyledFileUploadWrapperProps>(
  ({ theme, isDisabled, isActive, size }) => {
    const easing = getIn(theme.motion, fileUploadMotionTokens.easing);
    const duration = castWebType(
      makeMotionTime(getIn(theme.motion, fileUploadMotionTokens.duration)),
    );

    const isSmall = size === 'small';

    if (isSmall) {
      return {
        display: 'flex',
        borderStyle: 'none',
        borderWidth: 0,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        transitionProperty: 'background-color',
        transitionTimingFunction: easing,
        transitionDuration: duration,
        backgroundColor: getIn(
          theme.colors,
          isDisabled
            ? 'interactive.background.gray.highlighted'
            : 'interactive.background.gray.default',
        ),

        ...(isActive &&
          !isDisabled && {
            backgroundColor: getIn(theme.colors, 'interactive.background.gray.highlighted'),
          }),

        ...(!isDisabled &&
          !isActive && {
            '&:hover': {
              backgroundColor: getIn(theme.colors, 'interactive.background.gray.highlighted'),
            },
          }),
      };
    }

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
  },
);

export { StyledFileUploadWrapper };
