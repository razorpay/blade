import React from 'react';
import Rotate from './Rotate';
import BaseBox from '~components/Box/BaseBox';

const ResponseMessageBubble = ({
  children,
  loadingText,
  leading,
  isLoading,
  onClick,
}: {
  children: React.ReactNode | string;
  loadingText?: string;
  leading?: React.ReactNode;
  isLoading?: boolean;
  onClick?: () => void;
}): React.ReactElement => {
  return (
    <BaseBox maxWidth="296px" onClick={onClick}>
      <BaseBox display="flex" gap="spacing.4" justifyContent="left">
        <BaseBox>
          <Rotate animate={isLoading}>{leading}</Rotate>
        </BaseBox>
        <BaseBox display="flex" alignItems="center" maxWidth="256px">
          {children}
        </BaseBox>
      </BaseBox>
    </BaseBox>
  );
};

export { ResponseMessageBubble };
