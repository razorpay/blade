import React from 'react';
import { ScrollView, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { ChatInputProps } from './types';
import { chatInputFilePreviewItemWidthNative, chatInputMaxTextAreaHeight } from './chatInputTokens';
import {
  ChatInputActionBar,
  ChatInputSubmitAction,
  ChatInputUploadAction,
} from './ChatInputActionBar';
import { useChatInput } from './useChatInput';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { minHeight as buttonMinHeight } from '~components/Button/BaseButton/buttonTokens';
import { IconButton } from '~components/Button/IconButton';
import { FileUploadItem } from '~components/FileUpload/FileUploadItem';
import { CloseIcon, InfoIcon } from '~components/Icons';
import { BaseInput } from '~components/Input/BaseInput/BaseInput';
import { inputDropdownButtonPadding } from '~components/Input/BaseInput/baseInputTokens';
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
  const isSmall = size === 'small';
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
    isSubmitDisabled,
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
      fileList,
      onFileRemove,
      onFileDismiss,
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
        paddingTop: getIn(theme, 'spacing.5') as number,
        paddingHorizontal: getIn(theme, 'spacing.5') as number,
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

  const handleUploadClick = (): void => onFileChange?.({ fileList: files });

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
  // text area grows. Same insets as web: the submit button is centred on a single line of text and
  // the upload icon sits on the text line.
  const inlineActionBottomInset = makeSpace(
    (theme.spacing[5] * 2 + theme.typography.lineHeights[100] - buttonMinHeight.small) / 2,
  );
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
          elevation="highRaised"
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
          numberOfLines={isSmall ? 1 : 2}
          autoGrowMaxHeight={chatInputMaxTextAreaHeight}
          size="medium"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus}
          padding={makeSpace(theme.spacing[5])}
          borderRadius="large"
          caretColor="surface.icon.onSea.onSubtle"
          topContent={filePreviewContent}
          bottomContent={isSmall ? undefined : actionBarContent}
          leadingInteractionElement={isSmall ? inlineUploadAction : undefined}
          trailingInteractionElement={isSmall ? inlineSubmitAction : undefined}
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
