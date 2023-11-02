import React from 'react';
import type { TableNode } from '@table-library/react-table-library/table';
import type { TableProps } from './Table';

export type TableContextType = {
  selectionType?: TableProps['selectionType'];
  selectedRows?: TableNode['id'][];
  totalItems: number;
};

const TableContext = React.createContext<TableContextType>({
  selectionType: undefined,
  selectedRows: undefined,
  totalItems: 0,
});
const TableProvider = TableContext.Provider;

const useTableContext = (): TableContextType => {
  const context = React.useContext(TableContext);
  return context;
};

export { useTableContext, TableProvider };
