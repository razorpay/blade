import { default as React } from 'react';
import { TableToolbarProps, TableToolbarActionsProps } from './types';
declare const TableToolbarActions: ({ children, ...rest }: TableToolbarActionsProps) => React.ReactElement;
declare const TableToolbar: ({ children, title, selectedTitle: controlledSelectedTitle, }: TableToolbarProps) => React.ReactElement;
export { TableToolbar, TableToolbarActions };
