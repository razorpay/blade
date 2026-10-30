import React from 'react';
import { ChatInputSendSlot } from './ChatInputSendSlot';
import type { ChatInputStatus } from './types';
import BaseButton from '~components/Button/BaseButton';
import { ArrowUpIcon, RotateCounterClockWiseIcon, StopCircleIcon } from '~components/Icons';

type ChatInputSubmitProps = {
  status: ChatInputStatus;
  /**
   * Whether there is text or a file to send. Send only shows when there is.
   */
  hasContent: boolean;
  isSubmitDisabled: boolean;
  isDisabled: boolean;
  /**
   * `small` (32 px) in the toolbar, `xsmall` (28 px) inline in the compact size
   */
  size: 'small' | 'xsmall';
  onSubmit: () => void;
  onStop?: () => void;
};

/**
 * The button at the end of ChatInput, by `status`: Send, a loader, Stop or Retry.
 * The accessible names "Submit" and "Stop generation" are the ones ChatInput has always used.
 */
const ChatInputSubmit = ({
  status,
  hasContent,
  isSubmitDisabled,
  isDisabled,
  size,
  onSubmit,
  onStop,
}: ChatInputSubmitProps): React.ReactElement => {
  if (status === 'streaming') {
    return (
      <BaseButton
        variant="primary"
        color="neutral"
        size={size}
        icon={StopCircleIcon}
        accessibilityProps={{ label: 'Stop generation' }}
        onClick={() => onStop?.()}
      />
    );
  }

  if (status === 'submitted') {
    return (
      <BaseButton
        variant="primary"
        color="neutral"
        size={size}
        icon={ArrowUpIcon}
        accessibilityProps={{ label: 'Sending' }}
        isLoading
      />
    );
  }

  if (status === 'error') {
    return (
      <BaseButton
        variant="secondary"
        color="negative"
        size={size}
        icon={RotateCounterClockWiseIcon}
        accessibilityProps={{ label: 'Retry' }}
        onClick={onSubmit}
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        isDisabled={isSubmitDisabled || isDisabled}
      />
    );
  }

  return (
    <ChatInputSendSlot isVisible={hasContent && !isDisabled}>
      <BaseButton
        variant="primary"
        color="neutral"
        size={size}
        icon={ArrowUpIcon}
        accessibilityProps={{ label: 'Submit' }}
        onClick={onSubmit}
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        isDisabled={isSubmitDisabled || isDisabled}
      />
    </ChatInputSendSlot>
  );
};

export { ChatInputSubmit };
export type { ChatInputSubmitProps };
