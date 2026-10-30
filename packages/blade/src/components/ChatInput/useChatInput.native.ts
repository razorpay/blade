import React from 'react';
import type { ChatInputProps, ChatInputStatus } from './types';
import type { BladeElementRef } from '~utils/types';
import type { BladeFile, BladeFileList } from '~components/FileUpload/types';
import { generateFileId } from '~components/FileUpload/generateFileId';
import { useControllableState } from '~utils/useControllable';
import { useMergeRefs } from '~utils/useMergeRefs';
import { getChatInputSubmitDisabled } from './getChatInputSubmitDisabled';

type UseChatInputProps = Pick<
  ChatInputProps,
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'onSubmit'
  | 'fileList'
  | 'onFileChange'
  | 'onFileRemove'
  | 'onFileDismiss'
  | 'status'
  | 'isGenerating'
>;

const useChatInput = (
  {
    value: controlledValue,
    defaultValue,
    onChange,
    onSubmit,
    fileList: controlledFileList,
    onFileChange,
    onFileRemove,
    onFileDismiss,
    status,
    isGenerating = false,
  }: UseChatInputProps,
  ref: React.ForwardedRef<BladeElementRef>,
): {
  mergedRef: React.RefCallback<BladeElementRef>;
  textValue: string;
  files: BladeFileList;
  hasFiles: boolean;
  hasContent: boolean;
  isSubmitDisabled: boolean;
  resolvedStatus: ChatInputStatus;
  handleTextChange: (args: { name?: string; value?: string }) => void;
  handleSubmit: () => void;
  handleFileRemove: (file: BladeFile) => void;
  handleFileDismiss: (file: BladeFile) => void;
} => {
  const inputRef = React.useRef<BladeElementRef>(null);
  const mergedRef = useMergeRefs(ref, inputRef);
  const isMountedRef = React.useRef(true);

  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const [textValue, setTextValue] = useControllableState({
    value: controlledValue,
    defaultValue: defaultValue ?? '',
    onChange: (newValue) => {
      onChange?.({ value: newValue });
    },
  });

  const [rawFiles, setFiles] = useControllableState<BladeFileList>({
    value: controlledFileList,
    defaultValue: controlledFileList ?? [],
  });

  // Derive a new array with stable IDs assigned — never mutates the consumer's file objects.
  const files = React.useMemo<BladeFileList>(
    () => rawFiles.map((file) => (file.id ? file : { ...file, id: generateFileId() })),
    [rawFiles],
  );

  const hasFiles = files.length > 0;
  const hasContent = textValue.trim().length > 0 || hasFiles;
  const isSubmitDisabled = getChatInputSubmitDisabled(textValue, files);
  const resolvedStatus: ChatInputStatus = status ?? (isGenerating ? 'streaming' : 'ready');

  const handleTextChange = React.useCallback(
    ({ value: newValue }: { name?: string; value?: string }) => {
      setTextValue(() => newValue ?? '');
    },
    [setTextValue],
  );

  const handleSubmit = React.useCallback(() => {
    if (isSubmitDisabled) return;
    const result = onSubmit?.({ value: textValue, fileList: files });
    // A promise means ChatInput owns clearing: clear once it resolves, keep everything if it rejects.
    if (result && typeof (result as Promise<void>).then === 'function') {
      (result as Promise<void>).then(
        () => {
          if (!isMountedRef.current) return;
          setTextValue(() => '');
          if (files.length > 0) {
            setFiles(() => []);
            onFileChange?.({ fileList: [] });
          }
        },
        () => {
          // rejected: keep the text and files so the send can be retried
        },
      );
    }
  }, [isSubmitDisabled, onSubmit, textValue, files, setTextValue, setFiles, onFileChange]);

  const handleFileRemove = React.useCallback(
    (file: BladeFile) => {
      const newFileList = files.filter((f) => f.id !== file.id);
      setFiles(() => newFileList);
      onFileRemove?.({ file });
    },
    [files, setFiles, onFileRemove],
  );

  const handleFileDismiss = React.useCallback(
    (file: BladeFile) => {
      const newFileList = files.filter((f) => f.id !== file.id);
      setFiles(() => newFileList);
      onFileDismiss?.({ file });
    },
    [files, setFiles, onFileDismiss],
  );

  return {
    mergedRef,
    textValue,
    files,
    hasFiles,
    hasContent,
    isSubmitDisabled,
    resolvedStatus,
    handleTextChange,
    handleSubmit,
    handleFileRemove,
    handleFileDismiss,
  };
};

export { useChatInput };
export type { UseChatInputProps };
