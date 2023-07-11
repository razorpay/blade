import styled from 'styled-components';
import type { ReactElement, ReactNode } from 'react';
import { getInputBackgroundAndBorderStyles } from './baseInputStyles';
import type { BaseInputProps } from './BaseInput';
import { BaseInputAnimatedBorder } from './BaseInputAnimatedBorder';
import BaseBox from '~components/Box/BaseBox';
import { castWebType, getPlatformType } from '~utils';
import type { ActionStates } from '~tokens/theme/theme';
import { makeMotionTime } from '~utils/makeMotionTime';

type BaseInputWrapperProps = Pick<BaseInputProps, 'isDisabled' | 'validationState'> & {
  isFocused?: boolean;
  isLabelLeftPositioned?: boolean;
  currentInteraction: keyof ActionStates;
  isTextArea?: boolean;
};

const StyledBaseInputWrapper = styled(BaseBox)<BaseInputWrapperProps>((props) => ({
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
    <StyledBaseInputWrapper
      display="flex"
      flexDirection="row"
      width="100%"
      alignItems={isTextArea ? 'flex-start' : undefined}
      validationState={validationState}
      currentInteraction={currentInteraction}
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
