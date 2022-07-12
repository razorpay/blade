import React from 'react';
import { useId } from '../../../hooks/useId';
import { Wrapper } from '../Wrapper';
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
  isOptional?: boolean;
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
  isOptional,
  labelPosition = 'top',
  hasError,
  errorText,
  name,
  defaultValue,
  onChange,
  value,
}: CheckboxGroupProps): React.ReactElement => {
  const uuid = useId('checkbox-group');
  const labelId = `${uuid}-label`;
  const { contextValue } = useCheckboxGroup({
    defaultValue,
    onChange,
    value,
    isDisabled,
    name,
    labelPosition,
    hasError,
    isOptional,
  });

  const showError = hasError && errorText;
  const showHelpText = !showError && helpText;

  return (
    <CheckboxGroupProvider value={contextValue}>
      <CheckboxGroupField labelledBy={labelId}>
        <CheckboxGroupLabel id={labelId}>
          {label} {isOptional ? <span style={{ color: 'gray' }}>(optional)</span> : ''}
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
