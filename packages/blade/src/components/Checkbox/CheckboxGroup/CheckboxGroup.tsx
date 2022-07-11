import React from 'react';
import { useId } from '../../../hooks/useId';
import { CheckboxGroupContent } from './CheckboxGroupContent';
import { CheckboxGroupField } from './CheckboxGroupField';
import { CheckboxGroupHelpText } from './CheckboxGroupHelpText';
import { CheckboxGroupLabel } from './CheckboxGroupLabel';

type CheckboxGroupProps = {
  children: React.ReactNode;
  helpText: string;
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
  isOptional,
}: CheckboxGroupProps): React.ReactElement => {
  const uuid = useId('checkbox-group');
  const labelId = `${uuid}-label`;

  return (
    <CheckboxGroupField labelledBy={labelId}>
      <CheckboxGroupLabel id={labelId}>
        {label} {isOptional ? <span style={{ color: 'gray' }}>(optional)</span> : ''}
      </CheckboxGroupLabel>
      <CheckboxGroupContent>{children}</CheckboxGroupContent>
      <CheckboxGroupHelpText>{helpText}</CheckboxGroupHelpText>
    </CheckboxGroupField>
  );
};

export { CheckboxGroup };
