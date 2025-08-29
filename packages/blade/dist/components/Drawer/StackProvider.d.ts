import { default as React } from 'react';
type AddToStackType = ({ elementId, onDismiss, }: {
    elementId: string;
    onDismiss: () => void;
}) => void;
type RemoveFromStackType = ({ elementId }: {
    elementId: string;
}) => void;
type GlobalStackStateType = {
    drawerStack: Record<string, () => void>;
    addToDrawerStack: AddToStackType;
    removeFromDrawerStack: RemoveFromStackType;
};
declare const DrawerStackProvider: ({ children }: {
    children: React.ReactNode;
}) => React.ReactElement;
declare const useDrawerStack: () => GlobalStackStateType;
export { DrawerStackProvider, useDrawerStack };
