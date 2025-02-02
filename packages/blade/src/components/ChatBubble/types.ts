import type React from 'react';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { DataAnalyticsAttribute, StringChildrenType, TestID } from '~utils/types';

type ChatBubbleProps = {
  messageType?: 'last' | 'default';
  senderType?: 'self' | 'other';
  isLoading?: boolean;
  validationState?: 'error' | 'none';
  errorText?: string;
  onClick?: () => void;
  footerActions?: React.ReactNode;
  children?: React.ReactNode | StringChildrenType;
  leading?: React.ReactNode;
  loadingText?: string;
} & TestID &
  StyledPropsBlade &
  DataAnalyticsAttribute;
type DefaultMessageBubbleProps = {
  children: React.ReactNode | string;
  leading?: React.ReactNode;
  isLoading?: boolean;
  onClick?: () => void;
};

type SelfMessageBubbleProps = {
  children: React.ReactNode | string;
  isError?: boolean;
  errorText?: string;
  onClick?: () => void;
  messageType: 'last' | 'default';
};

export type { ChatBubbleProps, DefaultMessageBubbleProps, SelfMessageBubbleProps };
