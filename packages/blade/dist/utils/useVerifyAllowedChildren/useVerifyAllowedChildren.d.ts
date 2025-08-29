import { default as React } from 'react';
/**
 * Verify if the passed childrens are only of allowedComponents list
 */
declare const useVerifyAllowedChildren: (props: {
    children: React.ReactNode;
    componentName: string;
    allowedComponents: string[];
}) => void;
export { useVerifyAllowedChildren };
