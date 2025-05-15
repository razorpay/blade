/* eslint-disable react/no-unused-prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import type { TableBodyProps, TableCellProps, TableRowProps } from './types';
import { Text } from '~components/Typography';

const TableBody = <Item,>(props: TableBodyProps<Item>): React.ReactElement => {
  return <Text>Table Component is not available for Native mobile apps.</Text>;
};

const TableRow = (props: TableRowProps<unknown>): React.ReactElement => {
  return <Text>Table Component is not available for Native mobile apps.</Text>;
};

const TableCell = (props: TableCellProps): React.ReactElement => {
  return <Text>Table Component is not available for Native mobile apps.</Text>;
};

const StyledCell = (props: TableCellProps): React.ReactElement => {
  return <Text>Table Component is not available for Native mobile apps.</Text>;
};

const CellWrapper = (props: TableCellProps): React.ReactElement => {
  return <Text>Table Component is not available for Native mobile apps.</Text>;
};

export { TableBody, TableRow, TableCell, StyledCell, CellWrapper };
