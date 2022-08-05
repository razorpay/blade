import React from 'react';
import { CheckboxGroupContent } from './CheckboxGroupContent';
import { CheckboxGroupField } from './CheckboxGroupField';
import { CheckboxGroupProvider } from './CheckboxGroupContext';
import { useCheckboxGroup } from './useCheckboxGroup';
import { FormLabelText } from '~components/Form/FormLabelText';
import Box from '~components/Box';
import { FormHintText } from '~components/Form/FormHintText';

type CheckboxGroupProps = {
  /**
   * Accepts multiple checkboxes as children
   */
  children: React.ReactNode;
  /**
   * Help text of the checkbox group
   */
  helpText?: string;
  /**
   * Error text of the checkbox group
   * Renders when `validationState` is set to 'error'
   *
   * Overrides helpText
   */
  errorText?: string;
  /**
   * Sets the error state of the CheckboxGroup
   * If set to `error` it will render the `errorText` of the group,
   * and propagate `invalid` prop to every checkbox
   */
  validationState?: 'error' | 'none';
  /**
   * Renders a neccessity indicator after CheckboxGroup label
   *
   * If set to `undefined` it renders nothing.
   */
  neccessityIndicator?: 'required' | 'optional' | 'none';
  /**
   * Sets the disabled state of the CheckboxGroup
   * If set to `true` it propagate down to all the checkboxes
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Renders the label of the checkbox group
   */
  label: string;
  /**
   * Sets the position of the label
   *
   * @default 'top'
   */
  labelPosition?: 'top' | 'left';
  /**
   * Initial value of the checkbox group
   */
  defaultValue?: string[];
  /**
   * value of the checkbox group
   *
   * Use `onChange` to update its value
   */
  value?: string[];
  /**
   * The callback invoked when any of the checkbox's state changes
   */
  onChange?: ({ name, values }: { name: string; values: string[] }) => void;
  /**
   * The name of the input field in a checkbox
   * (Useful for form submission).
   */
  name?: string;
};

const CheckboxGroup = ({
  children,
  label,
  helpText,
  isDisabled,
  neccessityIndicator = 'none',
  labelPosition = 'top',
  validationState,
  errorText,
  name,
  defaultValue,
  onChange,
  value,
}: CheckboxGroupProps): React.ReactElement => {
  const { contextValue, ids } = useCheckboxGroup({
    defaultValue,
    onChange,
    value,
    isDisabled,
    name,
    labelPosition,
    validationState,
  });

  const showError = validationState === 'error' && errorText;
  const showHelpText = !showError && helpText;
  const accessibillityText = `,${showError ? errorText : ''} ${showHelpText ? helpText : ''}`;

  return (
    <CheckboxGroupProvider value={contextValue}>
      <CheckboxGroupField labelledBy={ids.labelId}>
        <FormLabelText
          neccessityIndicator={neccessityIndicator}
          position={labelPosition}
          id={ids.labelId}
          accessibillityText={accessibillityText}
        >
          {label}
        </FormLabelText>
        <Box>
          <CheckboxGroupContent>{children}</CheckboxGroupContent>
          <FormHintText
            errorText={errorText}
            helpText={helpText}
            state={validationState === 'error' ? 'error' : 'help'}
          />
        </Box>
      </CheckboxGroupField>
    </CheckboxGroupProvider>
  );
};

export { CheckboxGroup, CheckboxGroupProps };
