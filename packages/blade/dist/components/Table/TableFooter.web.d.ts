import { default as React } from 'react';
import { TableFooterProps, TableFooterRowProps, TableFooterCellProps } from './types';
declare const TableFooter: ({ children, ...rest }: TableFooterProps) => React.ReactElement;
declare const TableFooterRow: ({ children, ...rest }: TableFooterRowProps) => React.ReactElement;
declare const TableFooterCell: ({ children, textAlign, gridColumnStart, gridColumnEnd, gridRowStart, gridRowEnd, ...rest }: TableFooterCellProps) => React.ReactElement;
export { TableFooter, TableFooterRow, TableFooterCell };
