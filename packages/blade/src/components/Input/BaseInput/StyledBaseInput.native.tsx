import type { ReactElement } from 'react';
import { useState } from 'react';
import styled from 'styled-components/native';
import type { StyledBaseInputProps } from './StyledBaseInput.d';
import { getBaseInputStyles } from './baseInputStyles';

const StyledNativeBaseInput = styled.TextInput<StyledBaseInputProps & { isFocused: boolean }>(
  (props) => ({
    ...getBaseInputStyles({
      theme: props.theme,
      isFocused: props.isFocused,
      isDisabled: !props.editable,
      validationState: props.validationState,
      leadingIcon: props.leadingIcon,
      prefix: props.prefix,
      interactionElement: props.interactionElement,
      suffix: props.suffix,
      trailingIcon: props.trailingIcon,
    }),
    lineHeight: undefined,
    height: '36px',
  }),
);

export const StyledBaseInput = ({
  name,
  isRequired,
  isDisabled,
  handleOnChange,
  handleOnBlur,
  ...props
}: StyledBaseInputProps): ReactElement => {
  const [isFocused, setisFocused] = useState(false);

  return (
    <StyledNativeBaseInput
      isFocused={isFocused}
      editable={!isDisabled}
      onFocus={(): void => {
        setisFocused(true);
        props.setIsFocused(true);
      }}
      onBlur={(): void => {
        setisFocused(false);
        props.setIsFocused(false);
      }}
      onChangeText={(text): void => handleOnChange?.({ name, value: text })}
      onEndEditing={(event): void => handleOnBlur?.({ name, value: event?.nativeEvent.text })}
      {...props}
    />
  );
};
