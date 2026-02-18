import React from 'react';
import styled from 'styled-components';
import { makeSpace } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { BladeElementRef } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import type { ChatInputProps } from './types';
import { ChatInputActionBar } from './ChatInputActionBar';
import { ChatInputGhostSuggestion } from './ChatInputGhostSuggestion';
import { chatInputMaxTextAreaHeight } from './chatInputTokens';
import type { BladeFile, BladeFileList } from '~components/FileUpload/types';
import { FileUploadItem } from '~components/FileUpload/FileUploadItem';
import { isFileAccepted } from '~components/FileUpload/isFileAccepted';
import { BaseInput } from '~components/Input/BaseInput/BaseInput';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~components/BladeProvider';
import { useControllableState } from '~utils/useControllable';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getStyledProps } from '~components/Box/styledProps';
import { useIsMobile } from '~utils/useIsMobile';

const HiddenScrollbarBox = styled(BaseBox)(() => ({
  '&::-webkit-scrollbar': { display: 'none' },
  scrollbarWidth: 'none' as const,
}));

const _ChatInput: React.ForwardRefRenderFunction<BladeElementRef, ChatInputProps> = (
  {
    value: controlledValue,
    defaultValue,
    onChange,
    onSubmit,
    placeholder = 'Ask a question...',
    isDisabled = false,
    isGenerating = false,
    onStop,
    fileList: controlledFileList,
    onFileChange,
    onFileRemove,
    accept,
    maxFileSize,
    maxFileCount,
    suggestions,
    onSuggestionAccept,
    accessibilityLabel = 'Chat input',
    testID,
    ...rest
  },
  ref,
) => {
  const { theme } = useTheme();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const textareaRef = React.useRef<BladeElementRef>(null);

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

  // Auto-grow the textarea based on content
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

      // Enter without Shift submits
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSubmit();
        return;
      }

      // Tab accepts ghost suggestion
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

      // Validate files
      const validFiles = inputFiles.filter((file) => {
        if (accept && !isFileAccepted(file, accept)) return false;
        if (maxFileSize && file.size > maxFileSize) return false;
        return true;
      });

      // Assign unique ids
      for (const file of validFiles) {
        if (!(file as BladeFile).id) {
          (file as BladeFile).id = `${Date.now()}${Math.floor(Math.random() * 1000000)}`;
        }
      }

      // Check max count
      const currentCount = files.length;
      const allowedFiles =
        maxFileCount && currentCount + validFiles.length > maxFileCount
          ? validFiles.slice(0, maxFileCount - currentCount)
          : validFiles;

      if (allowedFiles.length > 0) {
        const newFileList = [...files, ...allowedFiles];
        setFiles(() => newFileList);
        onFileChange?.({ fileList: newFileList });
      }

      // Reset input so the same file can be re-selected
      event.target.value = '';
    },
    [accept, maxFileSize, maxFileCount, files, setFiles, onFileChange],
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

      const allowed = maxFileCount
        ? clipboardFiles.slice(0, Math.max(0, maxFileCount - files.length))
        : clipboardFiles;

      if (allowed.length > 0) {
        const newFileList = [...files, ...allowed] as BladeFileList;
        setFiles(() => newFileList);
        onFileChange?.({ fileList: newFileList });
      }
    },
    [maxFileCount, files, setFiles, onFileChange],
  );

  // File preview area (topContent)
  const filePreviewContent = hasFiles ? (
    <HiddenScrollbarBox
      display="flex"
      flexDirection="row"
      gap="spacing.3"
      paddingTop="spacing.5"
      paddingX="spacing.5"
      overflow="auto"
      flexWrap="nowrap"
    >
      {files.map((file) => (
        <FileUploadItem
          flexShrink={0}
          flexGrow={1}
          flexBasis={1}
          minWidth="200px"
          key={file.id ?? file.name}
          file={file}
          onRemove={() => handleFileRemove(file)}
        />
      ))}
    </HiddenScrollbarBox>
  ) : null;

  // Action bar (bottomContent)
  const actionBarContent = (
    <ChatInputActionBar
      isDisabled={isDisabled}
      isGenerating={isGenerating}
      isSubmitDisabled={isSubmitDisabled}
      onUploadClick={handleUploadClick}
      onSubmit={handleSubmit}
      onStop={onStop}
    />
  );

  return (
    <BaseBox
      position="relative"
      {...metaAttribute({ name: MetaConstants.ChatInput, testID })}
      {...getStyledProps(rest)}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={!maxFileCount || maxFileCount > 1}
        onChange={handleFileInputChange}
        disabled={isDisabled}
        style={{ display: 'none' }}
        aria-hidden="true"
      />

      <BaseInput
        ref={textareaRef}
        as="textarea"
        id="chat-input"
        elevation="highRaised"
        label={undefined}
        accessibilityLabel={accessibilityLabel}
        hideLabelText
        hideFormHint
        placeholder={showGhostSuggestion ? '' : placeholder}
        value={textValue}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        isDisabled={isDisabled}
        numberOfLines={2}
        size="medium"
        padding={makeSpace(theme.spacing[5])}
        borderRadius="large"
        caretColor="surface.icon.onSea.onSubtle"
        topContent={filePreviewContent}
        bottomContent={actionBarContent}
        inputRowOverlay={
          showGhostSuggestion && suggestions ? (
            <BaseBox
              position="absolute"
              top="spacing.5"
              left="spacing.5"
              right="spacing.5"
              pointerEvents="none"
              zIndex={3}
            >
              <ChatInputGhostSuggestion
                suggestions={suggestions}
                isVisible={showGhostSuggestion}
                onIndexChange={setActiveSuggestionIndex}
              />
            </BaseBox>
          ) : null
        }
        {...makeAnalyticsAttribute(rest)}
      />
    </BaseBox>
  );
};

const ChatInput = assignWithoutSideEffects(React.forwardRef(_ChatInput), {
  displayName: 'ChatInput',
});

export { ChatInput };
export type { ChatInputProps };
