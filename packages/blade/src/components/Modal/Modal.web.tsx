/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { FloatingFocusManager, FloatingPortal, useFloating } from '@floating-ui/react';
import usePresence from 'use-presence';
import { ModalHeader } from './ModalHeader';
import type { ModalHeaderProps } from './ModalHeader';
import { ModalFooter } from './ModalFooter';
import type { ModalFooterProps } from './ModalFooter';
import { ModalBody } from './ModalBody';
import type { ModalBodyProps } from './ModalBody';
import { ModalContext } from './ModalContext';
import { ModalBackdrop } from './ModalBackdrop';
import {
  modalBorderRadius,
  modalMaxHeight,
  modalMaxWidth,
  modalMinWidth,
  modalResponsiveScreenGap,
} from './modalTokens';
import type { ModalProps } from './types';
import { componentIds } from './constants';
import { castWebType, makeMotionTime, makeSize } from '~utils';
import { BaseBox } from '~components/Box/BaseBox';
import { useTheme } from '~components/BladeProvider';
import { Box } from '~components/Box';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import { makeAccessible } from '~utils/makeAccessible';
import { logger } from '~utils/logger';
import { componentZIndices } from '~utils/componentZIndices';
import { useVerifyAllowedChildren } from '~utils/useVerifyAllowedChildren';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const entry = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1) translateY(0px);
  }
`;

const exit = keyframes`
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1) translateY(0px);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9) translateY(20px);
  }
`;

const ModalContent = styled(BaseBox)<{ isVisible: boolean }>(({ isVisible, theme }) => {
  return css`
    box-shadow: ${theme.elevation.highRaised};
    position: fixed;
    transform: translate(-50%, -50%);
    opacity: ${isVisible ? 1 : 0};
    animation: ${isVisible ? entry : exit}
      ${castWebType(makeMotionTime(theme.motion.duration.moderate))}
      ${isVisible
        ? castWebType(theme.motion.easing.entrance)
        : castWebType(theme.motion.easing.exit)};
  `;
});

const Modal = ({
  isOpen = false,
  children,
  onDismiss,
  initialFocusRef,
  size = 'small',
  accessibilityLabel,
  zIndex = componentZIndices.modal,
  ...rest
}: ModalProps): React.ReactElement => {
  const { theme, platform } = useTheme();
  const { isMounted, isVisible } = usePresence(isOpen, {
    transitionDuration: theme.motion.duration.moderate,
    initialEnter: true,
  });

  // Warn consumer if modal is opened on mobile
  useEffect(() => {
    if (__DEV__) {
      if (platform === 'onMobile') {
        logger({
          message: 'Modal is not supported on mobile devices. Please use BottomSheet instead.',
          moduleName: 'Modal',
          type: 'warn',
        });
      }
    }
  }, [platform]);

  // required by floating ui to handle focus
  const { refs, context } = useFloating({
    open: isMounted,
  });

  const defaultInitialFocusRef = React.useRef<any>(null);

  const modalContext = React.useMemo(
    () => ({
      isOpen,
      close: onDismiss,
      defaultInitialFocusRef,
      isVisible,
    }),
    [isOpen, onDismiss, defaultInitialFocusRef, isVisible],
  );
  const handleKeyDown = (event: React.KeyboardEvent): void => {
    // close modal on escape key press
    if (event?.key === 'Escape' || event?.code === 'Escape') {
      onDismiss();
    }
  };

  // Only allow ModalHeader, ModalBody and ModalFooter as children
  useVerifyAllowedChildren({
    allowedComponents: [componentIds.ModalHeader, componentIds.ModalBody, componentIds.ModalFooter],
    children,
    componentName: 'Modal',
  });

  return (
    <FloatingPortal>
      <ModalContext.Provider value={modalContext}>
        {isMounted ? (
          <FloatingFocusManager
            returnFocus
            initialFocus={initialFocusRef ?? defaultInitialFocusRef}
            context={context}
            modal={true}
          >
            <Box
              zIndex={zIndex}
              position="fixed"
              testID="modal-wrapper"
              {...makeAnalyticsAttribute(rest)}
            >
              <ModalBackdrop />
              <ModalContent
                {...metaAttribute({
                  name: MetaConstants.Modal,
                })}
                {...makeAccessible({
                  role: 'dialog',
                  modal: true,
                  label: accessibilityLabel,
                })}
                maxWidth={makeSize(modalMaxWidth[size])}
                minWidth={makeSize(modalMinWidth)}
                maxHeight={modalMaxHeight}
                width={`calc(100vw - ${makeSize(modalResponsiveScreenGap)})`}
                borderRadius={modalBorderRadius}
                backgroundColor="popup.background.subtle"
                position="absolute"
                display="flex"
                flexDirection="column"
                top="50%"
                left="50%"
                onKeyDown={handleKeyDown}
                isVisible={isVisible}
                ref={refs.setFloating}
              >
                {children}
              </ModalContent>
            </Box>
          </FloatingFocusManager>
        ) : null}
      </ModalContext.Provider>
    </FloatingPortal>
  );
};

export { Modal, ModalHeader, ModalFooter, ModalBody };
export type { ModalProps, ModalHeaderProps, ModalFooterProps, ModalBodyProps };
