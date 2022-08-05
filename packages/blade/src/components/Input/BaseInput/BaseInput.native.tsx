import type { ReactElement } from 'react';
import { useState } from 'react';
import styled from 'styled-components/native';
import type { BaseInputProps } from './baseInputHelpers';
import { useInput } from './baseInputHelpers';
import getBaseInputStyles from './getBaseInputStyles';
import type { Theme } from '~components/BladeProvider';

export const StyledBaseInput = styled.TextInput<
  BaseInputProps & { isFocussed: boolean; theme: Theme }
>((props) => ({
  ...getBaseInputStyles({ isDisabled: !props.editable, theme: props.theme }),
  backgroundColor: props.isFocussed
    ? props.theme.colors.brand.primary[300]
    : props.theme.colors.brand.gray[200],
  borderBottomColor: (function getBorderBottomColor(): string {
    if (props.isFocussed) {
      return props.theme.colors.brand.primary[500];
    }
    if (!props.editable) {
      return props.theme.colors.brand.gray[300];
    }
    return props.theme.colors.brand.gray[400];
  })(),
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
}: BaseInputProps): ReactElement => {
  const [isFocussed, setIsFocussed] = useState(false);
  const { handleOnChange } = useInput({ defaultValue, value, onChange });

  console.log({
    label,
    labelPosition,
  });

  return (
    <StyledBaseInput
      label="abc"
      name={name}
      type={type}
      defaultValue={defaultValue}
      value={value}
      placeholder={placeholder}
      isFocussed={isFocussed}
      editable={!isDisabled}
      onFocus={(): void => setIsFocussed(true)}
      onBlur={(): void => setIsFocussed(false)}
      onChangeText={(text): void => handleOnChange({ inputName: name, inputValue: text })}
    />
  );
};
