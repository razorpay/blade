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

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.5);
    filter: blur(0.5px);
  }

  to {
    opacity: 1;
    transform: scale(1);
    filter: none;
  }
`;

const scaleOut = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }

  to {
    opacity: 0;
    transform: scale(0.92);
  }
`;

// Informational toasts always use the `default` motion
const toastMotion = {
  default: {
    enter: slideIn,
    enterDuration: 'gentle',
    exit: slideOut,
    exitDuration: 'moderate',
  },
  glass: {
    enter: scaleIn,
    enterDuration: 'moderate',
    exit: scaleOut,
    exitDuration: 'quick',
  },
} as const;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

// Keeps the space of the action during the intro, so the toast height does not change
const IntroAction = styled(BaseBox)<{ isIntroDone: boolean }>(({ isIntroDone, theme }) =>
  isIntroDone
    ? css`
        animation: ${fadeIn} ${makeMotionTime(theme.motion.duration.moderate)}
          ${castWebType(theme.motion.easing.entrance)} both;
      `
    : css`
        visibility: hidden;
      `,
);

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
  elapsedTime: number;
  isRunning: boolean;
  hasIntro: boolean;
  isIntroDone: boolean;
}>(({ duration, elapsedTime, isRunning, hasIntro, isIntroDone, theme }) => {
  const playState = isRunning ? 'running' : 'paused';

  // A negative delay starts the bar part way, for example after a remount
  return css`
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: ${makeSize(TOAST_PROGRESS_BAR_HEIGHT)};
    background-color: ${theme.colors.interactive.background.neutral.default};
    transform-origin: left;
    ${!isIntroDone
      ? css`
          visibility: hidden;
        `
      : hasIntro
      ? css`
          animation: ${shrink} ${makeMotionTime(duration)}
              ${castWebType(theme.motion.easing.linear)} ${makeMotionTime(-elapsedTime)} forwards,
            ${fadeIn} ${makeMotionTime(theme.motion.duration.moderate)}
              ${castWebType(theme.motion.easing.entrance)} both;
          animation-play-state: ${playState}, running;
        `
      : css`
          animation: ${shrink} ${makeMotionTime(duration)}
            ${castWebType(theme.motion.easing.linear)} ${makeMotionTime(-elapsedTime)} forwards;
          animation-play-state: ${playState};
        `}
  `;
});

type SavedTimer = { configKey: string; remainingTime: number; isIntroDone: boolean };

// Time left and intro state per toast id.
// A remounted toast reads them, so its intro, timer and progress bar do not start again.
const savedTimers = new Map<string, SavedTimer>();

const getSavedTimer = (id: string, configKey: string): SavedTimer | undefined => {
  const savedTimer = savedTimers.get(id);
  return savedTimer?.configKey === configKey ? savedTimer : undefined;
};

// Focus from a click, or from a return to the browser tab, must not keep the timer paused
const isKeyboardFocus = (element: Element): boolean => {
  try {
    return element.matches(':focus-visible');
  } catch {
    // Browsers without `:focus-visible` throw. Pause on any focus there.
    return true;
  }
};

/**
 * Runs the intro and the auto dismiss timer of a promotional toast.
 *
 * react-hot-toast pauses all toasts together and starts the timer at show.
 * This timer starts after the intro and pauses for this toast only.
 */
const usePromotionalTimer = ({
  id,
  configKey,
  duration,
  introDuration,
  hasIntro,
  hasAutoDismissTimer,
  isVisible,
}: {
  id: string;
  configKey: string;
  duration: number;
  introDuration: number;
  hasIntro: boolean;
  hasAutoDismissTimer: boolean;
  isVisible: boolean;
}): {
  isIntroDone: boolean;
  isRunning: boolean;
  elapsedTime: number;
  pauseHandlers: Pick<
    React.DOMAttributes<HTMLDivElement>,
    'onPointerEnter' | 'onPointerLeave' | 'onFocus' | 'onBlur'
  >;
} => {
  const [timerState, setTimerState] = React.useState(() => {
    const savedTimer = getSavedTimer(id, configKey);
    return {
      configKey,
      isIntroDone: savedTimer?.isIntroDone ?? !hasIntro,
      elapsedTime: savedTimer ? duration - savedTimer.remainingTime : 0,
    };
  });
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const isPaused = isHovered || isFocused;
  const { isIntroDone } = timerState;
  const isEnabled = hasAutoDismissTimer && isVisible && isIntroDone;

  // An update by id can change type, duration or introDuration. Then the intro and the timer start again.
  if (timerState.configKey !== configKey) {
    setTimerState({ configKey, isIntroDone: !hasIntro, elapsedTime: 0 });
  }

  React.useEffect(() => {
    // A toast dismissed during its intro must not save its state again
    if (isIntroDone || !isVisible) return undefined;
    const introTimeout = setTimeout(() => {
      savedTimers.set(id, { configKey, remainingTime: duration, isIntroDone: true });
      setTimerState({ configKey, isIntroDone: true, elapsedTime: 0 });
    }, introDuration);
    return () => clearTimeout(introTimeout);
  }, [id, configKey, duration, introDuration, isIntroDone, isVisible]);

  React.useEffect(() => {
    if (!isEnabled || isPaused) return undefined;
    const remainingTime = getSavedTimer(id, configKey)?.remainingTime ?? duration;
    const resumedAt = Date.now();
    let hasEnded = false;
    const dismissTimeout = setTimeout(() => {
      hasEnded = true;
      savedTimers.delete(id);
      toast.dismiss(id);
    }, remainingTime);
    return () => {
      clearTimeout(dismissTimeout);
      if (!hasEnded) {
        savedTimers.set(id, {
          configKey,
          remainingTime: remainingTime - (Date.now() - resumedAt),
          isIntroDone: true,
        });
      }
    };
  }, [id, configKey, duration, isEnabled, isPaused]);

  React.useEffect(() => {
    if (!isVisible) savedTimers.delete(id);
  }, [id, isVisible]);

  return {
    isIntroDone,
    isRunning: isEnabled && !isPaused,
    elapsedTime: timerState.elapsedTime,
    pauseHandlers: {
      // A tap on a touch screen sends pointer events too. Only a mouse pauses on hover.
      onPointerEnter: (event) => setIsHovered(event.pointerType === 'mouse'),
      onPointerLeave: () => setIsHovered(false),
      onFocus: (event) => {
        if (isKeyboardFocus(event.target)) setIsFocused(true);
      },
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
  isGlass: boolean;
}>(({ animationType, toastBorderColor, isGlass, theme }) => {
  const borderWidth = isGlass ? theme.border.width.thinner : theme.border.width.thin;
  const borderShadow = `inset 0 0 0 ${borderWidth}px ${toastBorderColor}`;
  const highlightShadow = `inset 0px 1.5px 0px 0px ${theme.colors.interactive.background.staticWhite.fadedHighlighted}`;
  const backdropBlur = isGlass ? theme.backdropBlur.low : theme.backdropBlur.medium;

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
  variant = 'default',
  isVisible,
  id,
}: ToastProps & {
  isVisible?: boolean;
}): React.ReactElement => {
  const { theme } = useTheme();
  const isPromotional = type === 'promotional';
  const isGlass = isPromotional && variant === 'glass';
  const motion = toastMotion[isGlass ? 'glass' : 'default'];
  const Icon = isPromotional ? leading : leading || iconMap[color];
  const hasAutoDismissTimer = isPromotional && Boolean(autoDismiss) && Number.isFinite(duration);
  const hasProgressBar = hasAutoDismissTimer && showProgressBar;
  const hasIntro = isPromotional && introDuration > 0;
  const configKey = `${type}-${autoDismiss}-${duration}-${introDuration}`;
  const { isIntroDone, isRunning, elapsedTime, pauseHandlers } = usePromotionalTimer({
    id: id!,
    configKey,
    duration,
    introDuration,
    hasIntro,
    hasAutoDismissTimer,
    isVisible: Boolean(isVisible),
  });

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
        onClick={(event) => {
          event.stopPropagation();
          // Link types its click event as a SyntheticEvent. It is a mouse event on an anchor or a button.
          action.onClick?.({
            event: event as React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
            toastId: id!,
          });
        }}
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
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          event.stopPropagation();
          action.onClick?.({ event, toastId: id! });
        }}
        isLoading={action.isLoading}
        data-analytics-name={MAKE_ANALYTICS_CONSTANTS.TOAST.ACTION_BUTTON}
      >
        {action.text}
      </Button>
    );
  }

  let actionButton: React.ReactElement | null = null;
  if (actionElement && hasIntro) {
    actionButton = <IntroAction isIntroDone={isIntroDone}>{actionElement}</IntroAction>;
  } else if (actionElement) {
    actionButton = <Box>{actionElement}</Box>;
  }

  const enter = css`
    opacity: 0;
    animation: ${motion.enter} ${makeMotionTime(theme.motion.duration[motion.enterDuration])}
      ${castWebType(theme.motion.easing.entrance)} forwards;
  `;

  const exit = css`
    opacity: 1;
    animation: ${motion.exit} ${makeMotionTime(theme.motion.duration[motion.exitDuration])}
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
      isGlass={isGlass}
      position={hasProgressBar ? 'relative' : undefined}
      width="100%"
      display="flex"
      gap="spacing.3"
      paddingX="spacing.4"
      paddingY={isPromotional ? 'spacing.4' : 'spacing.3'}
      borderRadius={isGlass ? 'large' : 'medium'}
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
          key={configKey}
          {...makeAccessible({ hidden: true })}
          duration={duration}
          elapsedTime={elapsedTime}
          isRunning={isRunning}
          hasIntro={hasIntro}
          isIntroDone={isIntroDone}
          testID="toast-progress-bar"
        />
      ) : null}
    </AnimatedFade>
  );
};

export { Toast };
