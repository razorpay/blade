import React from 'react';
import type { ChatInputProps } from './types';
import { chatInputMaxTextAreaHeight } from './chatInputTokens';
import type { BladeElementRef } from '~utils/types';
import type { BladeFile, BladeFileList } from '~components/FileUpload/types';
import { isFileAccepted } from '~components/FileUpload/isFileAccepted';
import { useControllableState } from '~utils/useControllable';
import { useIsMobile } from '~utils/useIsMobile';
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
  | 'accept'
  | 'suggestions'
  | 'onSuggestionAccept'
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
    accept,
    suggestions,
    onSuggestionAccept,
  }: UseChatInputProps,
  ref: React.ForwardedRef<BladeElementRef>,
): {
  fileInputRef: React.RefObject<HTMLInputElement>;
  mergedRef: React.RefCallback<BladeElementRef>;
  textValue: string;
  files: BladeFileList;
  activeSuggestionIndex: number;
  setActiveSuggestionIndex: React.Dispatch<React.SetStateAction<number>>;
  hasText: boolean;
  hasFiles: boolean;
  isSubmitDisabled: boolean;
  showGhostSuggestion: boolean;
  handleTextChange: (args: { name?: string; value?: string }) => void;
  handleSubmit: () => void;
  handleKeyDown: (args: {
    name?: string;
    key?: string;
    code?: string;
    event: React.KeyboardEvent<HTMLInputElement>;
  }) => void;
  handleUploadClick: () => void;
  handleFileInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileRemove: (file: BladeFile) => void;
  handlePaste: (event: React.ClipboardEvent<HTMLInputElement>) => void;
} => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const textareaRef = React.useRef<BladeElementRef>(null);
  const mergedRef = useMergeRefs(ref, textareaRef);

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

  const [activeSuggestionIndex, setActiveSuggestionIndex] = React.useState(0);

  const isMobile = useIsMobile();

  const hasText = textValue.trim().length > 0;
  const hasFiles = files.length > 0;
  const isSubmitDisabled = !hasText && !hasFiles;
  const showGhostSuggestion = !hasText && Boolean(suggestions?.length) && !isMobile;

  const adjustTextareaHeight = React.useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea && textarea instanceof HTMLTextAreaElement) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, chatInputMaxTextAreaHeight)}px`;
    }
  }, []);

  React.useEffect(() => {
    adjustTextareaHeight();
  }, [textValue, adjustTextareaHeight]);

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

  const handleKeyDown = React.useCallback(
    ({
      event,
    }: {
      name?: string;
      key?: string;
      code?: string;
      event: React.KeyboardEvent<HTMLInputElement>;
    }) => {
      if (!event) return;

      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSubmit();
        return;
      }

      if (event.key === 'Tab' && showGhostSuggestion && suggestions?.length) {
        event.preventDefault();
        const currentSuggestion = suggestions[activeSuggestionIndex];
        setTextValue(() => currentSuggestion);
        onSuggestionAccept?.({ suggestion: currentSuggestion });
      }
    },
    [
      handleSubmit,
      showGhostSuggestion,
      suggestions,
      activeSuggestionIndex,
      setTextValue,
      onSuggestionAccept,
    ],
  );

  const handleUploadClick = React.useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputFiles = Array.from(event.target.files ?? []) as BladeFileList;

      const validFiles = inputFiles.filter((file) => {
        if (accept && !isFileAccepted(file, accept)) return false;
        return true;
      });

      for (const file of validFiles) {
        if (!file.id) {
          file.id = `${Date.now()}${Math.floor(Math.random() * 1000000)}`;
        }
      }

      if (validFiles.length > 0) {
        const newFileList = [...files, ...validFiles];
        setFiles(() => newFileList);
        onFileChange?.({ fileList: newFileList });
      }

      event.target.value = '';
    },
    [accept, files, setFiles, onFileChange],
  );

  const handleFileRemove = React.useCallback(
    (file: BladeFile) => {
      const newFileList = files.filter((f) => f.id !== file.id);
      setFiles(() => newFileList);
      onFileRemove?.({ file });
    },
    [files, setFiles, onFileRemove],
  );

  const handlePaste = React.useCallback(
    (event: React.ClipboardEvent<HTMLInputElement>) => {
      const clipboardFiles = Array.from(event.clipboardData?.files ?? []);
      if (clipboardFiles.length === 0) return;

      event.preventDefault();

      for (const file of clipboardFiles) {
        if (!(file as BladeFile).id) {
          (file as BladeFile).id = `${Date.now()}${Math.floor(Math.random() * 1000000)}`;
        }
      }

      if (clipboardFiles.length > 0) {
        const newFileList = [...files, ...clipboardFiles] as BladeFileList;
        setFiles(() => newFileList);
        onFileChange?.({ fileList: newFileList });
      }
    },
    [files, setFiles, onFileChange],
  );

  return {
    fileInputRef,
    mergedRef,
    textValue,
    files,
    activeSuggestionIndex,
    setActiveSuggestionIndex,
    hasText,
    hasFiles,
    isSubmitDisabled,
    showGhostSuggestion,
    handleTextChange,
    handleSubmit,
    handleKeyDown,
    handleUploadClick,
    handleFileInputChange,
    handleFileRemove,
    handlePaste,
  };
};

export { useChatInput };
export type { UseChatInputProps };
