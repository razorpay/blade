import React from 'react';

type ListViewContextType = {
  isInsideListView: boolean;
  /**
   * Number of columns in the ListView's table.
   * Set via `<ListView columns={N}>` and consumed by `<ListViewSkeleton>`
   * so the skeleton always matches the real table's column count automatically.
   * @default 5
   */
  columns: number;
};

const ListViewContext = React.createContext<ListViewContextType>({
  isInsideListView: false,
  columns: 5,
});
const ListViewProvider = ListViewContext.Provider;

const useListViewContext = (): ListViewContextType => {
  return React.useContext(ListViewContext);
};

export { useListViewContext, ListViewProvider };
export type { ListViewContextType };
