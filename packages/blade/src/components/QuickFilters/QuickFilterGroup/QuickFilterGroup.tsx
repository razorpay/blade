import React from 'react';
import type { QuickFilterGroupProps, QuickFilterWrapperProps } from '../types';
import { QuickFilterGroupProvider, useQuickFilterGroupContext } from './QuickFilterContext';
import { RadioGroup } from '~components/Radio';
import BaseBox from '~components/Box/BaseBox';
import { CheckboxGroup } from '~components/Checkbox';
import { useControllableState } from '~utils/useControllable';
import { useId } from '~utils/useId';

const QuickFilterWrapper = ({
  children,
  onChange,
  setSelectedQuickFilters,
  ...rest
}: QuickFilterWrapperProps): React.ReactElement => {
  const { selectedQuickFilters, selectionType } = useQuickFilterGroupContext();

  if (selectionType === 'single') {
    return (
      <RadioGroup
        value={selectedQuickFilters[0]}
        onChange={({ value }) => {
          setSelectedQuickFilters(() => [value]);
        }}
        size="small"
        {...rest}
      >
        {children}
      </RadioGroup>
    );
  }
  return (
    <CheckboxGroup
      value={selectedQuickFilters}
      onChange={({ values }) => {
        setSelectedQuickFilters(() => values);
      }}
      size="small"
      {...rest}
    >
      {children}
    </CheckboxGroup>
  );
};

const QuickFilterGroup = ({
  children,
  testID,
  value,
  defaultValue,
  onChange,
  name,
  selectionType,
  ...rest
}: QuickFilterGroupProps): React.ReactElement => {
  const idBase = useId('quick-filter-group');
  const [selectedQuickFilters, setSelectedQuickFilters] = useControllableState({
    value: (value && selectionType === 'single' ? [value] : value) as string[] | undefined,
    // If selectionType is single, we need to convert the value to an array
    defaultValue: (defaultValue && selectionType === 'single'
      ? [defaultValue]
      : defaultValue ?? []) as string[] | undefined,
    onChange: (values: string[]) => onChange?.({ values, name: name ?? idBase }),
  });
  return (
    <QuickFilterGroupProvider value={{ selectionType, selectedQuickFilters }}>
      <QuickFilterWrapper
        onChange={onChange}
        setSelectedQuickFilters={setSelectedQuickFilters}
        {...rest}
      >
        <BaseBox display="flex" flexDirection="row" gap="spacing.3">
          {children}
        </BaseBox>
      </QuickFilterWrapper>
    </QuickFilterGroupProvider>
  );
};

export { QuickFilterGroup };
