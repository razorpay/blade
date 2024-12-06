/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
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
import { castWebType, makeMotionTime, useTheme } from '~utils';
import getIn from '~utils/lodashButBetter/get';
import { makeAccessible } from '~utils/makeAccessible';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

const iconMap = {
  positive: CheckCircleIcon,
  negative: AlertOctagonIcon,
  information: InfoIcon,
  neutral: InfoIcon,
  notice: AlertTriangleIcon,
};

const borderColorMap = {
  positive: 'feedback.border.positive.intense',
  negative: 'feedback.border.negative.intense',
  notice: 'feedback.border.notice.intense',
  information: 'feedback.border.information.intense',
  neutral: 'feedback.border.neutral.intense',
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
}>(({ animationType, toastBorderColor }) => {
  return css`
    overflow: hidden;
    border: 1px solid ${toastBorderColor};
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
  const Icon = leading || iconMap[color];
  const isPromotional = type === 'promotional';
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
        isPromotional ? 'surface.border.gray.muted' : borderColorMap[color],
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
        isPromotional ? 'surface.background.gray.intense' : `feedback.background.${color}.intense`
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
