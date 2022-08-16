import styled from 'styled-components';
import type { ReactElement } from 'react';
import getBaseInputStyles, { getInputBackgroundAndBorderStyles } from './getBaseInputStyles';

import type { StyledBaseInputProps } from './StyledBaseInput.d';
import getTextStyles from '~components/Typography/Text/getTextStyles';

// omitting our consumer `onChange` prop since the types are conflicting with the default onChange of HTML
const StyledBaseNativeInput = styled.input<StyledBaseInputProps>((props) => ({
  ...getBaseInputStyles({
    isDisabled: props.disabled,
    theme: props.theme,
    validationState: props.validationState,
    leadingIcon: props.leadingIcon,
    prefix: props.prefix,
    interactionElement: props.interactionElement,
    suffix: props.suffix,
    trailingIcon: props.trailingIcon,
  }),
  '::placeholder': getTextStyles({
    size: 'medium',
    variant: 'body',
    type: 'placeholder',
    weight: 'regular',
    contrast: 'low',
    theme: props.theme,
  }),
  ':focus': {
    ...getInputBackgroundAndBorderStyles({
      theme: props.theme,
      isFocused: true,
      isDisabled: props.disabled,
      validationState: props.validationState,
    }),
    outline: 'none',
  },
  borderTopStyle: 'hidden',
  borderLeftStyle: 'hidden',
  borderRightStyle: 'hidden',
  boxSizing: 'border-box',
}));

export const StyledBaseInput = ({
  name,
  isDisabled,
  isRequired,
  handleOnChange,
  ...props
}: StyledBaseInputProps): ReactElement => {
  return (
    <StyledBaseNativeInput
      disabled={isDisabled}
      required={isRequired}
      onChange={(event): void => handleOnChange({ name, value: event })}
      {...props}
    />
  );
};
