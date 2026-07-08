import React from 'react';
import { ScrollView, LayoutAnimation, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import type { ChatInputProps } from './types';
import { chatInputFilePreviewItemWidthNative } from './chatInputTokens';
import { ChatInputActionBar } from './ChatInputActionBar';
import { useChatInput } from './useChatInput';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { IconButton } from '~components/Button/IconButton';
import { FileUploadItem } from '~components/FileUpload/FileUploadItem';
import { CloseIcon, InfoIcon } from '~components/Icons';
import { BaseInput } from '~components/Input/BaseInput/BaseInput';
import { Text } from '~components/Typography';
import { castNativeType, makeSpace } from '~utils';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import getIn from '~utils/lodashButBetter/get';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
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
    testID,
    ...rest
  },
  ref,
) => {
  const { theme } = useTheme();
  const inputId = React.useId();

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
      isDisabled,
      isGenerating,
      onStop,
      fileList,
      onFileChange,
      onFileRemove,
      onFileDismiss,
    },
    ref,
  );

  const isError = validationState === 'error';

  const errorProgress = useSharedValue(isError ? 1 : 0);

  React.useEffect(() => {
    const duration = getIn(theme.motion, 'duration.xmoderate') as number;

    errorProgress.value = withTiming(isError ? 1 : 0, {
      duration,
      easing: castNativeType(theme.motion.easing.emphasized),
    });
  }, [isError]);

  // Mirror web's `bottom: calc(100% - 12px)` — overlap the input card by spacing.4 (12px)
  // so the banner's square bottom edge tucks behind the input and the shapes read as one.
  const errorOverlap = getIn(theme, 'spacing.4') as number;

  const errorAnimatedStyle = useAnimatedStyle(() => ({
    opacity: errorProgress.value,
    transform: [{ translateY: errorOverlap + (1 - errorProgress.value) * 20 }],
  }));

  const [inputContainerHeight, setInputContainerHeight] = React.useState(0);

  const prevHasFiles = React.useRef(hasFiles);
  React.useEffect(() => {
    if (hasFiles !== prevHasFiles.current) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      prevHasFiles.current = hasFiles;
    }
  }, [hasFiles]);

  const filePreviewContent = hasFiles ? (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        gap: getIn(theme, 'spacing.3') as number,
        paddingTop: getIn(theme, 'spacing.5') as number,
        paddingHorizontal: getIn(theme, 'spacing.5') as number,
      }}
    >
      {files.map((file) => (
        <View key={file.id ?? file.name} style={{ width: chatInputFilePreviewItemWidthNative }}>
          <FileUploadItem
            file={file}
            onRemove={() => handleFileRemove(file)}
            onDismiss={() => handleFileDismiss(file)}
            onReupload={onFileReupload ? () => onFileReupload({ file }) : undefined}
          />
        </View>
      ))}
    </ScrollView>
  ) : null;

  const actionBarContent = (
    <ChatInputActionBar
      isDisabled={isDisabled}
      isGenerating={isGenerating}
      isSubmitDisabled={isSubmitDisabled}
      hideFileUpload={hideFileUpload}
      onUploadClick={() => onFileChange?.({ fileList: files })}
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
      {/* Error popup — animated above the input */}
      {isError ? (
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
          numberOfLines={2}
          size="medium"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus}
          padding={makeSpace(theme.spacing[5])}
          borderRadius="large"
          caretColor="surface.icon.onSea.onSubtle"
          topContent={filePreviewContent}
          bottomContent={actionBarContent}
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
export type { ChatInputProps };
