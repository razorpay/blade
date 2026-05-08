import React from 'react';
import type { ListViewFilterProps } from './types';
import { Text } from '~components/Typography';
import { logger } from '~utils/logger';

const ListViewFilters = (_prop: ListViewFilterProps): React.ReactElement => {
  logger({
    type: 'warn',
    message: 'ListViewFilter is not yet implemented for native',
    moduleName: 'ListViewFilter',
  });

  return <Text>ListView is not available for Native mobile apps.</Text>;
};

export { ListViewFilters };
