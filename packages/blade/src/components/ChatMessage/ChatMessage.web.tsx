import React from 'react';
import styled from 'styled-components';
import { SelfMessageBubble } from './SelfMessageBubble.web';
import { DefaultMessageBubble } from './DefaultMessageBubble.web';
import type { ChatMessageProps } from './types';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';
import { getStringFromReactText } from '~utils/getStringChildren';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import type { BladeElementRef } from '~utils/types';
import { MetaConstants } from '~utils/metaAttribute';

// reset button css
const ChatMessageButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: inherit;
  font: inherit;
  text-align: inherit;
  outline: inherit;
  appearance: none;
`;

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
    ...props
  }: ChatMessageProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  // since we can pass both string and Card component as children, we need to check if children is string or Card component
  // if children is string or array of string, we need to wrap it in Text component otherwise we will pass children as it is
  const shouldWrapInText =
    typeof children === 'string' ||
    (Array.isArray(children) && children.every((child) => typeof child === 'string')) ||
    isLoading;

  const finalChildren = shouldWrapInText ? (
    <Text
      color={isLoading ? 'surface.text.gray.muted' : 'surface.text.gray.normal'}
      weight="regular"
      variant="body"
      size="medium"
    >
      {isLoading ? loadingText : getStringFromReactText(children as string | string[])}
    </Text>
  ) : (
    (children as React.ReactElement)
  );

  return (
    <BaseBox
      onClick={onClick}
      {...(onClick ? { ...ButtonResetCss } : {})}
      {...props}
      ref={ref as never}
      as={onClick ? 'button' : undefined}
    >
      {senderType === 'self' ? (
        <SelfMessageBubble
          validationState={validationState}
          errorText={errorText}
          children={finalChildren}
          messageType={messageType}
          isChildText={shouldWrapInText}
        />
      ) : (
        <DefaultMessageBubble children={finalChildren} leading={leading} isLoading={isLoading} />
      )}
      {footerActions}
    </BaseBox>
  );
};

const ChatMessage = assignWithoutSideEffects(React.forwardRef(_ChatMessage), {
  displayName: 'ChatMessage',
  componentId: MetaConstants.ChatMessage,
});
export { ChatMessage };
