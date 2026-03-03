import React from 'react';
import Rotate from './Rotate.web';
import { ReasoningTraces } from './ReasoningTraces.web';
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
        display="grid"
        gridTemplateColumns="auto 1fr"
        columnGap="spacing.4"
        alignItems="start"
      >
        {/* Icon aligns with message content */}
        <BaseBox padding="spacing.2">
          <Rotate animate={isLoading}>{leading as React.ReactElement}</Rotate>
        </BaseBox>

        {/* Column 2: Main message content + ReasoningTraces */}
        <BaseBox display="flex" flexDirection="column">
          {/* While loading: show loadingText above traces (only if reasoning is still loading) */}
          {hasReasoningTraces && reasoningStatus === 'loading' && isLoading && (
            <BaseBox paddingY={isChildText ? 'spacing.2' : 'spacing.0'}>{children}</BaseBox>
          )}

          {/* ReasoningTraces: shown while loading or when complete */}
          {hasReasoningTraces && (
            <ReasoningTraces
              traces={reasoningTraces}
              status={reasoningStatus}
              title={reasoningTitle}
              activeStepIndex={reasoningActiveStepIndex}
            />
          )}

          {/* When complete: show final content below reasoning (only if not loading) */}
          {hasReasoningTraces && reasoningStatus === 'complete' && !isLoading && children && (
            <BaseBox paddingY={isChildText ? 'spacing.2' : 'spacing.0'}>{children}</BaseBox>
          )}

          {/* No reasoning traces: show content normally */}
          {!hasReasoningTraces && children && (
            <BaseBox paddingY={isChildText ? 'spacing.2' : 'spacing.0'}>{children}</BaseBox>
          )}
        </BaseBox>

        <BaseBox gridColumn="2">{footerActions}</BaseBox>
      </BaseBox>
    </BaseBox>
  );
};

export { DefaultMessageBubble };
