import React from 'react';
import { SelfMessageBubble } from './SelfMessageBubble.web';
import { DefaultMessageBubble } from './DefaultMessageBubble.web';
import type { ChatMessageProps } from './types';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';
import { getStringFromReactText } from '~utils/getStringChildren';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import type { BladeElementRef } from '~utils/types';

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
  const childrenToRender = (): React.ReactElement => {
    // their can be a case where childrens are passed like  "{' '} some text" so we need to check if children is string or not
    const shouldWrapInText =
      typeof children === 'string' ||
      (Array.isArray(children) && children.every((child) => typeof child === 'string')) ||
      isLoading;
    if (shouldWrapInText) {
      return (
        <Text
          color={isLoading ? 'surface.text.gray.muted' : 'surface.text.gray.normal'}
          weight="regular"
          variant="body"
          size="medium"
        >
          {isLoading ? loadingText : getStringFromReactText(children as string | string[])}
        </Text>
      );
    }
    return children as React.ReactElement;
  };

  return (
    <BaseBox {...props} ref={ref as never}>
      {senderType === 'self' ? (
        <SelfMessageBubble
          validationState={validationState}
          onClick={onClick}
          errorText={errorText}
          children={childrenToRender()}
          messageType={messageType}
        />
      ) : (
        <DefaultMessageBubble
          children={childrenToRender()}
          leading={leading}
          onClick={onClick}
          isLoading={isLoading}
        />
      )}
      {footerActions}
    </BaseBox>
  );
};

const ChatMessage = assignWithoutSideEffects(React.forwardRef(_ChatMessage), {
  displayName: 'ChatMessage',
  componentId: 'ChatMessage',
});
export { ChatMessage };
