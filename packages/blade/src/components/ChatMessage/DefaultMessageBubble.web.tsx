import React from 'react';
import Rotate from './Rotate.web';
import type { CommonChatMessageProps } from './types';
import BaseBox from '~components/Box/BaseBox';

const DefaultMessageBubble = ({
  children,
  leading,
  isLoading,
}: Pick<CommonChatMessageProps, 'children' | 'leading' | 'isLoading'>): React.ReactElement => {
  return (
    <BaseBox>
      <BaseBox display="flex" gap="spacing.4" justifyContent="left">
        <BaseBox>
          <Rotate animate={isLoading}>{leading as React.ReactElement}</Rotate>
        </BaseBox>
        <BaseBox display="flex" alignItems="center">
          {children}
        </BaseBox>
      </BaseBox>
    </BaseBox>
  );
};

export { DefaultMessageBubble };
