import React from 'react';
import { Pressable } from 'react-native';
import { SelfMessageBubble } from './SelfMessageBubble.native';
import { DefaultMessageBubble } from './DefaultMessageBubble.native';
import { ThumbnailPreview } from './ThumbnailPreview.native';
import type { ChatMessageProps } from './types';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getStringFromReactText } from '~utils/getStringChildren';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import type { BladeElementRef } from '~utils/types';
import { RollingText } from '~components/RollingText';

const _ChatMessage: React.ForwardRefRenderFunction<BladeElementRef, ChatMessageProps> = (
  {
    messageType = 'default',
    senderType = 'self',
    isLoading = false,
    validationState = 'none',
    errorText,
    onClick,
    footerActions,
    children,
    leading,
    loadingText,
    wordBreak = 'break-word',
    maxWidth,
    thumbnails,
    onThumbnailClick,
    reasoningTraces,
    reasoningStatus,
    reasoningTitle,
    reasoningActiveStepIndex,
    ...props
  }: ChatMessageProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  void messageType;

  const shouldWrapInText =
    typeof children === 'string' ||
    (Array.isArray(children) && children.every((child) => typeof child === 'string')) ||
    isLoading;

  const loadingContent =
    isLoading && Array.isArray(loadingText) ? <RollingText texts={loadingText} /> : loadingText;

  const finalChildren = shouldWrapInText ? (
    <Text
      color={
        isLoading
          ? Array.isArray(loadingText)
            ? 'feedback.text.positive.intense'
            : 'surface.text.gray.muted'
          : 'surface.text.gray.normal'
      }
      weight="regular"
      variant="body"
      size="medium"
      wordBreak={wordBreak}
    >
      {isLoading ? loadingContent : getStringFromReactText(children as string | string[])}
    </Text>
  ) : (
    (children as React.ReactElement)
  );

  const messageBubble =
    senderType === 'self' ? (
      <SelfMessageBubble
        validationState={validationState}
        errorText={errorText}
        children={finalChildren}
        isChildText={shouldWrapInText}
      />
    ) : (
      <DefaultMessageBubble
        children={finalChildren}
        leading={leading}
        isLoading={isLoading}
        footerActions={footerActions}
        isChildText={shouldWrapInText}
        reasoningTraces={reasoningTraces}
        reasoningStatus={reasoningStatus}
        reasoningTitle={reasoningTitle}
        reasoningActiveStepIndex={reasoningActiveStepIndex}
      />
    );

  const imagePreviewAlignment = senderType === 'self' ? 'flex-end' : 'flex-start';

  const messageContent = (
    <BaseBox ref={ref as never} display="flex" flexDirection="column" gap="spacing.3">
      {thumbnails && thumbnails.length > 0 ? (
        <BaseBox alignSelf={imagePreviewAlignment}>
          <ThumbnailPreview thumbnails={thumbnails} onThumbnailClick={onThumbnailClick} />
        </BaseBox>
      ) : null}
      <BaseBox
        {...metaAttribute({ name: MetaConstants.ChatMessage, testID: props.testID })}
        {...makeAnalyticsAttribute(props)}
        {...getStyledProps(props)}
        maxWidth={maxWidth}
      >
        {messageBubble}
      </BaseBox>
    </BaseBox>
  );

  if (onClick) {
    return <Pressable onPress={onClick}>{messageContent}</Pressable>;
  }

  return messageContent;
};

const ChatMessage = assignWithoutSideEffects(React.forwardRef(_ChatMessage), {
  displayName: 'ChatMessage',
  componentId: MetaConstants.ChatMessage,
});

export { ChatMessage };
