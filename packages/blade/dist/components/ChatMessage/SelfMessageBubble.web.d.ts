import { default as React } from 'react';
import { CommonChatMessageProps } from './types';
declare const SelfMessageBubble: ({ children, validationState, errorText, messageType, isChildText, }: Pick<CommonChatMessageProps, "children" | "validationState" | "errorText" | "messageType"> & {
    isChildText: boolean;
}) => React.ReactElement;
export { SelfMessageBubble };
