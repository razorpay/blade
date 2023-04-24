/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';

type BottomSheetStackType = {
  stack: string[];
  addBottomSheetToStack: (id: string) => void;
  removeBottomSheetFromStack: (id: string) => void;
  getTopOfTheStack: () => string | undefined;
};

const BottomSheetStackContext = React.createContext<BottomSheetStackType>({
  stack: [],
  addBottomSheetToStack: () => {},
  removeBottomSheetFromStack: () => {},
  getTopOfTheStack: () => {
    return undefined;
  },
});

type BottomSheetStackProviderType = {
  children: React.ReactNode;
};
const BottomSheetStackProvider = ({
  children,
}: BottomSheetStackProviderType): React.ReactElement => {
  const [stack, setStack] = React.useState<string[]>([]);

  const getTopOfTheStack = React.useCallback(() => {
    return stack[0];
  }, [stack]);

  const addBottomSheetToStack = React.useCallback((id: string) => {
    if (/undefined/.exec(id)) return;

    setStack((prev) => {
      const newStack = [id, ...prev];
      return newStack;
    });
  }, []);

  const removeBottomSheetFromStack = React.useCallback((id: string) => {
    if (/undefined/.exec(id)) return;

    setStack((prev) => {
      const newStack = [...prev];
      const popped = newStack.shift();
      if (popped === id) return newStack;
      return newStack;
    });
  }, []);

  const value = React.useMemo(() => {
    return { stack, addBottomSheetToStack, removeBottomSheetFromStack, getTopOfTheStack };
  }, [addBottomSheetToStack, getTopOfTheStack, removeBottomSheetFromStack, stack]);

  return (
    <BottomSheetStackContext.Provider value={value}>{children}</BottomSheetStackContext.Provider>
  );
};

const useBottomSheetStack = (): BottomSheetStackType => {
  const context = React.useContext(BottomSheetStackContext);

  return context;
};

export { BottomSheetStackProvider, useBottomSheetStack };
