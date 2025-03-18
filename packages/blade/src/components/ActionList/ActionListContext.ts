import React from 'react';

type ActionListContextType = {
  isVirtualized?: boolean;
};

const ActionListContext = React.createContext<ActionListContextType>({
  isVirtualized: false,
});
const ActionListProvider = ActionListContext.Provider;

const useActionListContext = (): ActionListContextType => {
  const context = React.useContext(ActionListContext);
  return context;
};

export { useActionListContext, ActionListProvider };
