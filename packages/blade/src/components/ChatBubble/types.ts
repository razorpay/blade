import type React from 'react';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { DataAnalyticsAttribute, StringChildrenType, TestID } from '~utils/types';

type CommonChatBubbleProps = {
  isLoading?: boolean;
  validationState?: 'error' | 'none';
  errorText?: string;
  onClick?: () => void;
  footerActions?: React.ReactNode;
  children?: React.ReactNode | StringChildrenType;
} & TestID &
  StyledPropsBlade &
  DataAnalyticsAttribute;

type DefaultMessageBubbleProps = {
  children: React.ReactNode | string;
  leading?: React.ReactNode;
  isLoading?: boolean;
  onClick?: () => void;
};

type SenderChatBubbleProps = CommonChatBubbleProps & {
  senderType: 'self';
  messageType: 'default' | 'last';
  errorText?: string;
  isLoading?: undefined;
  loadingText?: undefined;
  leading?: undefined;
};

type OtherChatBubbleProps = CommonChatBubbleProps & {
  senderType: 'other';
  messageType?: undefined;
  isLoading?: boolean;
  loadingText?: string;
  leading: React.ReactNode;
};

type ChatBubbleProps = SenderChatBubbleProps | OtherChatBubbleProps;

export type { ChatBubbleProps, DefaultMessageBubbleProps };
