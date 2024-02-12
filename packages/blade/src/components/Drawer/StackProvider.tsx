import React from 'react';

type StackActionType = (elementId: string) => void;

type GlobalStackStateType = {
  drawerStack: string[];
  addToDrawerStack: StackActionType;
  removeFromDrawerStack: StackActionType;
};

const StackingContext = React.createContext<GlobalStackStateType>({
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

const DrawerStackProvider = ({ children }: { children: React.ReactNode }) => {
  const [drawerStack, addToDrawerStack, removeFromDrawerStack] = useStacking();

  const contextValue = React.useMemo<GlobalStackStateType>(
    () => ({
      drawerStack,
      addToDrawerStack,
      removeFromDrawerStack,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [drawerStack],
  );

  return <StackingContext.Provider value={contextValue}>{children}</StackingContext.Provider>;
};

const useDrawerStack = (): GlobalStackStateType => {
  return React.useContext(StackingContext);
};

export { DrawerStackProvider, useDrawerStack };
