import React from 'react';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

import type { ListViewFilterProps } from './types';

const ListViewFilters = (_prop: ListViewFilterProps): React.ReactElement => {
  throwBladeError({
    message: 'ListViewFilter is not yet implemented for native',
    moduleName: 'ListViewFilter',
  });

  return <Text>ListView is not available for Native mobile apps.</Text>;
};

export { ListViewFilters };
