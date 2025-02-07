import type React from 'react';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { BaseTextProps } from '~components/Typography/BaseText/types';

type DefaultMessageBubbleProps = {
  children: React.ReactNode | string;
  leading?: React.ReactNode;
  isLoading?: boolean;
  onClick?: () => void;
};

type CommonChatMessageProps = {
  /**
   * isLoading prop is used to show loading state in chat message. it will add loading styles and animation to chat message.
   * works only when senderType is other.
   * */
  isLoading?: boolean;
  /**
   * validationState prop is used to show error state in chat message. it will add error styles to chat message.
   * works only when senderType is self.
   * */
  validationState?: 'error' | 'none';
  /**
   * errorText prop is used to show error text in chat message. it will show error text below the chat message.
   * works only when senderType is self.
   * */
  errorText?: string;
  /**
   * onClick prop is used to handle click event on chat message.
   * */
  onClick?: () => void;
  /**
   * footerActions prop is used to show actions in chat message. it will show actions below the chat message.
   * works only when senderType is self.
   * */
  footerActions?: React.ReactNode;
  /**
   * children prop is used to show content in chat message.
   * can be string or react node.
   * */
  children?: React.ReactNode;
  /**
   * SenderType prop is used to show chat message as self or other.
   * self: chat message will be shown as self. you can show error state and footer actions.
   * other: chat message will be shown as other. you can show loading state and leading icon.
   */
  senderType?: 'self' | 'other';
  /**
   * messageType prop is used to show chat message as default or last.
   * default: chat message will be shown as default.
   * last: chat message will be shown as last. it will remove border radius from bottom right.
   * messageType prop is only works when senderType is self.
   */
  messageType?: 'default' | 'last';
  /**
   * loadingText prop is used to show loading text in chat message. it will show loading text below the chat message.
   * works only when senderType is other.
   * */
  loadingText?: string;
  /**
   * leading prop is used to show leading icon in chat message. it will show leading icon left side of chat message.
   * works only when senderType is other.
   * leading will be animated when isLoading is true.
   * */
  leading?: React.ReactNode;
  /**
   * maxWidth prop is used to set max width of chat message.
   */
  maxWidth?: BaseBoxProps['maxWidth'];
  /**
   * wordBreak prop is used to set word break of chat message.
   *
   * *this will only work when children is string*
   */
  wordBreak?: BaseTextProps['wordBreak'];
} & TestID &
  StyledPropsBlade &
  DataAnalyticsAttribute;

type SelfChatMessageProps = CommonChatMessageProps & {
  senderType: 'self' | 'other';
  messageType?: 'default' | 'last';
  errorText?: string;
  isLoading?: boolean;
  loadingText?: string;
  leading?: undefined;
};

type DefaultChatMessageProps = CommonChatMessageProps & {
  senderType: 'self' | 'other';
  messageType?: 'default' | 'last';
  isLoading?: boolean;
  loadingText?: string;
};

type ChatMessageProps = SelfChatMessageProps | DefaultChatMessageProps;

export type {
  CommonChatMessageProps,
  ChatMessageProps,
  DefaultMessageBubbleProps,
  SelfChatMessageProps,
  DefaultChatMessageProps,
};
