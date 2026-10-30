import React from 'react';
import { ScrollView, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { ChatInputProps } from './types';
import {
  chatInputBorderRadius,
  chatInputFilePreviewItemWidthNative,
  chatInputMaxTextAreaHeight,
} from './chatInputTokens';
import { ChatInputActionBar } from './ChatInputActionBar';
import { ChatInputButton } from './ChatInputButton';
import { ChatInputSubmit } from './ChatInputSubmit';
import { getChatInputCompactLayout } from './getChatInputCompactLayout';
import { useChatInput } from './useChatInput';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { IconButton } from '~components/Button/IconButton';
import { FileUploadItem } from '~components/FileUpload/FileUploadItem';
import { CloseIcon, InfoIcon, PlusIcon } from '~components/Icons';
import { BaseInput } from '~components/Input/BaseInput/BaseInput';
import { Text } from '~components/Typography';
import { castNativeType, makeSpace } from '~utils';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import getIn from '~utils/lodashButBetter/get';
import { makeAccessible } from '~utils/makeAccessible';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { useId } from '~utils/useId';
import { throwBladeError } from '~utils/logger';
import type { BladeElementRef } from '~utils/types';

const _ChatInput: React.ForwardRefRenderFunction<BladeElementRef, ChatInputProps> = (
  {
    value,
    defaultValue,
    onChange,
    onFocus,
    onBlur,
    onSubmit,
    clearOnSubmit = false,
    placeholder = 'Ask a question...',
    size = 'medium',
    status,
    header,
    isDisabled = false,
    isGenerating = false,
    onStop,
    fileList,
    onFileChange,
    onFileRemove,
    onFileDismiss,
    onFileReupload,
    validationState,
    errorText,
    onErrorDismiss,
    hideFileUpload = false,
    autoFocus = false,
    accessibilityLabel = 'Chat input',
    accept: _accept,
    testID,
    ...rest
  },
  ref,
) => {
  const { theme } = useTheme();
  const inputId = useId('chatinput');

  if (__DEV__) {
    if (_accept) {
      throwBladeError({
        message:
          'The `accept` prop has no effect on React Native. File filtering should be handled by your file picker (see onFileChange).',
        moduleName: 'ChatInput',
      });
    }
  }

  const themeMotionRef = React.useRef(theme.motion);
  themeMotionRef.current = theme.motion;

  const {
    mergedRef,
    textValue,
    files,
    hasFiles,
    hasContent,
    isSubmitDisabled,
    resolvedStatus,
    handleTextChange,
    handleSubmit,
    handleFileRemove,
    handleFileDismiss,
  } = useChatInput(
    {
      value,
      defaultValue,
      onChange,
      onSubmit,
      clearOnSubmit,
      fileList,
      onFileRemove,
      onFileDismiss,
      status,
      isGenerating,
      onStop,
    },
    ref,
  );

  const isError = validationState === 'error';

  const errorProgress = useSharedValue(isError ? 1 : 0);
  const [isErrorBannerVisible, setIsErrorBannerVisible] = React.useState(isError);

  React.useEffect(() => {
    const motion = themeMotionRef.current;
    const duration = getIn(motion, 'duration.xmoderate') as number;

    if (isError) {
      setIsErrorBannerVisible(true);
      errorProgress.value = withTiming(1, {
        duration,
        easing: castNativeType(motion.easing.emphasized),
      });
    } else {
      errorProgress.value = withTiming(
        0,
        { duration, easing: castNativeType(motion.easing.emphasized) },
        (finished) => {
          if (finished) {
            runOnJS(setIsErrorBannerVisible)(false);
          }
        },
      );
    }
  }, [isError]);

  // Mirror web's `bottom: calc(100% - 12px)` — overlap the input card by spacing.4 (12px)
  // so the banner's square bottom edge tucks behind the input and the shapes read as one.
  const errorOverlap = getIn(theme, 'spacing.4') as number;

  const errorAnimatedStyle = useAnimatedStyle(() => ({
    opacity: errorProgress.value,
    transform: [{ translateY: errorOverlap + (1 - errorProgress.value) * 20 }],
  }));

  const [inputContainerHeight, setInputContainerHeight] = React.useState(0);

  const fileScrollRef = React.useRef<ScrollView>(null);
  const prevFileCountRef = React.useRef(files.length);

  React.useEffect(() => {
    const prevCount = prevFileCountRef.current;
    prevFileCountRef.current = files.length;
    if (files.length > prevCount) {
      fileScrollRef.current?.scrollToEnd({ animated: true });
    }
  }, [files.length]);

  const filePreviewContent = hasFiles ? (
    <ScrollView
      ref={fileScrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      accessible={false}
      contentContainerStyle={{
        gap: getIn(theme, 'spacing.3') as number,
        paddingTop: getIn(theme, 'spacing.4') as number,
        paddingHorizontal: getIn(theme, 'spacing.4') as number,
      }}
    >
      {files.map((file, index) => (
        <View
          key={file.id ?? `${file.name}-${index}`}
          style={{ width: chatInputFilePreviewItemWidthNative }}
        >
          <FileUploadItem
            _isCompact
            file={file}
            onRemove={() => handleFileRemove(file)}
            onDismiss={() => handleFileDismiss(file)}
            onReupload={onFileReupload ? () => onFileReupload({ file }) : undefined}
          />
        </View>
      ))}
    </ScrollView>
  ) : null;

  const isSmall = size === 'small';
  const compactLayout = getChatInputCompactLayout(theme);

  const getLeadingAction = (buttonSize: 'small' | 'xsmall'): React.ReactElement | null =>
    hideFileUpload ? null : (
      <ChatInputButton
        icon={PlusIcon}
        size={buttonSize}
        accessibilityLabel="Upload file"
        isDisabled={isDisabled}
        onClick={() => onFileChange?.({ fileList: files })}
      />
    );

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

  const actionBarContent = (
    <ChatInputActionBar
      leadingAction={getLeadingAction('small')}
      submitAction={getSubmitAction('small')}
    />
  );

  // size="small": the "+" and Send sit inline with the text and stay on the bottom row as it grows
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

  return (
    <BaseBox
      position="relative"
      {...metaAttribute({ name: MetaConstants.ChatInput, testID })}
      {...getStyledProps(rest)}
    >
      {/* Error popup — animated above the input */}
      {isErrorBannerVisible && errorText ? (
        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: inputContainerHeight,
              left: 0,
              right: 0,
              zIndex: 0,
            },
            errorAnimatedStyle,
          ]}
        >
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
            {...makeAccessible({ role: 'alert' })}
          >
            <InfoIcon size="small" color="feedback.icon.negative.intense" />
            <BaseBox flexShrink={1} flexGrow={1}>
              <Text size="small" truncateAfterLines={8} color="feedback.text.negative.intense">
                {errorText}
              </Text>
            </BaseBox>
            {onErrorDismiss ? (
              <IconButton
                icon={CloseIcon}
                size="small"
                emphasis="intense"
                accessibilityLabel="Dismiss error"
                onClick={() => onErrorDismiss()}
              />
            ) : null}
          </BaseBox>
        </Animated.View>
      ) : null}

      <BaseBox
        position="relative"
        zIndex={1}
        onLayout={(e) => setInputContainerHeight(e.nativeEvent.layout.height)}
      >
        <BaseInput
          ref={mergedRef}
          as="textarea"
          id={inputId}
          elevation="lowRaised"
          focusIndicator="border"
          label={undefined}
          accessibilityLabel={accessibilityLabel}
          hideLabelText
          hideFormHint
          placeholder={placeholder}
          value={textValue}
          onChange={handleTextChange}
          onFocus={onFocus}
          onBlur={onBlur}
          isDisabled={isDisabled}
          numberOfLines={1}
          autoGrowMaxHeight={chatInputMaxTextAreaHeight}
          autoGrowMinHeight={isSmall ? compactLayout.singleRowHeight : undefined}
          size="medium"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus}
          padding={makeSpace(compactLayout.textAreaPadding)}
          borderRadius={chatInputBorderRadius}
          caretColor="interactive.text.primary.normal"
          topContent={topContent}
          bottomContent={isSmall ? undefined : actionBarContent}
          leadingInteractionElement={isSmall ? compactLeadingAction : undefined}
          trailingInteractionElement={isSmall ? compactTrailingAction : undefined}
          visualsAlignment={isSmall ? 'bottom' : undefined}
          {...makeAnalyticsAttribute(rest)}
        />
      </BaseBox>
    </BaseBox>
  );
};

const ChatInput = assignWithoutSideEffects(React.forwardRef(_ChatInput), {
  componentId: MetaConstants.ChatInput,
  displayName: 'ChatInput',
});

export { ChatInput };
