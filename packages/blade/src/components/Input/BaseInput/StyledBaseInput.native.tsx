import type { ReactElement } from 'react';
import { useState } from 'react';
import styled from 'styled-components/native';
import type { BaseInputProps } from './BaseInput';
import getBaseInputStyles from './getBaseInputStyles';
import type { Theme } from '~components/BladeProvider';

export const StyledNativeBaseInput = styled.TextInput(
  (props: BaseInputProps & { isFocussed: boolean; theme: Theme }) => ({
    ...getBaseInputStyles({ theme: props.theme }),
    backgroundColor: props.isFocussed
      ? props.theme.colors.brand.primary[300]
      : props.theme.colors.brand.gray[200],
    borderBottomColor: props.isFocussed
      ? props.theme.colors.brand.primary[500]
      : props.theme.colors.brand.gray[400],
  }),
);

export const StyledBaseInput = ({
  label,
  labelPosition = 'top',
  placeholder,
  type = 'text',
  defaultValue,
  name,
  onChange,
}: BaseInputProps): ReactElement => {
  const [isFocussed, setIsFocussed] = useState(false);
  console.log({
    label,
    labelPosition,
    onChange,
  });
  return (
    <StyledNativeBaseInput
      label="abc"
      name={name}
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      onFocus={() => setIsFocussed(true)}
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      onBlur={() => setIsFocussed(false)}
      isFocussed={isFocussed}
    />
  );
};
