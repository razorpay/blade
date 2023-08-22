import styled from 'styled-components';
import type { ReactElement, ReactNode } from 'react';
import React from 'react';
import { getInputBackgroundAndBorderStyles } from './baseInputStyles';
import type { BaseInputProps } from './BaseInput';
import { BaseInputAnimatedBorder } from './BaseInputAnimatedBorder';
import { AnimatedBaseInputWrapper } from './AnimatedBaseInputWrapper';
import { castWebType, getPlatformType } from '~utils';
import type { ActionStates } from '~tokens/theme/theme';
import { makeMotionTime } from '~utils/makeMotionTime';

type BaseInputWrapperProps = Pick<
  BaseInputProps,
  'isDisabled' | 'validationState' | 'showAllTags'
> & {
  isFocused?: boolean;
  isLabelLeftPositioned?: boolean;
  currentInteraction: keyof ActionStates;
  isTextArea?: boolean;
  setShowAllTagsWithAnimation: (showAllTagsWithAnimation: boolean) => void;
  children: React.ReactNode;
};

const StyledBaseInputWrapper = styled(AnimatedBaseInputWrapper)<BaseInputWrapperProps>((props) => ({
  ...getInputBackgroundAndBorderStyles({
    theme: props.theme,
    isFocused: props.currentInteraction === 'active',
    isDisabled: props.isDisabled,
    validationState: props.validationState,
  }),
  '&:hover':
    getPlatformType() === 'react-native'
      ? undefined
      : {
          ...getInputBackgroundAndBorderStyles({
            theme: props.theme,
            isHovered: true,
            isFocused: props.currentInteraction === 'active',
            isDisabled: props.isDisabled,
            validationState: props.validationState,
          }),
          transitionProperty: 'background-color',
          transitionDuration: castWebType(makeMotionTime(props.theme.motion.duration.xquick)),
          transitionTimingFunction: castWebType(props.theme.motion.easing.standard.effective),
        },
  ':focus-within':
    getPlatformType() === 'react-native'
      ? undefined
      : {
          ...getInputBackgroundAndBorderStyles({
            theme: props.theme,
            isFocused: props.currentInteraction === 'active',
            isDisabled: props.isDisabled,
            validationState: props.validationState,
          }),
        },
}));

const _BaseInputWrapper: React.ForwardRefRenderFunction<
  HTMLDivElement,
  BaseInputWrapperProps & {
    children: ReactNode;
  }
> = (
  {
    children,
    validationState,
    currentInteraction,
    isLabelLeftPositioned,
    isTextArea,
    showAllTags,
    setShowAllTagsWithAnimation,
    ...props
  },
  ref,
): ReactElement => {
  return (
    <StyledBaseInputWrapper
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      display="flex"
      flexDirection="row"
      width="100%"
      alignItems={isTextArea ? 'flex-start' : undefined}
      validationState={validationState}
      currentInteraction={currentInteraction}
      showAllTags={showAllTags}
      setShowAllTagsWithAnimation={setShowAllTagsWithAnimation}
      position="relative"
      {...props}
    >
      {children}
      <BaseInputAnimatedBorder
        currentInteraction={currentInteraction}
        validationState={validationState}
      />
    </StyledBaseInputWrapper>
  );
};

export const BaseInputWrapper = React.forwardRef(_BaseInputWrapper);
