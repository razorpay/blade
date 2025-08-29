import { default as React } from 'react';
type TableEditableCellContextType = {
    isInsideTableEditableCell: boolean;
};
declare const TableEditableCellContext: React.Context<TableEditableCellContextType>;
declare const useTableEditableCell: () => TableEditableCellContextType;
export { TableEditableCellContext, useTableEditableCell };
