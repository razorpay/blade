import type { ReactElement } from 'react';
import { useState } from 'react';
import styled from 'styled-components/native';
import type { BaseInputProps } from './baseInputHelpers';
import { getHintType, useInput } from './baseInputHelpers';

import getBaseInputStyles from './getBaseInputStyles';
import type { Theme } from '~components/BladeProvider';
import { FormHintText, FormLabelText } from '~components/Form';
import Box from '~components/Box';

export const StyledBaseInput = styled.TextInput<
  BaseInputProps & { isFocused: boolean; theme: Theme }
>((props) => ({
  ...getBaseInputStyles({
    theme: props.theme,
    isFocused: props.isFocused,
    isDisabled: !props.editable,
    validationState: props.validationState,
  }),
}));

export const BaseInput = ({
  label,
  labelPosition = 'top',
  placeholder,
  type = 'text',
  defaultValue,
  name,
  value,
  onChange,
  isDisabled,
  neccessityIndicator,
  validationState,
  errorText,
  helpText,
  successText,
}: BaseInputProps): ReactElement => {
  const [isFocused, setisFocused] = useState(false);
  const { handleOnChange } = useInput({ defaultValue, value, onChange });

  return (
    <Box display="flex" flexDirection="column">
      <FormLabelText neccessityIndicator={neccessityIndicator} id="input" position={labelPosition}>
        {label}
      </FormLabelText>
      <Box paddingBottom="spacing.1" />
      <StyledBaseInput
        label="abc"
        name={name}
        type={type}
        defaultValue={defaultValue}
        value={value}
        placeholder={placeholder}
        isFocused={isFocused}
        editable={!isDisabled}
        onFocus={(): void => setisFocused(true)}
        onBlur={(): void => setisFocused(false)}
        validationState={validationState}
        onChangeText={(text): void => handleOnChange({ inputName: name, inputValue: text })}
      />
      <FormHintText
        state={getHintType({ _validationState: validationState, _helpText: helpText })}
        errorText={errorText}
        helpText={helpText}
        successText={successText}
      />
    </Box>
  );
};
