import { default as React } from 'react';
import { TableHeaderRowProps, TableHeaderCellProps } from './types';
declare const TableHeader: ({ children, ...rest }: TableHeaderRowProps) => React.ReactElement;
declare const TableHeaderCell: ({ children, headerKey, _hasPadding, textAlign, gridColumnStart, gridColumnEnd, gridRowStart, gridRowEnd, ...rest }: TableHeaderCellProps) => React.ReactElement;
declare const TableHeaderRow: ({ children, rowDensity, ...rest }: TableHeaderRowProps) => React.ReactElement;
export { TableHeader, TableHeaderRow, TableHeaderCell };
