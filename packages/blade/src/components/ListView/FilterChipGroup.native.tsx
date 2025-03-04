import React from 'react';
import type { FilterChipGroupProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const FilterChipGroup = (_prop: FilterChipGroupProps): React.ReactElement => {
  throwBladeError({
    message: 'FilterChipGroup is not yet implemented for native',
    moduleName: 'FilterChipGroup',
  });

  return <Text>FilterChipGroup is not available for Native mobile apps.</Text>;
};

export { FilterChipGroup };
