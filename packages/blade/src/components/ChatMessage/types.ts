import type React from 'react';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';
import type { BaseTextProps } from '~components/Typography/BaseText/types';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import type { StyledPropsBlade } from '~components/Box/styledProps';

type DefaultMessageBubbleProps = {
  children: React.ReactNode | string;
  leading?: React.ReactNode;
  isLoading?: boolean;
  onClick?: () => void;
  thumbnails?: ThumbnailItem[];
};

type ThumbnailItem = {
  id?: string;
  url: string;
  alt?: string;
};

type ThumbnailPreviewProps = {
  thumbnails: ThumbnailItem[];
  onThumbnailClick?: () => void;
};

type ResolvedThumbnailItem = {
  id: string;
  url: string;
  alt: string;
  originalIndex: number;
  originalThumbnail: ThumbnailItem;
};

type ReasoningTrace = {
  /** Text shown while the step is active or pending. */
  label: string;
  /** Text shown once the step is completed. Falls back to `label` if omitted. */
  completedLabel?: string;
};

type ReasoningTracesProps = {
  /**
   * Array of reasoning trace steps to display. Each item can be a plain string
   * or an object with `label` (active text) and an optional `completedLabel`
   * (text shown once the step is done).
   */
  traces: ReasoningTrace[];
  /**
   * Status of the reasoning process.
   * - `'loading'`: traces are in progress; the active step is animated.
   * - `'complete'`: all traces are done; the panel auto-collapses.
   *
   * @default 'loading'
   */
  status?: 'loading' | 'complete';
  /**
   * Title shown in the collapsible header.
   *
   * @default 'Planning...'
   */
  title?: string;
  /**
   * When all steps are known upfront, use this to mark which step is currently
   * active (0-based index). Steps before it are shown as completed (green),
   * the step at this index is shown as active (spinning icon), and steps after
   * it are shown as pending (gray, dimmed).
   *
   * When omitted, the component falls back to the streaming mode where steps
   * are added one-by-one and the last item in `traces` is treated as active.
   */
  activeStepIndex?: number;
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
   *
   * @deprecated This prop is no longer used by `ChatMessage` and will be removed in a future release.
   */
  messageType?: 'default' | 'last';
  /**
   * loadingText prop is used to show loading text in chat message. it will show loading text below the chat message.
   * works only when senderType is other.
   *
   * When an array of strings is provided, the texts will animate as a rolling marquee,
   * cycling through each string with a vertical slide transition.
   * */
  loadingText?: string | string[];
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
  /**
   * thumbnails prop is used to show image previews in chat message.
   * Accepts an array of thumbnail objects.
   */
  thumbnails?: ThumbnailItem[];
  /**
   * onThumbnailClick is called when the image preview is clicked.
   */
  onThumbnailClick?: () => void;
  /**
   * Reasoning traces to display above the message content.
   * When provided, renders an animated collapsible panel showing the AI's reasoning steps.
   *
   * - While `reasoningStatus` is `'loading'`, the last step is highlighted as active.
   * - When `reasoningStatus` changes to `'complete'`, the panel auto-collapses.
   * - The user can manually expand/collapse the panel afterwards.
   *
   * Only works when `senderType` is `'other'`.
   */
  reasoningTraces?: ReasoningTrace[];
  /**
   * Controls the state of the reasoning traces panel.
   * - `'loading'`: Traces are streaming in; the panel is open and animated.
   * - `'complete'`: All traces are done; the panel auto-collapses.
   *
   * @default 'loading'
   */
  reasoningStatus?: 'loading' | 'complete';
  /**
   * Title text shown in the reasoning traces header.
   *
   * @default 'Explored'
   */
  reasoningTitle?: string;
  /**
   * When all reasoning steps are known upfront, set this to the index of the
   * step currently being processed (0-based). Steps before it are completed
   * (green), the step at this index is active (spinning), and steps after are
   * pending (dimmed).
   *
   * When omitted, the component uses streaming mode where steps are added
   * one-by-one and the last item in `reasoningTraces` is the active step.
   */
  reasoningActiveStepIndex?: number;
} & TestID &
  StyledPropsBlade &
  DataAnalyticsAttribute;

type SelfChatMessageProps = CommonChatMessageProps & {
  senderType: 'self' | 'other';
  messageType?: 'default' | 'last';
  errorText?: string;
  isLoading?: boolean;
  loadingText?: string | string[];
  leading?: undefined;
};

type DefaultChatMessageProps = CommonChatMessageProps & {
  senderType: 'self' | 'other';
  messageType?: 'default' | 'last';
  isLoading?: boolean;
  loadingText?: string | string[];
};

type ChatMessageProps = SelfChatMessageProps | DefaultChatMessageProps;

export type {
  ThumbnailItem,
  ThumbnailPreviewProps,
  ResolvedThumbnailItem,
  CommonChatMessageProps,
  ChatMessageProps,
  DefaultMessageBubbleProps,
  SelfChatMessageProps,
  DefaultChatMessageProps,
  ReasoningTrace,
  ReasoningTracesProps,
};
