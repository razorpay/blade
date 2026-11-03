/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import toast from 'react-hot-toast';
import type { FlattenSimpleInterpolation } from 'styled-components';
import styled, { css, keyframes } from 'styled-components';
import type { ToastProps } from './types';
import { TOAST_PROGRESS_BAR_HEIGHT } from './constants';
import { castWebType, makeMotionTime, makeSize, useTheme } from '~utils';
import getIn from '~utils/lodashButBetter/get';
import { makeAccessible } from '~utils/makeAccessible';
import { MAKE_ANALYTICS_CONSTANTS } from '~utils/makeAnalyticsAttribute/makeAnalyticsConstants';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { IconButton } from '~components/Button/IconButton';
import { Link } from '~components/Link';
import {
  AlertOctagonIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  CloseIcon,
  InfoIcon,
} from '~components/Icons';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';

const iconMap = {
  positive: CheckCircleIcon,
  negative: AlertOctagonIcon,
  information: InfoIcon,
  neutral: InfoIcon,
  notice: AlertTriangleIcon,
};

const borderColorMap = {
  positive: 'popup.border.positive.moderate',
  negative: 'popup.border.negative.moderate',
  notice: 'popup.border.notice.moderate',
  information: 'popup.border.information.moderate',
  neutral: 'popup.border.neutral.moderate',
} as const;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(100%);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }

  to {
    opacity: 0;
    transform: translateY(100%);
  }
`;

const shrink = keyframes`
  from {
    transform: scaleX(1);
  }

  to {
    transform: scaleX(0);
  }
`;

const ToastProgressBar = styled(BaseBox)<{
  duration: number;
  isRunning: boolean;
}>(
  ({ duration, isRunning, theme }) => css`
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: ${makeSize(TOAST_PROGRESS_BAR_HEIGHT)};
    background-color: ${theme.colors.interactive.background.neutral.default};
    transform-origin: left;
    animation: ${shrink} ${makeMotionTime(duration)} ${castWebType(theme.motion.easing.linear)}
      forwards;
    animation-play-state: ${isRunning ? 'running' : 'paused'};
  `,
);

/**
 * Runs the auto dismiss timer of a promotional toast.
 *
 * react-hot-toast pauses all toasts together and starts the timer at show.
 * This timer starts after `introDuration` and pauses for this toast only.
 */
const useAutoDismissTimer = ({
  id,
  duration,
  introDuration,
  isEnabled,
}: {
  id?: string;
  duration: number;
  introDuration: number;
  isEnabled: boolean;
}): {
  isRunning: boolean;
  pauseHandlers: Pick<
    React.DOMAttributes<HTMLDivElement>,
    'onMouseEnter' | 'onMouseLeave' | 'onFocus' | 'onBlur'
  >;
} => {
  const [hasStarted, setHasStarted] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const remainingTime = React.useRef(duration);
  const isPaused = isHovered || isFocused;

  React.useEffect(() => {
    if (!isEnabled) return undefined;
    const introTimeout = setTimeout(() => setHasStarted(true), introDuration);
    return () => clearTimeout(introTimeout);
  }, [isEnabled, introDuration]);

  React.useEffect(() => {
    if (!isEnabled || !hasStarted || isPaused) return undefined;
    const resumedAt = Date.now();
    const dismissTimeout = setTimeout(() => toast.dismiss(id), remainingTime.current);
    return () => {
      clearTimeout(dismissTimeout);
      remainingTime.current -= Date.now() - resumedAt;
    };
  }, [id, isEnabled, hasStarted, isPaused]);

  return {
    isRunning: hasStarted && !isPaused,
    pauseHandlers: {
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      onFocus: () => setIsFocused(true),
      onBlur: (event) => {
        // Stay paused while focus moves to another element inside the toast
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsFocused(false);
        }
      },
    },
  };
};

const AnimatedFade = styled(BaseBox)<{
  animationType: FlattenSimpleInterpolation | null;
  toastBorderColor: string;
}>(({ animationType, toastBorderColor, theme }) => {
  const borderShadow = `inset 0 0 0 1px ${toastBorderColor}`;
  const highlightShadow = `inset 0px 1.5px 0px 0px ${theme.colors.interactive.background.staticWhite.fadedHighlighted}`;
  const backdropBlur = theme.backdropBlur.medium;

  return css`
    overflow: hidden;
    box-shadow: ${theme.elevation.midRaised}, ${borderShadow}, ${highlightShadow};
    backdrop-filter: blur(${backdropBlur}px);
    ${animationType}
  `;
});

const Toast = ({
  type,
  color = 'neutral',
  leading,
  action,
  content,
  onDismissButtonClick,
  autoDismiss,
  duration = Infinity,
  introDuration = 0,
  showProgressBar = false,
  isVisible,
  id,
}: ToastProps & {
  isVisible?: boolean;
}): React.ReactElement => {
  const { theme } = useTheme();
  const isPromotional = type === 'promotional';
  const Icon = isPromotional ? leading : leading || iconMap[color];
  const hasAutoDismissTimer = isPromotional && Boolean(autoDismiss) && Number.isFinite(duration);
  const hasProgressBar = hasAutoDismissTimer && showProgressBar;
  const { isRunning, pauseHandlers } = useAutoDismissTimer({
    id,
    duration,
    introDuration,
    isEnabled: hasAutoDismissTimer && Boolean(isVisible),
  });

  const handleActionClick = (event: React.SyntheticEvent): void => {
    event.stopPropagation();
    action?.onClick?.({ event: event as never, toastId: id! });
  };

  const actionIconProps = action?.icon
    ? { icon: action.icon, iconPosition: action.iconPosition }
    : {};

  let actionElement: React.ReactElement | null = null;
  if (action?.variant === 'link') {
    actionElement = (
      <Link
        size="small"
        color={isPromotional ? 'primary' : 'white'}
        {...(action.href
          ? ({
              variant: 'anchor',
              href: action.href,
              target: action.target,
              rel: action.rel,
            } as const)
          : ({ variant: 'button' } as const))}
        {...actionIconProps}
        onClick={handleActionClick}
        data-analytics-name={MAKE_ANALYTICS_CONSTANTS.TOAST.ACTION_BUTTON}
      >
        {action.text}
      </Link>
    );
  } else if (action) {
    actionElement = (
      <Button
        size="xsmall"
        variant={isPromotional ? 'secondary' : 'tertiary'}
        color={isPromotional ? 'primary' : 'white'}
        {...actionIconProps}
        onClick={handleActionClick}
        isLoading={action.isLoading}
        data-analytics-name={MAKE_ANALYTICS_CONSTANTS.TOAST.ACTION_BUTTON}
      >
        {action.text}
      </Button>
    );
  }

  const actionButton = actionElement ? <Box>{actionElement}</Box> : null;

  const enter = css`
    opacity: 0;
    animation: ${slideIn} ${makeMotionTime(theme.motion.duration.gentle)}
      ${castWebType(theme.motion.easing.entrance)} forwards;
  `;

  const exit = css`
    opacity: 1;
    animation: ${slideOut} ${makeMotionTime(theme.motion.duration.moderate)}
      ${castWebType(theme.motion.easing.exit)} forwards;
  `;

  return (
    <AnimatedFade
      {...makeAccessible({ role: 'status', liveRegion: 'polite' })}
      {...metaAttribute({ name: MetaConstants.Toast })}
      {...(hasAutoDismissTimer ? pauseHandlers : {})}
      toastBorderColor={getIn(
        theme.colors,
        isPromotional ? 'popup.border.gray.moderate' : borderColorMap[color],
      )}
      animationType={isVisible ? enter : exit}
      position={hasProgressBar ? 'relative' : undefined}
      width="100%"
      display="flex"
      gap="spacing.3"
      paddingX="spacing.4"
      paddingY={isPromotional ? 'spacing.4' : 'spacing.3'}
      borderRadius="medium"
      alignItems="center"
      backgroundColor={
        isPromotional ? 'popup.background.gray.moderate' : `popup.background.${color}.moderate`
      }
    >
      {Icon ? (
        <Box
          flexShrink={0}
          display="flex"
          alignItems="center"
          alignSelf={isPromotional ? 'start' : 'center'}
          marginTop={isPromotional ? 'spacing.1' : 'spacing.0'}
        >
          <Icon
            color={isPromotional ? 'surface.icon.gray.normal' : 'surface.icon.staticWhite.normal'}
          />
        </Box>
      ) : null}
      <Box
        display="flex"
        flexDirection="column"
        gap="spacing.3"
        paddingY={isPromotional ? 'spacing.0' : 'spacing.2'}
      >
        {isPromotional ? (
          content
        ) : (
          <Text as="span" size="small" color="surface.text.staticWhite.normal">
            {content}
          </Text>
        )}
        {isPromotional && actionButton}
      </Box>
      <Box
        alignSelf={isPromotional ? 'start' : 'center'}
        marginLeft="auto"
        display="flex"
        gap="spacing.4"
      >
        {!isPromotional && actionButton}
        <IconButton
          emphasis={isPromotional ? 'intense' : 'subtle'}
          accessibilityLabel="Dismiss toast"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation();
            onDismissButtonClick?.({ event, toastId: id! });
            toast.dismiss(id);
          }}
          icon={CloseIcon}
        />
      </Box>
      {hasProgressBar ? (
        <ToastProgressBar
          {...makeAccessible({ hidden: true })}
          duration={duration}
          isRunning={isRunning}
          testID="toast-progress-bar"
        />
      ) : null}
    </AnimatedFade>
  );
};

export { Toast };
