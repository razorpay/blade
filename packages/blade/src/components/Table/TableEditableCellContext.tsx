import React from 'react';

type TableEditableCellContextType = {
  isInsideTableEditableCell: boolean;
};

const TableEditableCellContext = React.createContext<TableEditableCellContextType>({
  isInsideTableEditableCell: false,
});

const useTableEditableCell = (): TableEditableCellContextType => {
  const contextValue = React.useContext(TableEditableCellContext);
  return contextValue;
};

export { TableEditableCellContext, useTableEditableCell };
