import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import type { ToastProps } from './types';
import { toastStore } from './useToast.native';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { IconButton } from '~components/Button/IconButton';
import { Text } from '~components/Typography';
import { useTheme } from '~components/BladeProvider';
import getIn from '~utils/lodashButBetter/get';
import { castNativeType } from '~utils';
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

  const { theme } = useTheme();
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
  // Web parity: promotional toasts only render an explicitly-passed leading icon.
  const Icon = isPromotional ? Leading : Leading ?? iconMap[color];

  // Same tokens as Toast.web. Applied via theme lookup because native Box's
  // runtime backgroundColor validation doesn't allow `popup.background.*`.
  const backgroundColor = getIn(
    theme.colors,
    isPromotional ? 'popup.background.gray.moderate' : `popup.background.${color}.moderate`,
  );
  const borderColor = getIn(
    theme.colors,
    isPromotional ? 'popup.border.gray.moderate' : `popup.border.${color}.moderate`,
  );

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

  const actionButton = action ? (
    <Button
      size="xsmall"
      variant={isPromotional ? 'secondary' : 'tertiary'}
      color={isPromotional ? 'primary' : 'white'}
      isLoading={action.isLoading}
      onClick={handleActionClick}
    >
      {action.text}
    </Button>
  ) : null;

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <View
        style={[
          {
            borderRadius: theme.border.radius.medium,
            borderWidth: theme.border.width.thin,
            borderColor,
            marginBottom: theme.spacing[3],
          },
          castNativeType(theme.elevation.midRaised),
        ]}
      >
        {/* popup.background.* tokens are semi-transparent — web pairs them with
            backdropFilter blur, which RN doesn't support, so content would bleed
            through. Back the toast with an opaque surface first (same workaround
            as TooltipContentWrapper.native). */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: theme.colors.surface.background.gray.intense,
            borderRadius: theme.border.radius.medium,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor,
            borderRadius: theme.border.radius.medium,
            paddingHorizontal: theme.spacing[4],
            paddingVertical: isPromotional ? theme.spacing[4] : theme.spacing[3],
          }}
        >
          {Icon ? (
            <Box
              marginRight="spacing.3"
              alignSelf={isPromotional ? 'flex-start' : 'center'}
              marginTop={isPromotional ? 'spacing.1' : 'spacing.0'}
            >
              <Icon
                size="medium"
                color={isPromotional ? 'surface.icon.gray.normal' : 'surface.icon.staticWhite.normal'}
              />
            </Box>
          ) : null}
          <Box flex={1}>
            {typeof content === 'string' ? (
              <Text
                size="small"
                color={isPromotional ? 'surface.text.gray.normal' : 'surface.text.staticWhite.normal'}
              >
                {content}
              </Text>
            ) : (
              content
            )}
            {isPromotional && actionButton ? (
              <Box marginTop="spacing.3" alignSelf="flex-start">
                {actionButton}
              </Box>
            ) : null}
          </Box>
          {!isPromotional && actionButton ? (
            <Box marginLeft="spacing.3">{actionButton}</Box>
          ) : null}
          <Box marginLeft="spacing.2" alignSelf={isPromotional ? 'flex-start' : 'center'}>
            <IconButton
              icon={CloseIcon}
              size="small"
              emphasis={isPromotional ? 'intense' : 'subtle'}
              accessibilityLabel="Dismiss"
              onClick={handleDismiss}
            />
          </Box>
        </View>
      </View>
    </Animated.View>
  );
};

export { Toast };
