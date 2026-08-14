import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import type { ChatInputProps } from './types';
import { chatInputFilePreviewItemWidth } from './chatInputTokens';
import { ChatInputActionBar } from './ChatInputActionBar';
import { ChatInputFeedback } from './ChatInputFeedback.web';
import { ChatInputGhostSuggestion } from './ChatInputGhostSuggestion';
import { useChatInput } from './useChatInput';
import { useTheme } from '~components/BladeProvider';
import { BaseMotionBox, BaseMotionEntryExit } from '~components/BaseMotion';
import type { MotionVariantsType } from '~components/BaseMotion';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { IconButton } from '~components/Button/IconButton';
import { FileUploadItem } from '~components/FileUpload/FileUploadItem';
import { CloseIcon, InfoIcon } from '~components/Icons';
import { BaseInput } from '~components/Input/BaseInput/BaseInput';
import { Text } from '~components/Typography';
import { castWebType, makeSpace } from '~utils';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { BladeElementRef } from '~utils/types';
import { useMergeRefs } from '~utils/useMergeRefs';
import { msToSeconds } from '~utils/msToSeconds';
import { cssBezierToArray } from '~utils/cssBezierToArray';

const HiddenScrollbarBox = styled(BaseBox)(() => ({
  '&::-webkit-scrollbar': { display: 'none' },
  scrollbarWidth: 'none' as const,
}));

const _ChatInput: React.ForwardRefRenderFunction<BladeElementRef, ChatInputProps> = (
  {
    value,
    defaultValue,
    onChange,
    onFocus,
    onBlur,
    onSubmit,
    placeholder = 'Ask a question...',
    isDisabled = false,
    isGenerating = false,
    onStop,
    fileList,
    onFileChange,
    onFileRemove,
    onFileDismiss,
    onFileReupload,
    accept,
    suggestions,
    onSuggestionAccept,
    validationState,
    errorText,
    onErrorDismiss,
    hideFileUpload = false,
    autoFocus = false,
    accessibilityLabel = 'Chat input',
    feedback,
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
    handleFileDismiss,
    handlePaste,
    handleInnerMouseDownCapture,
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
      onFileDismiss,
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

  const inputRef = useRef<BladeElementRef>(null);
  const combinedRef = useMergeRefs(mergedRef, inputRef);

  useEffect(() => {
    if (autoFocus && inputRef.current instanceof HTMLElement) {
      inputRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fileScrollRef = useRef<HTMLDivElement>(null);
  const prevFileCountRef = useRef(files.length);

  useEffect(() => {
    const prevCount = prevFileCountRef.current;
    prevFileCountRef.current = files.length;
    if (files.length > prevCount && fileScrollRef.current) {
      fileScrollRef.current.scrollTo({
        left: fileScrollRef.current.scrollWidth,
        behavior: 'smooth',
      });
    }
  }, [files]);

  const filePreviewContent = (
    <AnimatePresence>
      {hasFiles ? (
        <BaseMotionBox motionVariants={filePreviewMotionVariants}>
          <HiddenScrollbarBox
            ref={fileScrollRef}
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
              <BaseBox
                key={file.id ?? file.name}
                flexShrink={0}
                width={chatInputFilePreviewItemWidth}
              >
                <FileUploadItem
                  file={file}
                  onRemove={() => handleFileRemove(file)}
                  onDismiss={() => handleFileDismiss(file)}
                  onReupload={onFileReupload ? () => onFileReupload({ file }) : undefined}
                />
              </BaseBox>
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
      hideFileUpload={hideFileUpload}
      onUploadClick={handleUploadClick}
      onSubmit={handleSubmit}
      onStop={onStop}
    />
  );

  const isError = validationState === 'error';

  /*
   * The surface that holds prompt and composer together.
   *
   * Only drawn while the prompt is actually showing: with the prompt gone the composer has to look
   * exactly as it does with the feature switched off, and a leftover border with 4px of padding
   * around a lone composer is a worse artefact than no feature at all.
   *
   * Nothing at all is emitted when the feature is unused, rather than the same properties set to
   * transparent and zero. A composer without a feedback prompt should render byte-for-byte as it
   * did before this existed — a border-style and a radius that no consumer asked for is the kind of
   * change that shows up as unexplained diff noise in every snapshot downstream.
   */
  const isFeedbackVisible = Boolean(feedback) && feedback?.isVisible !== false;
  const frameProps = feedback
    ? ({
        display: 'flex',
        flexDirection: 'column',
        // 4px between the prompt and the card, per the design.
        gap: 'spacing.2',
        /*
         * A tinted surface rather than a grey one: the prompt is Ray asking for something, not a
         * disabled or secondary region, and the azure wash ties it to the assistant rather than to
         * the page chrome. No border — the tint alone separates it from the page, and an outline
         * around an outline (the card carries its own) reads as two boxes rather than one.
         */
        backgroundColor: isFeedbackVisible ? 'surface.background.primary.subtle' : 'transparent',
        // 20px outside, 16px on the card within, per the design.
        borderRadius: 'xlarge',
        /*
         * The design asks for 6px, which is not on Blade's spacing scale — it steps 4 to 8 — so
         * this rounds up rather than inventing a value off-scale.
         */
        padding: isFeedbackVisible ? 'spacing.3' : 'spacing.0',
      } as const)
    : {};

  return (
    <BaseBox
      position="relative"
      {...frameProps}
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

      {feedback ? <ChatInputFeedback {...feedback} /> : null}

      <BaseBox position="relative" zIndex={1} onMouseDownCapture={handleInnerMouseDownCapture}>
        <BaseInput
          ref={combinedRef}
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
          onFocus={onFocus}
          onBlur={onBlur}
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
        /*
         * This region stays mounted when there is no error — `BaseMotionEntryExit` keeps it for
         * the exit animation — and a full-width transparent box directly above the composer will
         * happily swallow clicks meant for whatever a consumer has put there. It did: the mood
         * scale's lower 20px stopped responding, with nothing on screen to explain why. It only
         * needs to be interactive when it is actually saying something.
         */
        pointerEvents={isError ? 'auto' : 'none'}
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
