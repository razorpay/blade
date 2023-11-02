import React from 'react';
import type { TableProps } from './Table';

export type TableContextType = {
  selectionType?: TableProps['selectionType'];
  selectedRows?: string[];
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
