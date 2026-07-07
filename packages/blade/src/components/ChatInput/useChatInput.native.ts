import React from 'react';
import type { ChatInputProps } from './types';
import type { BladeElementRef } from '~utils/types';
import type { BladeFile, BladeFileList } from '~components/FileUpload/types';
import { useControllableState } from '~utils/useControllable';
import { useMergeRefs } from '~utils/useMergeRefs';

type UseChatInputProps = Pick<
  ChatInputProps,
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'onSubmit'
  | 'isDisabled'
  | 'isGenerating'
  | 'onStop'
  | 'fileList'
  | 'onFileChange'
  | 'onFileRemove'
  | 'onFileDismiss'
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

  const [files, setFiles] = useControllableState<BladeFileList>({
    value: controlledFileList,
    defaultValue: controlledFileList ?? [],
  });

  const hasText = textValue.trim().length > 0;
  const hasFiles = files.length > 0;
  const hasErrorFiles = files.some((f) => f.status === 'error' || f.status === 'uploading');
  const isSubmitDisabled = (!hasText && !hasFiles) || hasErrorFiles;

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
