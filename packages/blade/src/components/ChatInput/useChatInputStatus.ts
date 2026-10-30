import React from 'react';
import type { ChatInputProps, ChatInputStatus } from './types';
import { logger } from '~utils/logger';

/**
 * Works out which request state the submit button shows. `status` wins over the deprecated
 * `isGenerating`. In development it warns when the Stop button would do nothing because
 * `onStop` is missing. Shared by web and native so the two never drift.
 */
const useChatInputStatus = ({
  status,
  isGenerating = false,
  onStop,
}: Pick<ChatInputProps, 'status' | 'isGenerating' | 'onStop'>): ChatInputStatus => {
  const resolvedStatus: ChatInputStatus = status ?? (isGenerating ? 'streaming' : 'ready');
  const isStopInert = resolvedStatus === 'streaming' && !onStop;

  React.useEffect(() => {
    if (isStopInert) {
      logger({
        type: 'warn',
        moduleName: 'ChatInput',
        message:
          'The Stop button is showing but `onStop` is not set, so pressing it does nothing. Pass `onStop` to cancel the reply.',
      });
    }
  }, [isStopInert]);

  return resolvedStatus;
};

export { useChatInputStatus };
