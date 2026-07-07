import React from 'react';
import Rotate from './Rotate.native';
import { ReasoningTraces } from './ReasoningTraces.native';
import type { CommonChatMessageProps } from './types';
import BaseBox from '~components/Box/BaseBox';

const DefaultMessageBubble = ({
  children,
  leading,
  isLoading,
  footerActions,
  isChildText,
  reasoningTraces,
  reasoningStatus,
  reasoningTitle,
  reasoningActiveStepIndex,
}: Pick<
  CommonChatMessageProps,
  | 'children'
  | 'leading'
  | 'isLoading'
  | 'footerActions'
  | 'reasoningTraces'
  | 'reasoningStatus'
  | 'reasoningTitle'
  | 'reasoningActiveStepIndex'
> & {
  isChildText: boolean;
}): React.ReactElement => {
  const hasReasoningTraces = reasoningTraces && reasoningTraces.length > 0;

  return (
    <BaseBox>
      <BaseBox
        display="flex"
        flexDirection="row"
        alignItems="flex-start"
        gap="spacing.4"
      >
        <BaseBox
          paddingX="spacing.1"
          paddingTop="spacing.3"
          paddingBottom="spacing.2"
          height={20}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Rotate animate={isLoading}>{leading as React.ReactElement}</Rotate>
        </BaseBox>

        <BaseBox display="flex" flexDirection="column" flex={1}>
          {hasReasoningTraces && reasoningStatus === 'loading' && isLoading && (
            <BaseBox paddingY={isChildText ? 'spacing.2' : 'spacing.0'}>{children}</BaseBox>
          )}

          {hasReasoningTraces && (
            <ReasoningTraces
              traces={reasoningTraces}
              status={reasoningStatus}
              title={reasoningTitle}
              activeStepIndex={reasoningActiveStepIndex}
            />
          )}

          {hasReasoningTraces && reasoningStatus === 'complete' && !isLoading && children && (
            <BaseBox paddingY={isChildText ? 'spacing.2' : 'spacing.0'}>{children}</BaseBox>
          )}

          {!hasReasoningTraces && children && (
            <BaseBox paddingY={isChildText ? 'spacing.2' : 'spacing.0'}>{children}</BaseBox>
          )}
        </BaseBox>
      </BaseBox>

      <BaseBox marginLeft="spacing.11">{footerActions}</BaseBox>
    </BaseBox>
  );
};

export { DefaultMessageBubble };
