import { default as React } from 'react';
import { ToastProps } from './types';
declare const Toast: ({ type, color, leading, action, content, onDismissButtonClick, isVisible, id, }: ToastProps & {
    isVisible?: boolean | undefined;
}) => React.ReactElement;
export { Toast };
