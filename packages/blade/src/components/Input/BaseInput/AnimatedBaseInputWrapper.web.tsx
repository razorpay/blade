import React from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import styled, { css, keyframes } from 'styled-components';
import type { BaseInputWrapperProps } from './types';
import { getInputBackgroundAndBorderStyles } from './baseInputStyles';
import { BASEINPUT_WRAPPER_MIN_HEIGHT, BASEINPUT_WRAPPER_MAX_HEIGHT } from './baseInputConfig';
import BaseBox from '~components/Box/BaseBox';
import { motion } from '~tokens/global';
import { castWebType, makeMotionTime, makeSize } from '~utils';
import type { BladeElementRef } from '~utils/types';

// Define the animation keyframes
const expandAnimation = keyframes`
  from {
    max-height: ${makeSize(BASEINPUT_WRAPPER_MIN_HEIGHT)};
  }
  to {
    max-height: ${makeSize(BASEINPUT_WRAPPER_MAX_HEIGHT)};
  }
`;

const collapseAnimation = keyframes`
  from {
    max-height: ${makeSize(BASEINPUT_WRAPPER_MAX_HEIGHT)};
  }
  to {
    max-height: ${makeSize(BASEINPUT_WRAPPER_MIN_HEIGHT)};
  }
`;

const expandTransition = css`
  animation: ${expandAnimation} ${makeMotionTime(motion.duration.quick)}
    ${String(motion.easing.entrance.effective)};
`;

const collapseTransition = css`
  animation: ${collapseAnimation} ${makeMotionTime(motion.duration.quick)}
    ${String(motion.easing.exit.effective)};
`;

const noTransition = css`
  animation: none;
`;

const StyledBaseInputWrapper = styled(BaseBox)<
  Pick<
    BaseInputWrapperProps,
    'currentInteraction' | 'isDisabled' | 'validationState' | 'isTextArea' | 'isDropdownTrigger'
  >
>((props) => ({
  ...getInputBackgroundAndBorderStyles({
    theme: props.theme,
    isFocused: props.currentInteraction === 'focus',
    isDisabled: props.isDisabled,
    validationState: props.validationState,
    isTextArea: props.isTextArea,
    isDropdownTrigger: props.isDropdownTrigger,
  }),
  '&:hover': {
    ...getInputBackgroundAndBorderStyles({
      theme: props.theme,
      isHovered: true,
      isFocused: props.currentInteraction === 'focus',
      isDisabled: props.isDisabled,
      validationState: props.validationState,
      isDropdownTrigger: props.isDropdownTrigger,
    }),
    transitionProperty: 'background-color',
    transitionDuration: castWebType(makeMotionTime(props.theme.motion.duration.xquick)),
    transitionTimingFunction: castWebType(props.theme.motion.easing.standard.effective),
  },
  ':focus-within': {
    ...getInputBackgroundAndBorderStyles({
      theme: props.theme,
      isFocused: props.currentInteraction === 'focus',
      isDisabled: props.isDisabled,
      validationState: props.validationState,
      isDropdownTrigger: props.isDropdownTrigger,
    }),
  },
}));

const getMaxHeight = ({
  maxTagRows,
  showAllTags,
}: Pick<BaseInputWrapperProps, 'maxTagRows' | 'showAllTags'>): number => {
  if (maxTagRows === 'single') {
    return BASEINPUT_WRAPPER_MIN_HEIGHT;
  }

  if (maxTagRows === 'multiple') {
    return BASEINPUT_WRAPPER_MAX_HEIGHT;
  }

  // In expandable, max-height depends on the state
  return showAllTags ? BASEINPUT_WRAPPER_MAX_HEIGHT : BASEINPUT_WRAPPER_MIN_HEIGHT;
};

// Styled component with animation
const StyledAnimatedBaseInputWrapper = styled(StyledBaseInputWrapper)<{
  transition?: FlattenSimpleInterpolation;
  maxTagRows: BaseInputWrapperProps['maxTagRows'];
  showAllTags: BaseInputWrapperProps['showAllTags'];
  isDropdownTrigger: BaseInputWrapperProps['isDropdownTrigger'];
}>((props) =>
  props.isDropdownTrigger
    ? css`
        ${props.transition};
        max-height: ${makeSize(
          getMaxHeight({ maxTagRows: props.maxTagRows, showAllTags: props.showAllTags }),
        )};
      `
    : undefined,
);

const _AnimatedBaseInputWrapper: React.ForwardRefRenderFunction<
  BladeElementRef,
  BaseInputWrapperProps & {
    showAllTags?: boolean;
  }
> = (
  { showAllTags, setShowAllTagsWithAnimation, maxTagRows, isDropdownTrigger, ...rest },
  ref,
): React.ReactElement => {
  return (
    <StyledAnimatedBaseInputWrapper
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      {...rest}
      transition={
        maxTagRows !== 'expandable'
          ? noTransition
          : showAllTags
          ? expandTransition
          : collapseTransition
      }
      isDropdownTrigger={isDropdownTrigger}
      showAllTags={showAllTags}
      maxTagRows={maxTagRows}
      onAnimationEnd={(e) => {
        if (!showAllTags && e.animationName === collapseAnimation.getName()) {
          setShowAllTagsWithAnimation?.(false);
        }

        if (maxTagRows !== 'expandable' && !showAllTags) {
          setShowAllTagsWithAnimation?.(false);
        }
      }}
    />
  );
};

const AnimatedBaseInputWrapper = React.forwardRef(_AnimatedBaseInputWrapper);

export { AnimatedBaseInputWrapper, expandAnimation, collapseAnimation };
