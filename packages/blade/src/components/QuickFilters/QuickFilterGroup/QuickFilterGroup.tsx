import React, { useState } from 'react';
import type { QuickFilterGroupProps, QuickFilterWrapperProps } from '../types';
import { QuickFilterGroupProvider, useQuickFilterGroupContext } from './QuickFilterContext';
import { RadioGroup } from '~components/Radio';
import BaseBox from '~components/Box/BaseBox';
import { CheckboxGroup } from '~components/Checkbox';

const QuickFilterWrapper = ({
  children,
  onChange,
  setSelectedQuickFilters,
  ...rest
}: QuickFilterWrapperProps): React.ReactElement => {
  const {
    selectedQuickFilters,

    selectionType,
  } = useQuickFilterGroupContext();

  if (selectionType === 'single') {
    return (
      <RadioGroup
        value={selectedQuickFilters[0]}
        onChange={({ value }) => {
          setSelectedQuickFilters([value]);
          onChange?.({ values: value });
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
