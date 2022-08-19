import React from 'react';
import { RadioGroupProvider } from './RadioContext';
import { RadioGroupContent } from './RadioGroupContent';
import { useRadioGroup } from './useRadioGroup';
import Box from '~components/Box';
import { FormHint, FormLabel } from '~components/Form';
import { SelectorGroupField } from '~components/Form/Selector/SelectorGroupField';

type RadioGroupProps = {
  /**
   * Accepts multiple radios as children
   */
  children: React.ReactNode;
  /**
   * Help text of the radio group
   */
  helpText?: string;
  /**
   * Error text of the radio group
   * Renders when `validationState` is set to 'error'
   *
   * Overrides helpText
   */
  errorText?: string;
  /**
   * Sets the error state of the radioGroup
   * If set to `error` it will render the `errorText` of the group,
   * and propagate `invalid` prop to every radio
   */
  validationState?: 'error' | 'none';
  /**
   * Renders a neccessity indicator after radioGroup label
   *
   * If set to `undefined` it renders nothing.
   */
  neccessityIndicator?: 'required' | 'optional' | 'none';
  /**
   * Sets the disabled state of the radioGroup
   * If set to `true` it propagate down to all the radios
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Renders the label of the radio group
   */
  label: string;
  /**
   * Sets the position of the label
   *
   * @default 'top'
   */
  labelPosition?: 'top' | 'left';
  /**
   * Initial value of the radio group
   */
  defaultValue?: string;
  /**
   * value of the radio group
   *
   * Use `onChange` to update its value
   */
  value?: string;
  /**
   * The callback invoked when any of the radio's state changes
   */
  onChange?: ({ name, value }: { name: string | undefined; value: string }) => void;
  /**
   * The name of the input field in a radio
   * (Useful for form submission).
   */
  name?: string;
};

const RadioGroup = ({
  children,
  label,
  helpText,
  isDisabled = false,
  neccessityIndicator = 'none',
  labelPosition = 'top',
  validationState = 'none',
  errorText,
  name,
  defaultValue,
  onChange,
  value,
}: RadioGroupProps): React.ReactElement => {
  const { contextValue, ids } = useRadioGroup({
    defaultValue,
    isDisabled,
    labelPosition,
    name,
    onChange,
    validationState,
    value,
  });

  const showError = validationState === 'error' && errorText;
  const showHelpText = !showError && helpText;
  const accessibillityText = `,${showError ? errorText : ''} ${showHelpText ? helpText : ''}`;

  return (
    <RadioGroupProvider value={contextValue}>
      <SelectorGroupField position={labelPosition} labelledBy={ids.labelId}>
        <FormLabel
          as="span"
          neccessityIndicator={neccessityIndicator}
          position={labelPosition}
          id={ids.labelId}
          accessibillityText={accessibillityText}
        >
          {label}
        </FormLabel>
        <Box>
          <RadioGroupContent>{children}</RadioGroupContent>
          <FormHint
            type={validationState === 'error' ? 'error' : 'help'}
            errorText={errorText}
            helpText={helpText}
          />
        </Box>
      </SelectorGroupField>
    </RadioGroupProvider>
  );
};

export { RadioGroup, RadioGroupProps };
