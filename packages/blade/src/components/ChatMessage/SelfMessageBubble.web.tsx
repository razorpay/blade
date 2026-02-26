import React from 'react';
import type { CommonChatMessageProps } from './types';
import { chatMessageToken } from './token';
import { colors as globalColors } from '~tokens/global';
import { useTheme } from '~utils';
import BaseBox from '~components/Box/BaseBox';
import { FormHint } from '~components/Form/FormHint';

const SelfMessageBubble = ({
  children,
  validationState,
  errorText = 'Message not sent. Tap to retry.',
  isChildText,
}: Pick<CommonChatMessageProps, 'children' | 'validationState' | 'errorText'> & {
  // is child is text then only add padding otherwise no need to add padding
  isChildText: boolean;
}): React.ReactElement => {
  const isError = validationState === 'error';
  const { colorScheme } = useTheme();
  const boxShadowColor =
    colorScheme === 'light'
      ? globalColors.neutral.blueGrayLight.a906
      : globalColors.neutral.black[50];

  return (
    <BaseBox display="flex" flexDirection="column">
      <BaseBox
        backgroundColor={chatMessageToken.self.backgroundColor.default}
        padding={isChildText ? 'spacing.5' : 'spacing.0'}
        borderRadius="large"
        width="fit-content"
        height="auto"
        alignSelf="flex-end"
        border="thin"
        borderColor="surface.border.gray.muted"
        style={{
          boxShadow: `0px 0.5px 4px 0px ${boxShadowColor}`,
        }}
      >
        {children}
      </BaseBox>
      <BaseBox alignSelf="flex-end">
        {isError && <FormHint type="error" errorText={errorText} size="small" />}
      </BaseBox>
    </BaseBox>
  );
};

export { SelfMessageBubble };
