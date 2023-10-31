import React from 'react';
import type { TableProps } from './Table';

export type TableContextType = {
  selectionType?: TableProps['selectionType'];
};

const TableContext = React.createContext<TableContextType>({
  selectionType: undefined,
});
const TableProvider = TableContext.Provider;

const useTableContext = (): TableContextType => {
  const context = React.useContext(TableContext);
  return context;
};

export { useTableContext, TableProvider };
