import styled from 'styled-components';
import type { ReactElement, ReactNode } from 'react';
import { getInputBackgroundAndBorderStyles } from './baseInputStyles';
import type { BaseInputProps } from './BaseInput';
import { BaseInputAnimatedBorder } from './BaseInputAnimatedBorder';
import Box from '~components/Box';
import { getPlatformType, makeMotionTime } from '~utils';
import type { ActionStates } from '~tokens/theme/theme';

type BaseInputWrapperProps = Pick<BaseInputProps, 'isDisabled' | 'validationState'> & {
  isFocused?: boolean;
  isLabelLeftPositioned?: boolean;
  currentInteraction: keyof ActionStates;
  isTextArea?: boolean;
};

const StyledBaseInputWrapper = styled(Box)<BaseInputWrapperProps>((props) => ({
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
          transitionDuration: makeMotionTime(props.theme.motion.duration.xquick),
          transitionTimingFunction: props.theme.motion.easing.standard.effective as string,
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

export const BaseInputWrapper = ({
  children,
  validationState,
  currentInteraction,
  isLabelLeftPositioned,
  isTextArea,
  ...props
}: BaseInputWrapperProps & {
  children: ReactNode;
}): ReactElement => {
  return (
    <>
      <StyledBaseInputWrapper
        display="flex"
        flexDirection="row"
        width="100%"
        alignItems={isTextArea ? 'flex-start' : undefined}
        validationState={validationState}
        currentInteraction={currentInteraction}
        {...props}
      >
        {children}
      </StyledBaseInputWrapper>
      <BaseInputAnimatedBorder
        currentInteraction={currentInteraction}
        validationState={validationState}
        isLabelLeftPositioned={isLabelLeftPositioned}
      />
    </>
  );
};
