import React from 'react';

type AddToStackType = ({
  elementId,
  onDismiss,
}: {
  elementId: string;
  onDismiss: () => void;
}) => void;

type RemoveFromStackType = ({ elementId }: { elementId: string }) => void;

type GlobalStackStateType = {
  drawerStack: Record<string, () => void>;
  addToDrawerStack: AddToStackType;
  removeFromDrawerStack: RemoveFromStackType;
};

const StackingContext = React.createContext<GlobalStackStateType>({
  drawerStack: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  addToDrawerStack: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  removeFromDrawerStack: () => {},
});

const useStacking = (): [
  GlobalStackStateType['drawerStack'],
  AddToStackType,
  RemoveFromStackType,
] => {
  const [stack, setStack] = React.useState<GlobalStackStateType['drawerStack']>({});

  const addToStack: AddToStackType = ({ elementId, onDismiss }) => {
    setStack((prevStack) => {
      if (prevStack[elementId]) {
        return prevStack;
      }
      return { ...prevStack, [elementId]: onDismiss };
    });
  };

  const removeFromStack: RemoveFromStackType = ({ elementId }) => {
    setStack((prevStack) => {
      const { [elementId]: _, ...newStack } = prevStack;
      return newStack;
    });
  };

  return [stack, addToStack, removeFromStack];
};

const DrawerStackProvider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
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

export { DrawerStackProvider, useDrawerStack, StackingContext };
