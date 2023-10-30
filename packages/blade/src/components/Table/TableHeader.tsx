import React from 'react';
import { Header, HeaderRow, HeaderCell } from '@table-library/react-table-library/table';

type TableHeaderProps = {
  children: React.ReactNode;
};

const TableHeader = ({ children }: TableHeaderProps): React.ReactElement => {
  return <Header>{children}</Header>;
};

type TableHeaderRowProps = {
  children: React.ReactNode;
};

const TableHeaderRow = ({ children }: TableHeaderRowProps): React.ReactElement => {
  return <HeaderRow>{children}</HeaderRow>;
};

type TableHeaderCellProps = {
  children: string;
};

const TableHeaderCell = ({ children }: TableHeaderCellProps): React.ReactElement => {
  return <HeaderCell>{children}</HeaderCell>;
};

export { TableHeader, TableHeaderRow, TableHeaderCell };
