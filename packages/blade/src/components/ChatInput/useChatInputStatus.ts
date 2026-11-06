import React from 'react';
import type { ChatInputProps, ChatInputStatus } from './types';
import { logger } from '~utils/logger';

/**
 * Works out which request state the submit button shows. `status` wins over the deprecated
 * `isGenerating`. In development it warns when Stop or Retry is disabled because `onStop` or
 * `onSubmit` is missing. Shared by web and native so the two never drift.
 */
const useChatInputStatus = ({
  status,
  isGenerating = false,
  onStop,
  onSubmit,
}: Pick<ChatInputProps, 'status' | 'isGenerating' | 'onStop' | 'onSubmit'>): ChatInputStatus => {
  const resolvedStatus: ChatInputStatus = status ?? (isGenerating ? 'streaming' : 'ready');
  const isStopInert = resolvedStatus === 'streaming' && !onStop;

  React.useEffect(() => {
    if (isStopInert) {
      logger({
        type: 'warn',
        moduleName: 'ChatInput',
        message:
          'The Stop button is showing but `onStop` is not set, so it is disabled. Pass `onStop` to let people cancel the reply.',
      });
    }
  }, [isStopInert]);

  const isRetryInert = resolvedStatus === 'error' && !onSubmit;
  React.useEffect(() => {
    if (isRetryInert) {
      logger({
        type: 'warn',
        moduleName: 'ChatInput',
        message:
          'The Retry button is showing but `onSubmit` is not set, so it is disabled. Pass `onSubmit` to let people send again.',
      });
    }
  }, [isRetryInert]);

  return resolvedStatus;
};

export { useChatInputStatus };
