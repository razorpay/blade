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
import { Tag } from '~components/Tag';
import type { ChatFeedbackControls } from '~components/ChatFeedback';
import { Text } from '~components/Typography';
import { BaseInput } from '~components/Input/BaseInput/BaseInput';
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

/**
 * Carries the attached surface's dissolve.
 *
 * The prompt *fades* as it leaves, and the surface holding it used to lose its background and
 * padding in the same frame — so the composer jumped up by the padding at the exact moment the
 * user was watching the confirmation go. Transitioning both across the same beat as the fade
 * means the surface recedes with its contents instead of being pulled out from under them.
 *
 * A `styled` wrapper rather than props on `BaseBox`, which has no way to express a transition.
 */
const FeedbackSurface = styled(BaseBox)(({ theme }) => ({
  transition: `background-color ${theme.motion.duration.moderate}ms ${castWebType(
    theme.motion.easing.exit,
  )}, padding ${theme.motion.duration.moderate}ms ${castWebType(theme.motion.easing.exit)}`,
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

  /*
   * Free-text feedback borrows this composer rather than opening a field of its own.
   *
   * The alternative — a second input inside the prompt — puts two places to type directly above
   * one another, and the one that looks like the composer is not the one that has focus. Handing
   * the composer over means there is only ever one.
   *
   * Two things this has to get right, both of them silent when wrong:
   *
   *  - **Anything already typed is the user's, not ours.** Entering the mode stashes the chat
   *    draft and restores it on the way out; without that, picking a tag quietly destroys a
   *    half-written message.
   *  - **Enter must not reach the chat.** Sending someone's candid feedback to the assistant as a
   *    prompt is not a recoverable mistake, so the chat path is blocked outright while the mode
   *    is on rather than merely redirected.
   */
  const freeTextTag = feedback?.freeTextTag ?? 'Other';
  const feedbackControls = React.useRef<ChatFeedbackControls | null>(null);
  /*
   * Mirrors the mode as a ref, because leaving it is re-entrant.
   *
   * Exiting releases the free-text tag, which fires `onTagsChange`, which routes back here as
   * another exit. State read from a closure is still `true` at that point, so the second pass
   * would restore an already-cleared draft over the one just put back. The ref is the only value
   * that is current by then.
   */
  const isFeedbackInputRef = React.useRef(false);
  const [isFeedbackInput, setIsFeedbackInput] = React.useState(false);
  const [feedbackTags, setFeedbackTags] = React.useState<string[]>([]);
  const stashedDraft = React.useRef('');

  const enterFeedbackInput = React.useCallback(() => {
    stashedDraft.current = textValue;
    handleTextChange({ value: '' });
    isFeedbackInputRef.current = true;
    setIsFeedbackInput(true);
  }, [handleTextChange, textValue]);

  const exitFeedbackInput = React.useCallback(() => {
    if (!isFeedbackInputRef.current) return;
    isFeedbackInputRef.current = false;
    setIsFeedbackInput(false);
    handleTextChange({ value: stashedDraft.current });
    stashedDraft.current = '';

    /*
     * Release the tag as well as the mode.
     *
     * Leaving it selected strands the user: the tick stays hidden because the only tag picked is
     * the free-text one, and the composer is back to chatting — so they have chosen something
     * with no way left to send it. Backing out has to undo the choice that got them here.
     */
    feedbackControls.current?.setTags(
      feedbackTags.filter((tag) => tag !== (feedback?.freeTextTag ?? 'Other')),
    );
  }, [feedback?.freeTextTag, feedbackTags, handleTextChange]);

  /*
   * Move the caret to the composer as the mode opens.
   *
   * Picking the tag is the user saying they have something to type; leaving focus where it was
   * makes them click a second time to start, and on a strip this small the field is easy to miss
   * changing at all. Focus is what makes the handover legible — the composer lights up, so it is
   * obvious which of the two things on screen is now listening.
   *
   * In an effect rather than inside the handler, so it runs after the placeholder and the cleared
   * value have been committed.
   */
  React.useEffect(() => {
    if (!isFeedbackInput) return;
    if (inputRef.current instanceof HTMLElement) inputRef.current.focus();
  }, [isFeedbackInput]);

  /*
   * Submitting ends the mode as surely as cancelling does.
   *
   * Firing the flow's submit is not enough on its own: the prompt going away is the *strip's*
   * business, and the composer stays in feedback mode until told otherwise — leaving a Feedback
   * tag, an "esc to cancel" hint and the wrong placeholder attached to a composer with nothing
   * left to give feedback to.
   */
  const submitFeedbackInput = React.useCallback(() => {
    feedbackControls.current?.submit();
    exitFeedbackInput();
  }, [exitFeedbackInput]);

  const handleFeedbackTagsChange = React.useCallback(
    ({ tags }: { tags: string[] }) => {
      setFeedbackTags(tags);
      const wantsFreeText = tags.includes(freeTextTag);
      /*
       * Read from the ref rather than from state. This runs inside `ChatFeedback`'s callbacks,
       * which can be memoised against an older render — so the state copy here may say the mode is
       * off when it is on, and the exit never happens. That is how the back-chevron left a composer
       * stranded in feedback mode with nothing selected.
       */
      if (wantsFreeText && !isFeedbackInputRef.current) enterFeedbackInput();
      if (!wantsFreeText && isFeedbackInputRef.current) exitFeedbackInput();
    },
    [enterFeedbackInput, exitFeedbackInput, freeTextTag],
  );

  const actionBarContent = (
    <ChatInputActionBar
      isDisabled={isDisabled}
      isGenerating={isGenerating}
      isSubmitDisabled={isSubmitDisabled}
      hideFileUpload={hideFileUpload}
      onUploadClick={handleUploadClick}
      onSubmit={isFeedbackInput ? submitFeedbackInput : handleSubmit}
      onStop={onStop}
      leadingSlot={
        isFeedbackInput ? (
          <BaseBox display="flex" flexDirection="row" alignItems="center" gap="spacing.3">
            {/*
              A dismissable tag rather than a line of instructions: it says which mode you are in
              and is itself the way out. Esc does the same thing, but there is no Esc key on a
              phone, so the tap target is the affordance that has to exist.
            */}
            <Tag size="small" onDismiss={exitFeedbackInput} isDisabled={isDisabled}>
              Feedback
            </Tag>
            <Text size="xsmall" color="surface.text.gray.muted">
              esc to cancel
            </Text>
          </BaseBox>
        ) : undefined
      }
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
  const handleComposerKeyDown = React.useCallback(
    (args: Parameters<typeof handleKeyDown>[0]) => {
      if (!isFeedbackInput) {
        handleKeyDown(args);
        return;
      }

      if (args.event?.key === 'Escape') {
        args.event.preventDefault();
        exitFeedbackInput();
        return;
      }

      // Enter submits the feedback; Shift+Enter still breaks the line. Nothing here reaches the
      // chat's own submit, which is the point.
      if (args.event?.key === 'Enter' && !args.event.shiftKey) {
        args.event.preventDefault();
        submitFeedbackInput();
      }
    },
    [exitFeedbackInput, handleKeyDown, isFeedbackInput, submitFeedbackInput],
  );

  const isFeedbackVisible = Boolean(feedback) && feedback?.isVisible !== false;

  /*
   * The mode cannot outlive the prompt.
   *
   * A consumer can take the prompt away at any moment — on submit, on dismiss, or because the
   * whole surface is being torn down — and none of those routes go through the handlers above.
   * Without this the composer is left wearing a Feedback tag with nothing behind it, and Enter
   * still routed away from the chat.
   */
  React.useEffect(() => {
    if (!isFeedbackVisible && isFeedbackInput) exitFeedbackInput();
  }, [exitFeedbackInput, isFeedbackInput, isFeedbackVisible]);
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

  const Frame = feedback ? FeedbackSurface : BaseBox;

  return (
    <Frame
      position="relative"
      /*
       * The composer is a writing surface, not a field. Below about this width a prompt wraps
       * after a handful of words and the feedback strip — a question, four faces and a submit on
       * one line — starts folding onto a second row. Placed before the spreads below so a
       * consumer's own styled props still win.
       */
      minWidth="700px"
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

      {feedback ? (
        <ChatInputFeedback
          {...feedback}
          onTagsChange={handleFeedbackTagsChange}
          /*
           * The tick appears only once there is something for it to send.
           *
           * At rest it would be a disabled control with nothing to do, and while the free-text tag
           * is the selection the composer's own send arrow is the submit — a second tick would sit
           * in the place the user is *not* looking. Either way it arrives with the first tag that
           * stands on its own.
           */
          isSubmitHidden={!feedbackTags.some((tag) => tag !== freeTextTag)}
          comment={isFeedbackInput ? textValue : undefined}
          controlsRef={feedbackControls}
        />
      ) : null}

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
          placeholder={
            isFeedbackInput
              ? feedback?.commentPlaceholder ?? 'Anything else? (optional)'
              : showGhostSuggestion
              ? ''
              : placeholder
          }
          value={textValue}
          onChange={handleTextChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={handleComposerKeyDown}
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
    </Frame>
  );
};

const ChatInput = assignWithoutSideEffects(React.forwardRef(_ChatInput), {
  componentId: MetaConstants.ChatInput,
  displayName: 'ChatInput',
});

export { ChatInput };
