import React from 'react';
import type { PaginationProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const Pagination = (_prop: PaginationProps): React.ReactElement => {
  throwBladeError({
    message: 'Pagination is not yet implemented for native',
    moduleName: 'Pagination',
  });

  return <Text>Pagination is not available for Native mobile apps.</Text>;
};

export { Pagination };
