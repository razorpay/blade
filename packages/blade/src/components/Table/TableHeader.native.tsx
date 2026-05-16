/* eslint-disable react/no-unused-prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Text } from '~components/Typography';

import type { TableHeaderCellProps, TableHeaderProps, TableHeaderRowProps } from './types';

const TableHeader = (props: TableHeaderProps): React.ReactElement => {
  return <Text>Table Component is not available for Native mobile apps.</Text>;
};

const TableHeaderRow = (props: TableHeaderRowProps): React.ReactElement => {
  return <Text>Table Component is not available for Native mobile apps.</Text>;
};

const TableHeaderCell = (props: TableHeaderCellProps): React.ReactElement => {
  return <Text>Table Component is not available for Native mobile apps.</Text>;
};

export { TableHeader, TableHeaderRow, TableHeaderCell };
