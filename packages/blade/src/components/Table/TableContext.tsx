import React from 'react';
import type { TableNode } from '@table-library/react-table-library/table';
import type { TableProps } from './Table';

export type TableContextType = {
  selectionType?: TableProps['selectionType'];
  selectedRows?: TableNode['id'][];
  totalItems: number;
  toggleRowSelectionById: (id: TableNode['id']) => void;
  toggleAllRowsSelection: () => void;
  rowDensity: TableProps['rowDensity'];
  toggleSort: (sortKey: string) => void;
  currentSortedState: {
    sortKey: string;
    isSortReversed: boolean;
    sortableColumns?: string[];
  };
};

const TableContext = React.createContext<TableContextType>({
  selectionType: undefined,
  selectedRows: undefined,
  totalItems: 0,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleRowSelectionById: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleAllRowsSelection: () => {},
  rowDensity: 'normal',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleSort: () => {},
  currentSortedState: {
    sortKey: '',
    isSortReversed: false,
  },
});
const TableProvider = TableContext.Provider;

const useTableContext = (): TableContextType => {
  const context = React.useContext(TableContext);
  return context;
};

export { useTableContext, TableProvider };
