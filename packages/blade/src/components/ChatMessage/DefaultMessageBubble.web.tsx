import React from 'react';
import Rotate from './Rotate.web';
import type { CommonChatMessageProps } from './types';
import BaseBox from '~components/Box/BaseBox';

const DefaultMessageBubble = ({
  children,
  leading,
  isLoading,
  onClick,
}: Pick<
  CommonChatMessageProps,
  'children' | 'leading' | 'isLoading' | 'onClick'
>): React.ReactElement => {
  return (
    <BaseBox maxWidth="296px" onClick={onClick}>
      <BaseBox display="flex" gap="spacing.4" justifyContent="left">
        <BaseBox>
          <Rotate animate={isLoading}>{leading as React.ReactElement}</Rotate>
        </BaseBox>
        <BaseBox display="flex" alignItems="center" maxWidth="256px">
          {children}
        </BaseBox>
      </BaseBox>
    </BaseBox>
  );
};

export { DefaultMessageBubble };
