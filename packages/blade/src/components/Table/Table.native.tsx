/* eslint-disable react/no-unused-prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import type { TableProps } from './types';
import { Text } from '~components/Typography';
import { logger } from '~utils/logger';

const Table = <Item,>(props: TableProps<Item>): React.ReactElement => {
  if (__DEV__) {
    logger({
      type: 'warn',
      moduleName: 'Table',
      message: 'Table Component is not available for Native mobile apps.',
    });
  }
  return <Text>Table Component is not available for Native mobile apps.</Text>;
};

export { Table };
