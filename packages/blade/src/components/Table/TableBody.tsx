import React from 'react';
import { Body, Row, Cell } from '@table-library/react-table-library/table';

type TableBodyProps = {
  children: React.ReactNode;
};

const TableBody = ({ children }: TableBodyProps): React.ReactElement => {
  return <Body>{children}</Body>;
};

type TableRowProps = {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any; // TODO: Fix type
};

const TableRow = ({ children, item }: TableRowProps): React.ReactElement => {
  return <Row item={item}>{children}</Row>;
};

type TableCellProps = {
  children: React.ReactNode;
};

const TableCell = ({ children }: TableCellProps): React.ReactElement => {
  return <Cell>{children}</Cell>;
};

export { TableBody, TableRow, TableCell };
