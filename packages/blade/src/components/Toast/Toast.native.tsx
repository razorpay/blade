import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import type { ToastProps } from './types';
import { toastStore } from './useToast.native';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { IconButton } from '~components/Button/IconButton';
import { Text } from '~components/Typography';
import {
  AlertOctagonIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  CloseIcon,
  InfoIcon,
} from '~components/Icons';

const iconMap = {
  positive: CheckCircleIcon,
  negative: AlertOctagonIcon,
  information: InfoIcon,
  neutral: InfoIcon,
  notice: AlertTriangleIcon,
} as const;

const ENTER_DURATION_MS = 240;
const EXIT_DURATION_MS = 200;

const Toast = (
  props: ToastProps & {
    isVisible?: boolean;
  },
): React.ReactElement => {
  const {
    type = 'informational',
    content,
    color = 'neutral',
    leading: Leading,
    action,
    id,
    isVisible = true,
    onDismissButtonClick,
  } = props;

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: isVisible ? 1 : 0,
        duration: isVisible ? ENTER_DURATION_MS : EXIT_DURATION_MS,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: isVisible ? 0 : 40,
        duration: isVisible ? ENTER_DURATION_MS : EXIT_DURATION_MS,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isVisible, opacity, translateY]);

  const isPromotional = type === 'promotional';
  const Icon = Leading ?? iconMap[color];

  // The public `ToastProps` types `event` as a web `MouseEvent` so consumers
  // can write platform-agnostic handlers. Native has no MouseEvent equivalent
  // and Blade's Platform.Select-branded `onClick` doesn't let us pass a
  // GestureResponderEvent through. Surface a typed empty stand-in (not `any`)
  // so consumers reading `event` get a typed object and the lint smell goes
  // away. Tracking a follow-up to platform-conditional the event type.
  const stubEvent = ({} as unknown) as React.MouseEvent<HTMLButtonElement>;

  const handleDismiss = (): void => {
    onDismissButtonClick?.({
      event: stubEvent,
      toastId: id ?? '',
    });
    if (id) toastStore.dismiss(id);
  };

  const handleActionClick = (): void => {
    if (!action) return;
    action.onClick?.({ event: stubEvent, toastId: id ?? '' });
  };

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <Box
        // Native Box validates background tokens at runtime (rejects anything
        // outside `transparent` / `surface.background.*` / `overlay.*` /
        // `feedback.background.*`). Web's `popup.background.*` choices map to:
        //   - promotional → `surface.background.gray.intense` (dark surface)
        //   - color variants → `feedback.background.${color}.subtle`
        backgroundColor={
          isPromotional
            ? 'surface.background.gray.intense'
            : (`feedback.background.${color}.subtle` as 'feedback.background.positive.subtle')
        }
        borderRadius="medium"
        padding="spacing.4"
        flexDirection="row"
        alignItems="center"
        elevation="midRaised"
        marginBottom="spacing.3"
      >
        <Box marginRight="spacing.3">
          <Icon
            size="medium"
            color={
              isPromotional
                ? 'surface.icon.staticWhite.normal'
                : (`feedback.icon.${color}.intense` as 'feedback.icon.positive.intense')
            }
          />
        </Box>
        <Box flex={1}>
          {typeof content === 'string' ? (
            <Text
              size="medium"
              color={
                isPromotional
                  ? 'surface.text.staticWhite.normal'
                  : 'surface.text.gray.normal'
              }
            >
              {content}
            </Text>
          ) : (
            content
          )}
        </Box>
        {action ? (
          <Box marginLeft="spacing.3">
            <Button
              size="small"
              variant="tertiary"
              isLoading={action.isLoading}
              onClick={handleActionClick}
            >
              {action.text}
            </Button>
          </Box>
        ) : null}
        <Box marginLeft="spacing.2">
          <IconButton
            icon={CloseIcon}
            size="small"
            accessibilityLabel="Dismiss"
            onClick={handleDismiss}
          />
        </Box>
      </Box>
    </Animated.View>
  );
};

export { Toast };
