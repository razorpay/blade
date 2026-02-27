import React from 'react';
import { SelfMessageBubble } from './SelfMessageBubble.web';
import { DefaultMessageBubble } from './DefaultMessageBubble.web';
import type { ChatMessageProps } from './types';
import { ThumbnailPreview } from './ThumbnailPreview.web';
import { RollingText } from '~components/RollingText';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getStringFromReactText } from '~utils/getStringChildren';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import type { BladeElementRef } from '~utils/types';

const ButtonResetCss = {
  background: 'none',
  border: 'none',
  padding: undefined,
  cursor: 'pointer',
  color: 'inherit',
  font: 'inherit',
  textAlign: 'left' as const,
  outline: 'inherit',
  appearance: 'none',
  backgroundColor: 'inherit',
};

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
    ...props
  }: ChatMessageProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  // Keep deprecated prop "used" to avoid lint errors while preserving compatibility.
  void messageType;

  // since we can pass both string and Card component as children, we need to check if children is string or Card component
  // if children is string or array of string, we need to wrap it in Text component otherwise we will pass children as it is
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
      />
    );

  const imagePreviewAlignment = senderType === 'self' ? 'flex-end' : 'flex-start';

  return (
    <BaseBox display="flex" flexDirection="column" gap="spacing.3">
      {thumbnails && thumbnails.length > 0 ? (
        <BaseBox alignSelf={imagePreviewAlignment}>
          <ThumbnailPreview thumbnails={thumbnails} onThumbnailClick={onThumbnailClick} />
        </BaseBox>
      ) : null}
      <BaseBox
        onClick={onClick}
        {...(onClick ? { ...ButtonResetCss } : {})}
        {...metaAttribute({ name: MetaConstants.ChatMessage, testID: props.testID })}
        {...makeAnalyticsAttribute(props)}
        {...getStyledProps(props)}
        maxWidth={maxWidth}
        ref={ref as never}
        as={onClick ? 'button' : undefined}
      >
        {messageBubble}
      </BaseBox>
    </BaseBox>
  );
};

const ChatMessage = assignWithoutSideEffects(React.forwardRef(_ChatMessage), {
  displayName: 'ChatMessage',
  componentId: MetaConstants.ChatMessage,
});
export { ChatMessage };
