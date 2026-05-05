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

  const handleDismiss = (): void => {
    onDismissButtonClick?.({
      // Native has no MouseEvent; surface a minimal stand-in for type compat.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      event: {} as any,
      toastId: id ?? '',
    });
    if (id) toastStore.dismiss(id);
  };

  const handleActionClick = (): void => {
    if (!action) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    action.onClick?.({ event: {} as any, toastId: id ?? '' });
  };

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <Box
        backgroundColor={
          isPromotional
            ? 'popup.background.gray.intense'
            : `popup.background.${color}.subtle`
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
                ? 'staticWhite'
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
