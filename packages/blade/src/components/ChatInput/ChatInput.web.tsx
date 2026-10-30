import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import type { ChatInputProps } from './types';
import { chatInputBorderRadius, chatInputFilePreviewItemWidth } from './chatInputTokens';
import { ChatInputActionBar } from './ChatInputActionBar';
import { ChatInputAmbientBorder } from './ChatInputAmbientBorder';
import { ChatInputButton } from './ChatInputButton';
import { ChatInputCommandMenu } from './ChatInputCommandMenu';
import { ChatInputGhostSuggestion } from './ChatInputGhostSuggestion';
import { useChatInputHoverBorder } from './ChatInputHoverBorder';
import { ChatInputSubmit } from './ChatInputSubmit';
import { getChatInputCompactLayout } from './getChatInputCompactLayout';
import { useChatInput } from './useChatInput';
import { useTheme } from '~components/BladeProvider';
import { BaseMotionBox, BaseMotionEntryExit } from '~components/BaseMotion';
import type { MotionVariantsType } from '~components/BaseMotion';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { IconButton } from '~components/Button/IconButton';
import { FileUploadItem } from '~components/FileUpload/FileUploadItem';
import { CloseIcon, InfoIcon, PlusIcon } from '~components/Icons';
import { BaseInput } from '~components/Input/BaseInput/BaseInput';
import { Menu } from '~components/Menu';
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

// size="small", one row: the placeholder stays on one line, so a long placeholder cannot make the
// empty composer taller than one row. Overflow is cut off; Safari adds "...", Chrome ignores
// text-overflow on a textarea placeholder.
const ChatInputCardBox = styled(BaseBox)<{ $isCompactRow: boolean }>(({ $isCompactRow }) =>
  $isCompactRow
    ? {
        '& textarea::placeholder': {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
      }
    : {},
);

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
    status,
    header,
    actionMenu,
    commands,
    onCommandSelect,
    maxCount,
    maxSize,
    onFileError,
    dropTarget = 'input',
    showAmbientBorder = false,
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
  const [isFocused, setIsFocused] = React.useState(false);
  const { hoverBorder, hoverHandlers } = useChatInputHoverBorder();

  const {
    fileInputRef,
    mergedRef,
    textValue,
    files,
    setActiveSuggestionIndex,
    hasFiles,
    hasContent,
    isSubmitDisabled,
    showGhostSuggestion,
    resolvedStatus,
    isExpanded,
    isDraggingFiles,
    commandMenu,
    handleTextChange,
    handleSubmit,
    handleKeyDown,
    handleUploadClick,
    handleFileInputChange,
    handleFileRemove,
    handleFileDismiss,
    handlePaste,
    handleInnerMouseDownCapture,
    dropZoneProps,
  } = useChatInput(
    {
      value,
      defaultValue,
      onChange,
      onSubmit,
      isDisabled,
      isGenerating,
      status,
      onStop,
      fileList,
      onFileChange,
      onFileRemove,
      onFileDismiss,
      accept,
      maxCount,
      maxSize,
      onFileError,
      dropTarget,
      suggestions,
      onSuggestionAccept,
      commands,
      onCommandSelect,
      size,
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

  const isSmall = size === 'small';
  // size="small" is one row until the text needs a second line; then it uses the full layout
  const isCompactRow = isSmall && !isExpanded;
  const compactLayout = getChatInputCompactLayout(theme);

  const filePreviewContent = (
    <AnimatePresence>
      {hasFiles ? (
        <BaseMotionBox motionVariants={filePreviewMotionVariants}>
          <HiddenScrollbarBox
            ref={fileScrollRef}
            display="flex"
            flexDirection="row"
            gap="spacing.3"
            paddingTop="spacing.4"
            paddingX="spacing.4"
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

  const topContent = (
    <>
      {header ? (
        <BaseBox
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
          alignItems="center"
          gap="spacing.3"
          paddingTop="spacing.4"
          paddingX="spacing.4"
        >
          {header}
        </BaseBox>
      ) : null}
      {filePreviewContent}
    </>
  );

  // The "+": opens actionMenu when there is one, or the file picker
  const getLeadingAction = (buttonSize: 'small' | 'xsmall'): React.ReactElement | null => {
    if (actionMenu) {
      return (
        <Menu>
          <ChatInputButton
            icon={PlusIcon}
            size={buttonSize}
            accessibilityLabel="Add files and more"
            isDisabled={isDisabled}
          />
          {actionMenu}
        </Menu>
      );
    }
    if (hideFileUpload) return null;
    return (
      <ChatInputButton
        icon={PlusIcon}
        size={buttonSize}
        accessibilityLabel="Upload file"
        isDisabled={isDisabled}
        onClick={handleUploadClick}
      />
    );
  };

  const getSubmitAction = (buttonSize: 'small' | 'xsmall'): React.ReactElement => (
    <ChatInputSubmit
      status={resolvedStatus}
      hasContent={hasContent}
      isSubmitDisabled={isSubmitDisabled}
      isDisabled={isDisabled}
      size={buttonSize}
      onSubmit={handleSubmit}
      onStop={onStop}
    />
  );

  const compactLeading = getLeadingAction('xsmall');
  const compactLeadingAction = compactLeading ? (
    <BaseBox
      display="flex"
      paddingLeft={makeSpace(compactLayout.leadingPaddingLeft)}
      paddingBottom={makeSpace(compactLayout.leadingBottomInset)}
      marginRight={makeSpace(compactLayout.leadingMarginRight)}
    >
      {compactLeading}
    </BaseBox>
  ) : undefined;

  const compactTrailingAction = (
    <BaseBox
      display="flex"
      paddingBottom={makeSpace(compactLayout.trailingBottomInset)}
      marginLeft={makeSpace(compactLayout.trailingMarginLeft)}
      marginRight={makeSpace(compactLayout.trailingMarginRight)}
    >
      {getSubmitAction('xsmall')}
    </BaseBox>
  );

  const actionBarContent = (
    <ChatInputActionBar
      leadingAction={getLeadingAction('small')}
      submitAction={getSubmitAction('small')}
    />
  );

  const isError = validationState === 'error';
  const textAreaPadding = makeSpace(compactLayout.textAreaPadding);

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

      {commandMenu.isOpen ? (
        <ChatInputCommandMenu
          listboxId={commandMenu.listboxId}
          commands={commandMenu.items}
          activeIndex={commandMenu.activeIndex}
          getOptionId={commandMenu.getOptionId}
          onSelect={commandMenu.select}
          onActiveIndexChange={commandMenu.setActiveIndex}
        />
      ) : null}

      <ChatInputCardBox
        $isCompactRow={isCompactRow}
        position="relative"
        zIndex={1}
        onMouseDownCapture={handleInnerMouseDownCapture}
        {...dropZoneProps}
        {...(isDisabled ? {} : hoverHandlers)}
      >
        <BaseInput
          ref={combinedRef}
          as="textarea"
          id="chat-input"
          elevation="lowRaised"
          focusIndicator="border"
          hoverIndicator="none"
          label={undefined}
          accessibilityLabel={accessibilityLabel}
          hideLabelText
          hideFormHint
          placeholder={showGhostSuggestion ? '' : placeholder}
          value={textValue}
          onChange={handleTextChange}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          isDisabled={isDisabled}
          numberOfLines={1}
          size="medium"
          padding={textAreaPadding}
          borderRadius={chatInputBorderRadius}
          caretColor="interactive.text.primary.normal"
          activeDescendant={
            commandMenu.isOpen ? commandMenu.getOptionId(commandMenu.activeIndex) : undefined
          }
          topContent={topContent}
          bottomContent={isCompactRow ? undefined : actionBarContent}
          leadingInteractionElement={isCompactRow ? compactLeadingAction : undefined}
          trailingInteractionElement={isCompactRow ? compactTrailingAction : undefined}
          visualsAlignment={isCompactRow ? 'bottom' : undefined}
          inputRowOverlay={
            showGhostSuggestion && suggestions ? (
              <BaseBox
                position="absolute"
                top={textAreaPadding}
                // in the one-row compact size, start where the typed text starts and stop before Send
                left={
                  isCompactRow && compactLeadingAction
                    ? makeSpace(compactLayout.textStartWithLeading)
                    : textAreaPadding
                }
                right={
                  isCompactRow ? makeSpace(compactLayout.textEndBeforeTrailing) : textAreaPadding
                }
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

        {showAmbientBorder && !isDisabled && !isError ? (
          <ChatInputAmbientBorder isActive={isFocused} />
        ) : null}

        {/* while focused the border is already blue, so the hover glow steps aside */}
        {isDisabled || isFocused ? null : hoverBorder}

        {isDraggingFiles ? (
          <BaseBox
            position="absolute"
            top="spacing.0"
            right="spacing.0"
            bottom="spacing.0"
            left="spacing.0"
            zIndex={2}
            display="flex"
            alignItems="center"
            justifyContent="center"
            pointerEvents="none"
            borderRadius={chatInputBorderRadius}
            borderWidth="thin"
            borderStyle="dashed"
            borderColor="interactive.border.primary.default"
            backgroundColor="surface.background.primary.subtle"
          >
            <Text size="medium" weight="medium" color="interactive.text.primary.normal">
              Drop files to attach
            </Text>
          </BaseBox>
        ) : null}
      </ChatInputCardBox>

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
