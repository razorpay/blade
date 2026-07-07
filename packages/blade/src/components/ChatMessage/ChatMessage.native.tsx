import React, { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { SelfMessageBubble } from './SelfMessageBubble.native';
import { DefaultMessageBubble } from './DefaultMessageBubble.native';
import { ThumbnailPreview } from './ThumbnailPreview.native';
import type { ChatMessageProps } from './types';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getStringFromReactText } from '~utils/getStringChildren';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import type { BladeElementRef } from '~utils/types';
import getIn from '~utils/lodashButBetter/get';
import { useTheme } from '~components/BladeProvider';
import { castNativeType } from '~utils';
import { makeMotionTime } from '~utils/makeMotionTime';

/**
 * Inline RollingText fallback for native: cycles through an array of strings
 * with a fade/slide transition using reanimated.
 */
const NativeRollingText = ({ texts }: { texts: string[] }): React.ReactElement => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { theme } = useTheme();
  const duration = castNativeType(makeMotionTime(getIn(theme.motion, 'duration.moderate')));
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (texts.length <= 1) return undefined;

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const interval = setInterval(() => {
      opacity.value = withTiming(0, {
        duration: duration / 2,
        easing: Easing.out(Easing.ease),
      });
      translateY.value = withTiming(-12, {
        duration: duration / 2,
        easing: Easing.out(Easing.ease),
      });

      timeoutId = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
        translateY.value = 12;
        opacity.value = 0;
        opacity.value = withTiming(1, {
          duration: duration / 2,
          easing: Easing.in(Easing.ease),
        });
        translateY.value = withTiming(0, {
          duration: duration / 2,
          easing: Easing.in(Easing.ease),
        });
      }, duration / 2);
    }, 2500);

    return () => {
      clearInterval(interval);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [texts.length, duration, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Text
        color="feedback.text.positive.intense"
        weight="regular"
        variant="body"
        size="medium"
      >
        {texts[currentIndex]}
      </Text>
    </Animated.View>
  );
};

const _ChatMessage: React.ForwardRefRenderFunction<BladeElementRef, ChatMessageProps> = (
  {
    messageType = 'default',
    senderType = 'self',
    isLoading = false,
    validationState = 'none',
    errorText,
    onClick,
    footerActions,
    children,
    leading,
    loadingText,
    wordBreak = 'break-word',
    maxWidth,
    thumbnails,
    onThumbnailClick,
    reasoningTraces,
    reasoningStatus,
    reasoningTitle,
    reasoningActiveStepIndex,
    ...props
  }: ChatMessageProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  void messageType;

  const shouldWrapInText =
    typeof children === 'string' ||
    (Array.isArray(children) && children.every((child) => typeof child === 'string')) ||
    isLoading;

  const loadingContent =
    isLoading && Array.isArray(loadingText) ? (
      <NativeRollingText texts={loadingText} />
    ) : (
      loadingText
    );

  const finalChildren = shouldWrapInText ? (
    <Text
      color={
        isLoading
          ? Array.isArray(loadingText)
            ? 'feedback.text.positive.intense'
            : 'surface.text.gray.muted'
          : 'surface.text.gray.normal'
      }
      weight="regular"
      variant="body"
      size="medium"
    >
      {isLoading ? loadingContent : getStringFromReactText(children as string | string[])}
    </Text>
  ) : (
    (children as React.ReactElement)
  );

  const messageBubble =
    senderType === 'self' ? (
      <SelfMessageBubble
        validationState={validationState}
        errorText={errorText}
        children={finalChildren}
        isChildText={shouldWrapInText}
      />
    ) : (
      <DefaultMessageBubble
        children={finalChildren}
        leading={leading}
        isLoading={isLoading}
        footerActions={footerActions}
        isChildText={shouldWrapInText}
        reasoningTraces={reasoningTraces}
        reasoningStatus={reasoningStatus}
        reasoningTitle={reasoningTitle}
        reasoningActiveStepIndex={reasoningActiveStepIndex}
      />
    );

  const imagePreviewAlignment = senderType === 'self' ? 'flex-end' : 'flex-start';

  const messageContent = (
    <BaseBox ref={ref as never} display="flex" flexDirection="column" gap="spacing.3">
      {thumbnails && thumbnails.length > 0 ? (
        <BaseBox alignSelf={imagePreviewAlignment}>
          <ThumbnailPreview thumbnails={thumbnails} onThumbnailClick={onThumbnailClick} />
        </BaseBox>
      ) : null}
      <BaseBox
        {...metaAttribute({ name: MetaConstants.ChatMessage, testID: props.testID })}
        {...makeAnalyticsAttribute(props)}
        {...getStyledProps(props)}
        maxWidth={maxWidth}
      >
        {messageBubble}
      </BaseBox>
    </BaseBox>
  );

  if (onClick) {
    return <Pressable onPress={onClick}>{messageContent}</Pressable>;
  }

  return messageContent;
};

const ChatMessage = assignWithoutSideEffects(React.forwardRef(_ChatMessage), {
  displayName: 'ChatMessage',
  componentId: MetaConstants.ChatMessage,
});

export { ChatMessage };
