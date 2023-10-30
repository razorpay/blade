import React from 'react';
import { Table as ReactTable } from '@table-library/react-table-library/table';
import type { TableNode } from '@table-library/react-table-library/table';

export type TableProps = {
  children: React.ReactNode;
  data: TableNode;
};

const Table: React.FC<TableProps> = ({ children, data }) => {
  return <ReactTable data={data}>{children}</ReactTable>;
};

export { Table };
