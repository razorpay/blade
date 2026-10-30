import React from 'react';
import type { ChatInputProps } from './types';
import { logger } from '~utils/logger';
import type { BladeFileList } from '~components/FileUpload/types';

type ChatInputMessage = { value: string; fileList: BladeFileList };

/**
 * Calls `onSubmit`. With `clearOnSubmit`, and when `onSubmit` returns a promise, ChatInput clears
 * what was sent once it resolves, and keeps everything if it rejects so the send can be retried.
 * Without `clearOnSubmit` the return value is ignored, so existing async handlers see no change.
 * It only clears what it owns: the text when there is no `value` prop, and the files when there is
 * no `fileList` prop. Only what was sent is cleared: text typed or files added while the request
 * was in flight stay. It also remembers the last message sent, so Retry can send that same message
 * again even if the box has changed or been cleared. Shared by web and native so the two never
 * drift.
 */
const useChatInputSubmit = ({
  onSubmit,
  clearOnSubmit,
  textValue,
  files,
  setTextValue,
  setFiles,
  isTextControlled,
  isFilesControlled,
  onFilesCleared,
}: {
  onSubmit: ChatInputProps['onSubmit'];
  clearOnSubmit: boolean;
  textValue: string;
  files: BladeFileList;
  setTextValue: (updater: () => string) => void;
  setFiles: (updater: () => BladeFileList) => void;
  isTextControlled: boolean;
  isFilesControlled: boolean;
  /**
   * Web tells the product the list is now empty through `onFileChange`. Native must not: there
   * `onFileChange` means "open your file picker".
   */
  onFilesCleared?: () => void;
}): {
  submit: (args: ChatInputMessage) => void;
  lastSent: ChatInputMessage | null;
} => {
  const latestRef = React.useRef({ textValue, files });
  latestRef.current = { textValue, files };
  const isMountedRef = React.useRef(true);
  const hasWarnedNoPromiseRef = React.useRef(false);
  const [lastSent, setLastSent] = React.useState<ChatInputMessage | null>(null);

  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const submit = React.useCallback(
    ({ value, fileList }: ChatInputMessage) => {
      setLastSent({ value, fileList });
      // typed `void` so any handler fits; an async handler still returns its promise at runtime
      const result = onSubmit?.({ value, fileList }) as unknown;
      if (!clearOnSubmit) return;
      if (!result || typeof (result as Promise<unknown>).then !== 'function') {
        if (!hasWarnedNoPromiseRef.current) {
          hasWarnedNoPromiseRef.current = true;
          logger({
            type: 'warn',
            moduleName: 'ChatInput',
            message:
              '`clearOnSubmit` is set but `onSubmit` did not return a promise, so nothing was cleared. Return the promise for your send (an `async` handler does this).',
          });
        }
        return;
      }
      (result as Promise<unknown>).then(
        () => {
          if (!isMountedRef.current) return;
          if (!isTextControlled && latestRef.current.textValue === value) {
            setTextValue(() => '');
          }
          if (!isFilesControlled && fileList.length > 0 && latestRef.current.files === fileList) {
            setFiles(() => []);
            onFilesCleared?.();
          }
        },
        () => {
          // rejected: keep the text and files so the send can be retried
        },
      );
    },
    [
      onSubmit,
      clearOnSubmit,
      setTextValue,
      setFiles,
      isTextControlled,
      isFilesControlled,
      onFilesCleared,
    ],
  );

  return { submit, lastSent };
};

/**
 * Retry sends the last message again, since that is the one that failed, even if the box has been
 * cleared or edited since. Before anything has been sent (for example when the product sets
 * `status="error"` on its own), it sends what is in the box. Without `onSubmit` there is nothing
 * to call, so Retry is off.
 */
const useChatInputRetry = ({
  submit,
  lastSent,
  onSubmit,
  textValue,
  files,
  isSubmitDisabled,
}: {
  submit: (args: ChatInputMessage) => void;
  lastSent: ChatInputMessage | null;
  onSubmit: ChatInputProps['onSubmit'];
  textValue: string;
  files: BladeFileList;
  isSubmitDisabled: boolean;
}): { handleRetry: () => void; canRetry: boolean } => {
  const message = React.useMemo(
    () => lastSent ?? (isSubmitDisabled ? null : { value: textValue, fileList: files }),
    [lastSent, isSubmitDisabled, textValue, files],
  );
  const canRetry = Boolean(onSubmit) && message !== null;
  const handleRetry = React.useCallback(() => {
    if (canRetry && message) submit(message);
  }, [canRetry, message, submit]);
  return { handleRetry, canRetry };
};

export { useChatInputSubmit, useChatInputRetry };
export type { ChatInputMessage };
