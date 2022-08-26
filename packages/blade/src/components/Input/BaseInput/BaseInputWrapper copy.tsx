import styled from 'styled-components';
import type { ReactElement, ReactNode } from 'react';
import { getInputBackgroundAndBorderStyles } from './baseInputStyles';
import type { BaseInputProps } from './BaseInput';
import { getPlatformType } from '~utils';
import Box from '~components/Box';

type BaseInputWrapperProps = Pick<BaseInputProps, 'isDisabled' | 'validationState'> & {
  isFocused?: boolean;
};

const StyledBaseInputWrapper = styled(Box)<BaseInputWrapperProps>((props) => ({
  ...getInputBackgroundAndBorderStyles({
    theme: props.theme,
    isFocused: props.isFocused,
    isDisabled: props.isDisabled,
    validationState: props.validationState,
  }),
  ':focus-within':
    getPlatformType() === 'react-native'
      ? undefined
      : {
          ...getInputBackgroundAndBorderStyles({
            theme: props.theme,
            isFocused: true,
            isDisabled: props.isDisabled,
            validationState: props.validationState,
          }),
        },
}));

export const BaseInputWrapper = ({
  children,
  ...props
}: BaseInputWrapperProps & {
  children: ReactNode;
}): ReactElement => (
  <StyledBaseInputWrapper display="flex" flexDirection="row" width="100%" {...props}>
    {children}
  </StyledBaseInputWrapper>
);
