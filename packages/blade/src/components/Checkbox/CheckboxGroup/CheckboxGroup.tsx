import React from 'react';
import { Wrapper } from '../Wrapper';
import { VisuallyHidden } from '../../VisuallyHidden';
import { Text } from '../../Typography';
import { CheckboxGroupContent } from './CheckboxGroupContent';
import { CheckboxGroupField } from './CheckboxGroupField';
import { CheckboxGroupHintText } from './CheckboxGroupHintText';
import { CheckboxGroupLabel } from './CheckboxGroupLabel';
import { CheckboxGroupProvider } from './CheckboxGroupContext';
import { useCheckboxGroup } from './useCheckboxGroup';

export type CheckboxGroupProps = {
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
   *
   * @default undefined
   */
  validationState?: 'error' | undefined;
  /**
   * Renders a neccessity indicator after CheckboxGroup label
   *
   * If set to `undefined` it renders nothing.
   */
  neccessityIndicator?: 'required' | 'optional';
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
   * The callback invoked when the any of the checkbox's state changes
   */
  onChange?: (values: string[]) => void;
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
  neccessityIndicator,
  labelPosition = 'top',
  validationState,
  errorText,
  name,
  defaultValue,
  onChange,
  value,
}: CheckboxGroupProps): React.ReactElement => {
  const { contextValue, labelId } = useCheckboxGroup({
    defaultValue,
    onChange,
    value,
    isDisabled,
    name,
    labelPosition,
    validationState,
    neccessityIndicator,
  });

  const showError = validationState === 'error' && errorText;
  const showHelpText = !showError && helpText;

  return (
    <CheckboxGroupProvider value={contextValue}>
      <CheckboxGroupField labelledBy={labelId}>
        <CheckboxGroupLabel id={labelId}>
          {label}
          {neccessityIndicator === 'optional' ? (
            <CheckboxGroupHintText variant="help"> (optional)</CheckboxGroupHintText>
          ) : neccessityIndicator === 'required' ? (
            <CheckboxGroupHintText variant="help"> (required)</CheckboxGroupHintText>
          ) : null}
          <VisuallyHidden>
            <Text>
              ,{showError && errorText}
              {showHelpText && showHelpText}
            </Text>
          </VisuallyHidden>
        </CheckboxGroupLabel>
        <Wrapper>
          <CheckboxGroupContent>{children}</CheckboxGroupContent>
          {showError && <CheckboxGroupHintText variant="error">{errorText}</CheckboxGroupHintText>}
          {showHelpText && <CheckboxGroupHintText variant="help">{helpText}</CheckboxGroupHintText>}
        </Wrapper>
      </CheckboxGroupField>
    </CheckboxGroupProvider>
  );
};

export { CheckboxGroup };
