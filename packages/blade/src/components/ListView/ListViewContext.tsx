import React from 'react';

type ListViewContextType = {
  isInsideListView: boolean;
};

const ListViewContext = React.createContext<ListViewContextType>({
  isInsideListView: false,
});
const ListViewProvider = ListViewContext.Provider;

const useListViewContext = (): ListViewContextType => {
  return React.useContext(ListViewContext);
};

export { useListViewContext, ListViewProvider };
export type { ListViewContextType };
