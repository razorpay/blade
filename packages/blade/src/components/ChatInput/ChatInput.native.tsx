import React from 'react';
import { ScrollView, LayoutAnimation, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import type { ChatInputProps } from './types';
import { chatInputFilePreviewItemWidthNative } from './chatInputTokens';
import { ChatInputActionBar } from './ChatInputActionBar';
import { useChatInput } from './useChatInput';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { IconButton } from '~components/Button/IconButton';
import { CloseIcon, InfoIcon } from '~components/Icons';
import { BaseInput } from '~components/Input/BaseInput/BaseInput';
import { Text } from '~components/Typography';
import { makeSpace } from '~utils';
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
    const easingValues = getIn(theme.motion, 'easing.emphasized') as number[];

    errorProgress.value = withTiming(isError ? 1 : 0, {
      duration,
      easing: Easing.bezier(easingValues[0], easingValues[1], easingValues[2], easingValues[3]),
    });
  }, [isError]);

  const errorAnimatedStyle = useAnimatedStyle(() => ({
    opacity: errorProgress.value,
    transform: [{ translateY: (1 - errorProgress.value) * 20 }],
  }));

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
        <View
          key={file.id ?? file.name}
          style={{
            width: chatInputFilePreviewItemWidthNative,
            flexDirection: 'row',
            alignItems: 'center',
            padding: getIn(theme, 'spacing.2') as number,
            backgroundColor: getIn(theme, 'colors.surface.background.gray.moderate') as string,
            borderRadius: getIn(theme, 'border.radius.medium') as number,
            gap: getIn(theme, 'spacing.2') as number,
          }}
        >
          <BaseBox flexShrink={1}>
            <Text size="small" truncateAfterLines={1}>
              {file.name}
            </Text>
          </BaseBox>
          <IconButton
            icon={CloseIcon}
            size="small"
            emphasis="intense"
            accessibilityLabel={`Remove ${file.name}`}
            onClick={() => {
              if (file.status === 'uploading') {
                handleFileDismiss(file);
              } else {
                handleFileRemove(file);
              }
            }}
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
              bottom: '100%',
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
          placeholder={placeholder}
          value={textValue}
          onChange={handleTextChange}
          onFocus={onFocus}
          onBlur={onBlur}
          isDisabled={isDisabled}
          numberOfLines={2}
          size="medium"
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
