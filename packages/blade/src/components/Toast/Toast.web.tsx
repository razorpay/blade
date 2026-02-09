/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import toast from 'react-hot-toast';
import type { FlattenSimpleInterpolation } from 'styled-components';
import styled, { css, keyframes } from 'styled-components';
import { castWebType, makeMotionTime, useTheme } from '~utils';
import getIn from '~utils/lodashButBetter/get';
import { makeAccessible } from '~utils/makeAccessible';
import { MAKE_ANALYTICS_CONSTANTS } from '~utils/makeAnalyticsAttribute/makeAnalyticsConstants';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { ToastProps } from './types';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { IconButton } from '~components/Button/IconButton';
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

const AnimatedFade = styled(BaseBox)<{
  animationType: FlattenSimpleInterpolation | null;
  toastBorderColor: string;
}>(({ animationType, toastBorderColor, theme }) => {
  const borderShadow = `inset 0 0 0 1px ${toastBorderColor}`;
  const highlightShadow = `inset 0px 1.5px 0px 0px ${theme.colors.interactive.background.staticWhite.fadedHighlighted}`;
  const backdropBlur = theme.backdropBlur.medium;

  return css`
    overflow: hidden;
    box-shadow: ${borderShadow}, ${highlightShadow};
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
  isVisible,
  id,
}: ToastProps & {
  isVisible?: boolean;
}): React.ReactElement => {
  const { theme } = useTheme();
  const isPromotional = type === 'promotional';
  const Icon = isPromotional ? leading : leading || iconMap[color];

  const actionButton = action ? (
    <Box>
      <Button
        size="xsmall"
        variant={isPromotional ? 'secondary' : 'tertiary'}
        color={isPromotional ? 'primary' : 'white'}
        onClick={(event) => {
          event.stopPropagation();
          action?.onClick?.({ event: event as never, toastId: id! });
        }}
        isLoading={action?.isLoading}
        data-analytics-name={MAKE_ANALYTICS_CONSTANTS.TOAST.ACTION_BUTTON}
      >
        {action?.text}
      </Button>
    </Box>
  ) : null;

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
      toastBorderColor={getIn(
        theme.colors,
        isPromotional ? 'popup.border.gray.moderate' : borderColorMap[color],
      )}
      animationType={isVisible ? enter : exit}
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
      <Box display="flex" flexDirection="column" gap="spacing.3">
        {isPromotional ? (
          content
        ) : (
          <Text as="span" size="small" color="surface.text.staticWhite.normal">
            {content}
          </Text>
        )}
        {isPromotional && actionButton}
      </Box>
      <Box alignSelf="start" marginLeft="auto" display="flex" gap="spacing.4">
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
    </AnimatedFade>
  );
};

export { Toast };
