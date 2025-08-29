import { default as React } from 'react';
import { CommonChatMessageProps } from './types';
declare const DefaultMessageBubble: ({ children, leading, isLoading, footerActions, isChildText, }: Pick<CommonChatMessageProps, "children" | "leading" | "isLoading" | "footerActions"> & {
    isChildText: boolean;
}) => React.ReactElement;
export { DefaultMessageBubble };
