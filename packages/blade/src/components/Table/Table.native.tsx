/* eslint-disable react/no-unused-prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import type { TableProps } from './types';
import { Text } from '~components/Typography';

const Table = <Item,>(props: TableProps<Item>): React.ReactElement => {
  return <Text>Table Component is not available for Native mobile apps.</Text>;
};

export { Table };
