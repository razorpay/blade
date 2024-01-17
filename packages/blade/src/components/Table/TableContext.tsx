/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line @typescript-eslint/no-empty-function
import React from 'react';
import type { TableNode } from '@table-library/react-table-library/table';
import type { TableBackgroundColors, TableProps } from './types';

export type TableContextType = {
  selectionType?: TableProps<unknown>['selectionType'];
  selectedRows?: TableNode['id'][];
  totalItems: number;
  toggleRowSelectionById: (id: TableNode['id']) => void;
  toggleAllRowsSelection: () => void;
  deselectAllRows: () => void;
  rowDensity: NonNullable<TableProps<unknown>['rowDensity']>;
  toggleSort: (sortKey: string) => void;
  currentSortedState: {
    sortKey: string;
    isSortReversed: boolean;
    sortableColumns?: string[];
  };
  setPaginationPage: (page: number) => void;
  setPaginationRowSize: (size: number) => void;
  currentPaginationState?: {
    page: number;
    size: number;
  };
  showStripedRows?: boolean;
  disabledRows: TableNode['id'][];
  setDisabledRows: React.Dispatch<React.SetStateAction<TableNode['id'][]>>;
  backgroundColor: TableBackgroundColors;
};

const TableContext = React.createContext<TableContextType>({
  selectionType: 'none',
  selectedRows: undefined,
  totalItems: 0,
  toggleRowSelectionById: () => {},
  toggleAllRowsSelection: () => {},
  deselectAllRows: () => {},
  rowDensity: 'normal',
  toggleSort: () => {},
  currentSortedState: {
    sortKey: '',
    isSortReversed: false,
  },
  setPaginationPage: () => {},
  setPaginationRowSize: () => {},
  disabledRows: [],
  setDisabledRows: () => {},
  backgroundColor: 'surface.background.gray.intense',
});

const useTableContext = (): TableContextType => {
  const context = React.useContext(TableContext);
  return context;
};

export { useTableContext, TableContext };
