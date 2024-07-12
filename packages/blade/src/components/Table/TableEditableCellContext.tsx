import React from 'react';

const TableEditableCellContext = React.createContext<{ isInsideTableEditableCell: boolean }>({
  isInsideTableEditableCell: false,
});

const useTableEditableCell = () => {
  const contextValue = React.useContext(TableEditableCellContext);
  return contextValue;
};

export { TableEditableCellContext, useTableEditableCell };
