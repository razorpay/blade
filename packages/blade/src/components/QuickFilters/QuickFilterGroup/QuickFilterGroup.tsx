import React, { useState } from 'react';
import type { QuickFilterGroupProps } from '../types';
import { QuickFilterGroupProvider, useQuickFilterGroupContext } from './QuickFilterContext';
import { RadioGroup } from '~components/Radio';
import BaseBox from '~components/Box/BaseBox';
import { CheckboxGroup } from '~components/Checkbox';

const QuickFilterWrapper = ({
  selectionType,
  children,
  ...rest
}: Pick<QuickFilterGroupProps, 'selectionType' | 'children'>): React.ReactElement => {
  const { selectedQuickFilters, setSelectedQuickFilters, onChange } = useQuickFilterGroupContext();

  if (selectionType === 'single') {
    return (
      <RadioGroup
        value={selectedQuickFilters[0]}
        onChange={({ value }) => {
          setSelectedQuickFilters([value]);
          onChange?.({ value });
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
        setSelectedQuickFilters(values);
        onChange?.({ values });
      }}
      size="small"
      {...rest}
    >
      {children}
    </CheckboxGroup>
  );
};

const QuickFilterGroup = ({
  onChange,
  selectionType,
  children,
  ...rest
}: QuickFilterGroupProps): React.ReactElement => {
  const [selectedQuickFilters, setSelectedQuickFilters] = useState<string[]>([]);
  return (
    <QuickFilterGroupProvider
      value={{ selectionType, onChange, selectedQuickFilters, setSelectedQuickFilters }}
    >
      <QuickFilterWrapper selectionType={selectionType} {...rest}>
        <BaseBox display="flex" flexDirection="row" gap="spacing.3">
          {children}
        </BaseBox>
      </QuickFilterWrapper>
    </QuickFilterGroupProvider>
  );
};

export { QuickFilterGroup };
