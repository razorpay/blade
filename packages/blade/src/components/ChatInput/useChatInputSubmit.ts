import React from 'react';
import type { ChatInputProps } from './types';
import type { BladeFileList } from '~components/FileUpload/types';

/**
 * Calls `onSubmit`. When it returns a promise, ChatInput clears what was sent once it resolves,
 * and keeps everything if it rejects so the send can be retried. Only what was sent is cleared:
 * text typed or files added while the request was in flight stay. Shared by web and native so
 * the two never drift.
 */
const useChatInputSubmit = ({
  onSubmit,
  textValue,
  files,
  setTextValue,
  setFiles,
  onFilesCleared,
}: {
  onSubmit: ChatInputProps['onSubmit'];
  textValue: string;
  files: BladeFileList;
  setTextValue: (updater: () => string) => void;
  setFiles: (updater: () => BladeFileList) => void;
  /**
   * Web tells the product the list is now empty through `onFileChange`. Native must not: there
   * `onFileChange` means "open your file picker".
   */
  onFilesCleared?: () => void;
}): ((args: { value: string; fileList: BladeFileList }) => void) => {
  const latestRef = React.useRef({ textValue, files });
  latestRef.current = { textValue, files };
  const isMountedRef = React.useRef(true);

  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return React.useCallback(
    ({ value, fileList }: { value: string; fileList: BladeFileList }) => {
      const result = onSubmit?.({ value, fileList });
      if (!result || typeof (result as Promise<void>).then !== 'function') return;
      (result as Promise<void>).then(
        () => {
          if (!isMountedRef.current) return;
          if (latestRef.current.textValue === value) {
            setTextValue(() => '');
          }
          if (fileList.length > 0 && latestRef.current.files === fileList) {
            setFiles(() => []);
            onFilesCleared?.();
          }
        },
        () => {
          // rejected: keep the text and files so the send can be retried
        },
      );
    },
    [onSubmit, setTextValue, setFiles, onFilesCleared],
  );
};

export { useChatInputSubmit };
