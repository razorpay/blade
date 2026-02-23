import React from 'react';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import type { ChatInputProps } from './types';
import { ChatInputActionBar } from './ChatInputActionBar';
import { ChatInputGhostSuggestion } from './ChatInputGhostSuggestion';
import { useChatInput } from './useChatInput';
import { castWebType, makeSpace } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { BladeElementRef } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { useTheme } from '~components/BladeProvider';
import { msToSeconds } from '~utils/msToSeconds';
import { cssBezierToArray } from '~utils/cssBezierToArray';
import { BaseMotionBox } from '~components/BaseMotion';
import type { MotionVariantsType } from '~components/BaseMotion';
import { FileUploadItem } from '~components/FileUpload/FileUploadItem';
import { BaseInput } from '~components/Input/BaseInput/BaseInput';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getStyledProps } from '~components/Box/styledProps';

const HiddenScrollbarBox = styled(BaseBox)(() => ({
  '&::-webkit-scrollbar': { display: 'none' },
  scrollbarWidth: 'none' as const,
}));

const _ChatInput: React.ForwardRefRenderFunction<BladeElementRef, ChatInputProps> = (
  {
    value,
    defaultValue,
    onChange,
    onSubmit,
    placeholder = 'Ask a question...',
    isDisabled = false,
    isGenerating = false,
    onStop,
    fileList,
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

  const {
    fileInputRef,
    mergedRef,
    textValue,
    files,
    setActiveSuggestionIndex,
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
  } = useChatInput(
    {
      value,
      defaultValue,
      onChange,
      onSubmit,
      isDisabled,
      isGenerating,
      onStop,
      fileList,
      onFileChange,
      onFileRemove,
      accept,
      maxFileSize,
      maxFileCount,
      suggestions,
      onSuggestionAccept,
    },
    ref,
  );

  const filePreviewMotionVariants: MotionVariantsType = {
    initial: { height: '0px', overflow: 'hidden' },
    animate: {
      height: 'auto',
      overflow: 'hidden',
      transition: {
        duration: msToSeconds(theme.motion.duration.quick),
        ease: cssBezierToArray(castWebType(theme.motion.easing.emphasized)),
      },
    },
    exit: {
      height: '0px',
      overflow: 'hidden',
      transition: {
        duration: msToSeconds(theme.motion.duration.quick),
        ease: cssBezierToArray(castWebType(theme.motion.easing.emphasized)),
      },
    },
  };

  const filePreviewContent = (
    <AnimatePresence>
      {hasFiles ? (
        <BaseMotionBox motionVariants={filePreviewMotionVariants}>
          <HiddenScrollbarBox
            display="flex"
            flexDirection="row"
            gap="spacing.3"
            paddingTop="spacing.5"
            paddingX="spacing.5"
            overflowX="auto"
            height="auto"
            overflowY="hidden"
            flexWrap="nowrap"
          >
            {files.map((file) => (
              <FileUploadItem
                flexShrink={0}
                flexGrow={1}
                flexBasis={1}
                minWidth="160px"
                maxWidth="200px"
                key={file.id ?? file.name}
                file={file}
                onRemove={() => handleFileRemove(file)}
              />
            ))}
          </HiddenScrollbarBox>
        </BaseMotionBox>
      ) : null}
    </AnimatePresence>
  );

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
        ref={mergedRef}
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
  componentId: MetaConstants.ChatInput,
  displayName: 'ChatInput',
});

export { ChatInput };
export type { ChatInputProps };
