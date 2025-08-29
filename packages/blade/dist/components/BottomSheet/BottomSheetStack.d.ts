import { default as React } from 'react';
type BottomSheetStackType = {
    stack: string[];
    addBottomSheetToStack: (id: string) => void;
    removeBottomSheetFromStack: (id: string) => void;
    getTopOfTheStack: () => string | null;
    getCurrentStackIndexById: (id: string) => number;
};
type BottomSheetStackProviderType = {
    children: React.ReactNode;
};
declare const BottomSheetStackProvider: ({ children, }: BottomSheetStackProviderType) => React.ReactElement;
declare const useBottomSheetStack: () => BottomSheetStackType;
export { BottomSheetStackProvider, useBottomSheetStack };
