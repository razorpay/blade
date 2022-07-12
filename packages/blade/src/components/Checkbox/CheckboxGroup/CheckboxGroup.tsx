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
  children: React.ReactNode;
  helpText?: string;
  errorText?: string;
  hasError?: boolean;
  showOptionalLabel?: boolean;
  isDisabled?: boolean;
  label: string;
  labelPosition?: 'top' | 'left';
  defaultValue?: string[];
  value?: string[];
  onChange?: (values: string[]) => void;
  name?: string;
};

const CheckboxGroup = ({
  children,
  label,
  helpText,
  isDisabled,
  showOptionalLabel,
  labelPosition = 'top',
  hasError,
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
    hasError,
    showOptionalLabel,
  });

  const showError = hasError && errorText;
  const showHelpText = !showError && helpText;

  return (
    <CheckboxGroupProvider value={contextValue}>
      <CheckboxGroupField labelledBy={labelId}>
        <CheckboxGroupLabel id={labelId}>
          {label}
          {showOptionalLabel && (
            <CheckboxGroupHintText variant="help"> (optional)</CheckboxGroupHintText>
          )}
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
