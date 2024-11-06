/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';

type BottomSheetStackType = {
  stack: string[];
  addBottomSheetToStack: (id: string) => void;
  removeBottomSheetFromStack: (id: string) => void;
  getTopOfTheStack: () => string | null;
  getCurrentStackIndexById: (id: string) => number;
};

const BottomSheetStackContext = React.createContext<BottomSheetStackType>({
  stack: [],
  addBottomSheetToStack: () => {},
  removeBottomSheetFromStack: () => {},
  getTopOfTheStack: () => {
    return null;
  },
  getCurrentStackIndexById: () => -1,
});

type BottomSheetStackProviderType = {
  children: React.ReactNode;
};
const BottomSheetStackProvider = ({
  children,
}: BottomSheetStackProviderType): React.ReactElement => {
  const [stack, setStack] = React.useState<string[]>([]);

  const getTopOfTheStack = React.useCallback(() => {
    return stack[0] || null;
  }, [stack]);

  const addBottomSheetToStack = React.useCallback((id?: string) => {
    // id can be undefined since useId returns `undefined` on first render,
    // if we push undefined to the stack the `removeBottomSheetFromStack` will break
    // since it will try to match top of the stack with undefined
    if (id === undefined) return;
    setStack((prev) => [id, ...prev]);
  }, []);

  const removeBottomSheetFromStack = React.useCallback((id: string) => {
    setStack((prev) => {
      const newStack = [...prev];
      const popped = newStack.shift();
      // only pop the stack if the passed in id is matched to the top of the stack
      if (popped === id) return newStack;
      return newStack;
    });
  }, []);

  const getCurrentStackIndexById = React.useCallback(
    (id: string) => {
      return stack.findIndex((stackId) => stackId === id);
    },
    [stack],
  );

  const value = React.useMemo(() => {
    return {
      stack,
      addBottomSheetToStack,
      removeBottomSheetFromStack,
      getTopOfTheStack,
      getCurrentStackIndexById,
    };
  }, [
    addBottomSheetToStack,
    getCurrentStackIndexById,
    getTopOfTheStack,
    removeBottomSheetFromStack,
    stack,
  ]);

  return (
    <BottomSheetStackContext.Provider value={value}>{children}</BottomSheetStackContext.Provider>
  );
};

const useBottomSheetStack = (): BottomSheetStackType => {
  const context = React.useContext(BottomSheetStackContext);

  return context;
};

export { BottomSheetStackProvider, useBottomSheetStack };
