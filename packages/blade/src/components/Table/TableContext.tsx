/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line @typescript-eslint/no-empty-function
import React from 'react';
import type { TableNode } from '@table-library/react-table-library/table';
import type { TableProps } from './types';
import type { SurfaceLevels } from '~tokens/theme/theme';

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
  surfaceLevel: SurfaceLevels;
  disabledRows: TableNode['id'][];
  setDisabledRows: React.Dispatch<React.SetStateAction<TableNode['id'][]>>;
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
  surfaceLevel: 1,
  disabledRows: [],
  setDisabledRows: () => {},
});

const useTableContext = (): TableContextType => {
  const context = React.useContext(TableContext);
  return context;
};

export { useTableContext, TableContext };
