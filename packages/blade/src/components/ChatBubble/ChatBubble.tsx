import React from "react";
import { Box } from "~components/Box";

type ChatBubbleProps = {
    message?: string;
    isLastMessage?: boolean;
    isUserMessage?: boolean;
    isLoading?: boolean;
    isError?: boolean;
    cardBody?: React.ReactNode;
    feedbackOptions?: Array<{icon: React.ReactNode, onClick: Function}>;
    ErrorText?: string;
    onErrorTextClick?: Function;
  }
const ChatBubble = ({ message, isLastMessage,isUserMessage,isLoading,isError,cardBody,feedbackOptions,ErrorText,onErrorTextClick }:ChatBubbleProps) => {
  console.log({ message, isLastMessage,isUserMessage,isLoading,isError,cardBody,feedbackOptions,ErrorText,onErrorTextClick });
    return <Box maxWidth="240px"></Box>;
};



export { ChatBubble };