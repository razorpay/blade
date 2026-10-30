import React from 'react';
import type { ChatInputProps } from './types';
import { logger } from '~utils/logger';
import type { BladeFileList } from '~components/FileUpload/types';

/**
 * Calls `onSubmit`. With `clearOnSubmit`, and when `onSubmit` returns a promise, ChatInput clears
 * what was sent once it resolves, and keeps everything if it rejects so the send can be retried.
 * Without `clearOnSubmit` the return value is ignored, so existing async handlers see no change.
 * It only clears what it owns: the text when there is no `value` prop, and the files when there is
 * no `fileList` prop. Only what was sent is cleared: text typed or files added while the request
 * was in flight stay. Shared by web and native so the two never drift.
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
}): ((args: { value: string; fileList: BladeFileList }) => void) => {
  const latestRef = React.useRef({ textValue, files });
  latestRef.current = { textValue, files };
  const isMountedRef = React.useRef(true);
  const hasWarnedNoPromiseRef = React.useRef(false);

  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return React.useCallback(
    ({ value, fileList }: { value: string; fileList: BladeFileList }) => {
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
};

export { useChatInputSubmit };
