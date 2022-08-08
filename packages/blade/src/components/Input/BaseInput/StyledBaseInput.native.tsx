import type { ReactElement } from 'react';
import { useState } from 'react';
import styled from 'styled-components/native';
import type { StyledBaseInputProps } from './StyledBaseInput.d';

import getBaseInputStyles from './getBaseInputStyles';
import type { Theme } from '~components/BladeProvider';

const StyledNativeBaseInput = styled.TextInput<
  StyledBaseInputProps & { isFocused: boolean; theme: Theme }
>((props) => ({
  ...getBaseInputStyles({
    theme: props.theme,
    isFocused: props.isFocused,
    isDisabled: !props.editable,
    validationState: props.validationState,
  }),
}));

export const StyledBaseInput = ({
  name,
  isRequired,
  isDisabled,
  handleOnChange,
  ...props
}: StyledBaseInputProps): ReactElement => {
  const [isFocused, setisFocused] = useState(false);

  return (
    <StyledNativeBaseInput
      isFocused={isFocused}
      editable={!isDisabled}
      onFocus={(): void => setisFocused(true)}
      onBlur={(): void => setisFocused(false)}
      onChangeText={(text): void => handleOnChange({ inputName: name, inputValue: text })}
      {...props}
    />
  );
};
