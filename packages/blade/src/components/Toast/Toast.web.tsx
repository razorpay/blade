/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import React from 'react';
import toast from 'react-hot-toast';
import styled from 'styled-components';
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

const iconMap = {
  positive: CheckCircleIcon,
  negative: AlertOctagonIcon,
  information: InfoIcon,
  neutral: InfoIcon,
  warning: AlertTriangleIcon,
};

const StyledToast = styled(BaseBox)<{ isVisible?: boolean }>(({ isVisible }) => {
  return {
    transition: '0.3s ease-in-out',
    opacity: isVisible ? 1 : 0,
  };
});

const Toast = ({
  type,
  color = 'neutral',
  leading,
  action,
  content,
  onDismissButtonClick,
  // autoDismiss = false,
  isVisible,
  id,
}: ToastProps): React.ReactElement => {
  const Icon = leading || iconMap[color!];

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
        onClick={action?.onClick}
        isLoading={action?.isLoading}
      >
        {action?.text!}
      </Button>
    </Box>
  ) : null;

  return (
    <StyledToast
      isVisible={isVisible}
      width="360px"
      display="flex"
      gap="spacing.3"
      paddingX="spacing.4"
      paddingY={isPromotional ? 'spacing.4' : 'spacing.3'}
      borderRadius="medium"
      alignItems="center"
      backgroundColor={
        isPromotional
          ? 'surface.background.gray.intense'
          : `feedback.background.${colorMap[color!]}.intense`
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
        <Text size="small" color="surface.text.staticWhite.normal">
          {id} - {content}
        </Text>
        {isPromotional && actionButton}
      </Box>
      <Box alignSelf="start" marginLeft="auto" display="flex" gap="spacing.4">
        {!isPromotional && actionButton}
        {onDismissButtonClick ? (
          <IconButton
            emphasis={isPromotional ? 'intense' : 'subtle'}
            accessibilityLabel="Dismiss toast"
            onClick={() => {
              onDismissButtonClick?.();
              toast.dismiss(id);
            }}
            icon={CloseIcon}
          />
        ) : null}
      </Box>
    </StyledToast>
  );
};

export { Toast };
