/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import toast from 'react-hot-toast';
import type { FlattenSimpleInterpolation } from 'styled-components';
import styled, { css, keyframes } from 'styled-components';
import type { ToastProps } from './types';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
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
import { makeMotionTime, useTheme } from '~utils';

const iconMap = {
  positive: CheckCircleIcon,
  negative: AlertOctagonIcon,
  information: InfoIcon,
  neutral: InfoIcon,
  warning: AlertTriangleIcon,
};

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

const fadeOut = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`;

const AnimatedFade = styled(BaseBox)<{ animationType: FlattenSimpleInterpolation | null }>(
  ({ animationType }) => {
    return css`
      overflow: hidden;
      ${animationType}
    `;
  },
);

const Toast = ({
  type,
  color = 'neutral',
  leading,
  action,
  content,
  // @ts-expect-error no index
  index,
  onDismissButtonClick,
  // autoDismiss = false,
  isVisible,
  id,
}: ToastProps): React.ReactElement => {
  const { theme } = useTheme();
  const Icon = leading || iconMap[color];

  const colorMap = {
    positive: 'positive',
    negative: 'negative',
    warning: 'notice',
    information: 'information',
    neutral: 'neutral',
  } as const;

  const isPromotional = type === 'promotional';
  const actionButton = action ? (
    <Box>
      <Button
        size="xsmall"
        variant={isPromotional ? 'secondary' : 'tertiary'}
        color={isPromotional ? 'primary' : 'white'}
        onClick={(e) => {
          e.stopPropagation();
          action?.onClick?.(e as never);
        }}
        isLoading={action?.isLoading}
      >
        {action?.text}
      </Button>
    </Box>
  ) : null;

  const isFirst = index === 0;

  const enter = css`
    opacity: 0;
    animation: ${slideIn} ${makeMotionTime(theme.motion.duration.gentle)}
      ${theme.motion.easing.entrance.effective as string} forwards;
  `;

  const exit = css`
    opacity: 1;
    animation: ${isFirst ? slideOut : fadeOut} ${makeMotionTime(theme.motion.duration.moderate)}
      ${theme.motion.easing.exit.effective as string} forwards;
  `;

  return (
    <AnimatedFade
      animationType={isVisible ? enter : exit}
      width="100%"
      display="flex"
      gap="spacing.3"
      paddingX="spacing.4"
      paddingY={isPromotional ? 'spacing.4' : 'spacing.3'}
      borderRadius="medium"
      alignItems="center"
      // TODO: fix border color
      border="2px solid white"
      backgroundColor={
        isPromotional
          ? 'surface.background.gray.intense'
          : `feedback.background.${colorMap[color]}.intense`
      }
    >
      {Icon ? (
        <Box
          flexShrink={0}
          display="flex"
          alignItems="center"
          alignSelf={isPromotional ? 'start' : 'center'}
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
        {onDismissButtonClick ? (
          <IconButton
            emphasis={isPromotional ? 'intense' : 'subtle'}
            accessibilityLabel="Dismiss toast"
            onClick={(e: any) => {
              e.stopPropagation();
              onDismissButtonClick?.();
              toast.dismiss(id);
            }}
            icon={CloseIcon}
          />
        ) : null}
      </Box>
    </AnimatedFade>
  );
};

export { Toast };
