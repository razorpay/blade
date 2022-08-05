import styled from 'styled-components';
import type { ReactElement } from 'react';
import getBaseInputStyles from './getBaseInputStyles';
import type { BaseInputProps } from './baseInputHelpers';
import { useInput } from './baseInputHelpers';
import getTextStyles from '~components/Typography/Text/getTextStyles';
import { FormLabelText } from '~components/Form/FormLabelText';
import Box from '~components/Box';

// omitting our consumer `onChange` prop since the types are conflicting with the default onChange of HTML
const StyledBaseInput = styled.input<Omit<BaseInputProps, 'onChange'>>((props) => ({
  ...getBaseInputStyles({ isDisabled: props.disabled, theme: props.theme }),
  '::placeholder': getTextStyles({
    size: 'medium',
    variant: 'body',
    type: 'placeholder',
    weight: 'regular',
    contrast: 'low',
    theme: props.theme,
  }),
  ':focus': {
    backgroundColor: props.theme.colors.brand.primary[300],
    borderBottomColor: props.theme.colors.brand.primary[500],
    outline: 'none',
  },
  borderTopStyle: 'hidden',
  borderLeftStyle: 'hidden',
  borderRightStyle: 'hidden',
  boxSizing: 'border-box',
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
}: BaseInputProps): ReactElement => {
  const { handleOnChange } = useInput({ defaultValue, value, onChange });
  /**
   * add FormLabel
   *  - label
   * add FormHintText
   *  - errorId,helpId,successId
   *
   * const {inputId, errorTextId, helpTextId, successTextId} = useFormIds()
   *
   * <label>
   *   <span>First Name</span>
   *   <input type="text">
   * </label>
   *
   * generate ids for
   *  - input(checkbox/radio/text)
   *  - helptext
   *  - errorText
   *  - successtext
   *
   * <FormLabel for="input-id">Enter First Name</FormLabel>
   * <BaseInput id="input-id" type="text"/>
   * <FormHintText helptext="Enter your first and last name"/>
   */
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
        disabled={isDisabled}
        onChange={(event): void =>
          handleOnChange({ inputName: name, inputValue: event?.target.value })
        }
      />
    </Box>
  );
};
