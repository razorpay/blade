import type React from 'react';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { DataAnalyticsAttribute, StringChildrenType, TestID } from '~utils/types';

type DefaultMessageBubbleProps = {
  children: React.ReactNode | string;
  leading?: React.ReactNode;
  isLoading?: boolean;
  onClick?: () => void;
};

type CommonChatMessageProps = {
  isLoading?: boolean;
  validationState?: 'error' | 'none';
  errorText?: string;
  onClick?: () => void;
  footerActions?: React.ReactNode;
  children?: React.ReactNode | StringChildrenType;
  SenderType?: 'self' | 'other';
  messageType?: 'default' | 'last';
  loadingText?: string;
  leading?: React.ReactNode;
} & TestID &
  StyledPropsBlade &
  DataAnalyticsAttribute;

type SelfChatMessageProps = CommonChatMessageProps & {
  senderType: 'self';
  messageType: 'default' | 'last';
  errorText?: string;
  isLoading?: undefined;
  loadingText?: undefined;
  leading?: undefined;
};

type DefaultChatMessageProps = CommonChatMessageProps & {
  senderType: 'other';
  messageType?: undefined;
  isLoading?: boolean;
  loadingText?: string;
  leading: React.ReactNode;
};

type ChatMessageProps = SelfChatMessageProps | DefaultChatMessageProps;

export type {
  CommonChatMessageProps,
  ChatMessageProps,
  DefaultMessageBubbleProps,
  SelfChatMessageProps,
  DefaultChatMessageProps,
};
