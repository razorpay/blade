import React from 'react';
import type { ChatInputProps } from './types';
import type { BladeElementRef } from '~utils/types';
import type { BladeFile, BladeFileList } from '~components/FileUpload/types';
import { generateFileId } from '~components/FileUpload/generateFileId';
import { useControllableState } from '~utils/useControllable';
import { useMergeRefs } from '~utils/useMergeRefs';
import { getChatInputSubmitDisabled } from './getChatInputSubmitDisabled';

type UseChatInputProps = Pick<
  ChatInputProps,
  'value' | 'defaultValue' | 'onChange' | 'onSubmit' | 'fileList' | 'onFileRemove' | 'onFileDismiss'
>;

const useChatInput = (
  {
    value: controlledValue,
    defaultValue,
    onChange,
    onSubmit,
    fileList: controlledFileList,
    onFileRemove,
    onFileDismiss,
  }: UseChatInputProps,
  ref: React.ForwardedRef<BladeElementRef>,
): {
  mergedRef: React.RefCallback<BladeElementRef>;
  textValue: string;
  files: BladeFileList;
  hasFiles: boolean;
  isSubmitDisabled: boolean;
  handleTextChange: (args: { name?: string; value?: string }) => void;
  handleSubmit: () => void;
  handleFileRemove: (file: BladeFile) => void;
  handleFileDismiss: (file: BladeFile) => void;
} => {
  const inputRef = React.useRef<BladeElementRef>(null);
  const mergedRef = useMergeRefs(ref, inputRef);

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
  const isSubmitDisabled = getChatInputSubmitDisabled(textValue, files);

  const handleTextChange = React.useCallback(
    ({ value: newValue }: { name?: string; value?: string }) => {
      setTextValue(() => newValue ?? '');
    },
    [setTextValue],
  );

  const handleSubmit = React.useCallback(() => {
    if (isSubmitDisabled) return;
    onSubmit?.({ value: textValue, fileList: files });
  }, [isSubmitDisabled, onSubmit, textValue, files]);

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
    isSubmitDisabled,
    handleTextChange,
    handleSubmit,
    handleFileRemove,
    handleFileDismiss,
  };
};

export { useChatInput };
export type { UseChatInputProps };
