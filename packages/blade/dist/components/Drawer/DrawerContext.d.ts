import { default as React } from 'react';
type DrawerContextType = {
    close: () => void;
    closeButtonRef?: React.MutableRefObject<any>;
    stackingLevel?: number;
    isExiting: boolean;
};
declare const DrawerContext: React.Context<DrawerContextType>;
export { DrawerContext };
