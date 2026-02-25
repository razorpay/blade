import React from 'react';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import type { ChatInputProps } from './types';
import { ChatInputActionBar } from './ChatInputActionBar';
import { ChatInputGhostSuggestion } from './ChatInputGhostSuggestion';
import { useChatInput } from './useChatInput';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import type { BladeElementRef } from '~utils/types';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { castWebType, makeSpace } from '~utils';
import { useTheme } from '~components/BladeProvider';
import { msToSeconds } from '~utils/msToSeconds';
import { cssBezierToArray } from '~utils/cssBezierToArray';
import { BaseMotionBox, BaseMotionEntryExit } from '~components/BaseMotion';
import type { MotionVariantsType } from '~components/BaseMotion';
import { FileUploadItem } from '~components/FileUpload/FileUploadItem';
import { BaseInput } from '~components/Input/BaseInput/BaseInput';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getStyledProps } from '~components/Box/styledProps';
import { CloseIcon, InfoIcon } from '~components/Icons';
import { Text } from '~components/Typography';
import { IconButton } from '~components/Button/IconButton';

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
    suggestions,
    onSuggestionAccept,
    validationState,
    errorText,
    onErrorDismiss,
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
      suggestions,
      onSuggestionAccept,
    },
    ref,
  );

  const errorSlideVariants: MotionVariantsType = {
    initial: { opacity: 0 },
    animate: {
      transform: ['translateY(100%)', 'translateY(0%)'],
      opacity: 1,
      transition: {
        duration: msToSeconds(theme.motion.duration.xmoderate),
        ease: cssBezierToArray(castWebType(theme.motion.easing.emphasized)),
      },
    },
    exit: {
      opacity: 0,
      transform: 'translateY(100%)',
      transitionEnd: { transform: 'translateY(100%)' },
      transition: {
        duration: msToSeconds(theme.motion.duration.xmoderate),
        ease: cssBezierToArray(castWebType(theme.motion.easing.emphasized)),
      },
    },
  };

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

  const isError = validationState === 'error';

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
        multiple={true}
        onChange={handleFileInputChange}
        disabled={isDisabled}
        style={{ display: 'none' }}
        aria-hidden="true"
      />

      <BaseBox position="relative" zIndex={1}>
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

      {/* Error popup — positioned behind the card (zIndex: 0), slides out from behind the top edge */}
      <BaseBox
        position="absolute"
        bottom="calc(100% - 12px)"
        left="spacing.0"
        right="spacing.0"
        zIndex={0}
      >
        <BaseMotionEntryExit motionVariants={errorSlideVariants} isVisible={isError} type="inout">
          <BaseBox
            display="flex"
            flexDirection="row"
            alignItems="center"
            gap="spacing.2"
            backgroundColor="feedback.background.negative.subtle"
            paddingX="spacing.4"
            paddingTop="spacing.3"
            paddingBottom="spacing.6"
            borderTopLeftRadius="medium"
            borderTopRightRadius="medium"
            role="alert"
          >
            <InfoIcon size="small" color="feedback.icon.negative.intense" />
            <Text size="small" truncateAfterLines={8} color="feedback.text.negative.intense">
              {errorText}
            </Text>
            {onErrorDismiss ? (
              <IconButton
                marginLeft="auto"
                icon={CloseIcon}
                size="small"
                emphasis="intense"
                accessibilityLabel="Dismiss error"
                onClick={() => onErrorDismiss()}
              />
            ) : null}
          </BaseBox>
        </BaseMotionEntryExit>
      </BaseBox>
    </BaseBox>
  );
};

const ChatInput = assignWithoutSideEffects(React.forwardRef(_ChatInput), {
  componentId: MetaConstants.ChatInput,
  displayName: 'ChatInput',
});

export { ChatInput };
export type { ChatInputProps };
