import React from 'react';

type StackActionType = (elementId: string) => void;

type GlobalStateType = {
  drawerStack: string[];
  addToDrawerStack: StackActionType;
  removeFromDrawerStack: StackActionType;
};

const GlobalState = React.createContext<GlobalStateType>({
  drawerStack: [],
  addToDrawerStack: () => {},
  removeFromDrawerStack: () => {},
});

const useStacking = (): [string[], StackActionType, StackActionType] => {
  const [stack, setStack] = React.useState<string[]>([]);

  const addToStack = (elementId: string): void => {
    if (stack.includes(elementId)) {
      return;
    }

    setStack([...stack, elementId]);
  };

  const removeFromStack = (elementId: string): void => {
    setStack(stack.filter((stackElementId) => stackElementId !== elementId));
  };

  return [stack, addToStack, removeFromStack];
};

const GlobalStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [drawerStack, addToDrawerStack, removeFromDrawerStack] = useStacking();

  const contextValue = React.useMemo<GlobalStateType>(
    () => ({
      drawerStack,
      addToDrawerStack,
      removeFromDrawerStack,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [drawerStack],
  );

  return <GlobalState.Provider value={contextValue}>{children}</GlobalState.Provider>;
};

const useGlobalState = (): GlobalStateType => {
  return React.useContext(GlobalState);
};

export { GlobalStateProvider, useGlobalState };
