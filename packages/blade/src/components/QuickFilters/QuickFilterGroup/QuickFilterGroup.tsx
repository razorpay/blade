import React, { useState } from 'react';
import type { QuickFilterGroupProps } from '../types';
import { QuickFilterGroupProvider, useQuickFilterGroupContext } from './QuickFilterContext';
import { RadioGroup } from '~components/Radio';
import { Box } from '~components/Box';
import { CheckboxGroup } from '~components/Checkbox';

const QuickFilterWrapper = ({
  selectionType,
  children,
}: Pick<QuickFilterGroupProps, 'selectionType' | 'children'>): React.ReactElement => {
  const { selectedQuickFilters, setSelectedQuickFilters } = useQuickFilterGroupContext();

  if (selectionType === 'single') {
    return (
      <RadioGroup
        value={selectedQuickFilters[0]}
        onChange={({ value }) => {
          setSelectedQuickFilters([value]);
        }}
      >
        {' '}
        {children}{' '}
      </RadioGroup>
    );
  }
  return (
    <CheckboxGroup
      value={selectedQuickFilters}
      onChange={({ values }) => {
        setSelectedQuickFilters(values);
      }}
    >
      {' '}
      {children}
    </CheckboxGroup>
  );
};

const QuickFilterGroup = ({
  onChange,
  selectionType,
  children,
}: QuickFilterGroupProps): React.ReactElement => {
  const [selectedQuickFilters, setSelectedQuickFilters] = useState<string[]>([]);
  return (
    <QuickFilterGroupProvider
      value={{ selectionType, onChange, selectedQuickFilters, setSelectedQuickFilters }}
    >
      <QuickFilterWrapper selectionType={selectionType}>
        <Box display="flex" flexDirection="row" gap="spacing.3">
          {children}
        </Box>
      </QuickFilterWrapper>
    </QuickFilterGroupProvider>
  );
};

export { QuickFilterGroup };
