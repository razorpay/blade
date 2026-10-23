import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import type { ChatInputProps } from './types';
import { chatInputFilePreviewItemWidth } from './chatInputTokens';
import {
  ChatInputActionBar,
  ChatInputSubmitAction,
  ChatInputUploadAction,
} from './ChatInputActionBar';
import { ChatInputGhostSuggestion } from './ChatInputGhostSuggestion';
import { useChatInput } from './useChatInput';
import { useTheme } from '~components/BladeProvider';
import { BaseMotionBox, BaseMotionEntryExit } from '~components/BaseMotion';
import type { MotionVariantsType } from '~components/BaseMotion';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { minHeight as buttonMinHeight } from '~components/Button/BaseButton/buttonTokens';
import { IconButton } from '~components/Button/IconButton';
import { FileUploadItem } from '~components/FileUpload/FileUploadItem';
import { CloseIcon, InfoIcon } from '~components/Icons';
import { iconSizeMap } from '~components/Icons/useIconProps/iconSizeMap';
import { BaseInput } from '~components/Input/BaseInput/BaseInput';
import { inputDropdownButtonPadding } from '~components/Input/BaseInput/baseInputTokens';
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
    size = 'medium',
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
    testID,
    ...rest
  },
  ref,
) => {
  const { theme } = useTheme();
  const isSmall = size === 'small';

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
                  _isCompact
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

  // size="small": upload and submit sit inline with the text, pinned to the bottom row as the
  // text area grows. The bottom inset centres the submit button on a single line of text.
  const inlineActionBottomInset = makeSpace(
    (theme.spacing[5] * 2 + theme.typography.lineHeights[100] - buttonMinHeight.small) / 2,
  );

  // The upload icon is as tall as a line of text, so it sits on the text line: its bottom inset is
  // the text area padding, minus the padding BaseInput already puts around a leading element.
  const inlineUploadBottomInset = makeSpace(
    theme.spacing[5] - theme.spacing[inputDropdownButtonPadding.medium],
  );

  const inlineUploadAction = hideFileUpload ? undefined : (
    <BaseBox paddingLeft="spacing.3" paddingBottom={inlineUploadBottomInset} display="flex">
      <ChatInputUploadAction isDisabled={isDisabled} onUploadClick={handleUploadClick} />
    </BaseBox>
  );

  const inlineSubmitAction = (
    <BaseBox paddingBottom={inlineActionBottomInset} display="flex">
      <ChatInputSubmitAction
        isDisabled={isDisabled}
        isGenerating={isGenerating}
        isSubmitDisabled={isSubmitDisabled}
        onSubmit={handleSubmit}
        onStop={onStop}
      />
    </BaseBox>
  );

  // Ghost suggestions start where the typed text starts and stop before the submit button.
  const inlineGhostLeftInset = makeSpace(
    hideFileUpload
      ? theme.spacing[5]
      : theme.spacing[inputDropdownButtonPadding.medium] +
          theme.spacing[3] +
          iconSizeMap.large +
          theme.spacing[5],
  );
  const inlineGhostRightInset = makeSpace(
    theme.spacing[5] + buttonMinHeight.small + theme.spacing[4],
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
          numberOfLines={isSmall ? 1 : 2}
          size="medium"
          padding={makeSpace(theme.spacing[5])}
          borderRadius="large"
          caretColor="surface.icon.onSea.onSubtle"
          topContent={filePreviewContent}
          bottomContent={isSmall ? undefined : actionBarContent}
          leadingInteractionElement={isSmall ? inlineUploadAction : undefined}
          trailingInteractionElement={isSmall ? inlineSubmitAction : undefined}
          visualsAlignment={isSmall ? 'bottom' : undefined}
          inputRowOverlay={
            showGhostSuggestion && suggestions ? (
              <BaseBox
                position="absolute"
                top="spacing.5"
                left={isSmall ? inlineGhostLeftInset : 'spacing.5'}
                right={isSmall ? inlineGhostRightInset : 'spacing.5'}
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
