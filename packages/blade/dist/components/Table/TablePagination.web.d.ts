import { default as React } from 'react';
import { TablePaginationProps } from './types';
declare const TablePagination: ({ currentPage: controlledCurrentPage, onPageChange, onPageSizeChange, defaultPageSize, showPageSizePicker, showPageNumberSelector, showLabel, label, totalItemCount, paginationType, ...rest }: TablePaginationProps) => React.ReactElement;
export { TablePagination };
