import React from 'react';
import Rotate from './Rotate.web';
import type { CommonChatMessageProps } from './types';
import BaseBox from '~components/Box/BaseBox';

const DefaultMessageBubble = ({
  children,
  leading,
  isLoading,
  footerActions,
  isChildText,
}: Pick<CommonChatMessageProps, 'children' | 'leading' | 'isLoading' | 'footerActions'> & {
  isChildText: boolean;
}): React.ReactElement => {
  return (
    <BaseBox>
      <BaseBox
        display="grid"
        gridTemplateColumns="auto 1fr"
        gridTemplateRows="auto auto"
        columnGap="spacing.4"
      >
        <BaseBox padding="spacing.2">
          <Rotate animate={isLoading}>{leading as React.ReactElement}</Rotate>
        </BaseBox>

        <BaseBox
          display="flex"
          alignItems="center"
          paddingY={isChildText ? 'spacing.2' : 'spacing.0'}
        >
          {children}
        </BaseBox>

        <BaseBox gridColumn="2">{footerActions}</BaseBox>
      </BaseBox>
    </BaseBox>
  );
};

export { DefaultMessageBubble };
