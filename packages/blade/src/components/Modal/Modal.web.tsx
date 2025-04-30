/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import type { Keyframes } from 'styled-components';
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
  modalMargin,
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

const fullPageEntry = keyframes`
   from {
     opacity: 0 ;
   }
   to {
     opacity: 1;
   }
   `;

const fullPageExit = keyframes`
   from {
     opacity: 1;
   }
   to {
     opacity: 0;
   }
   `;

function getAnimation(isVisible: boolean, size: NonNullable<ModalProps['size']>): Keyframes {
  if (isVisible) {
    return size === 'full' ? fullPageEntry : entry;
  } else {
    return size === 'full' ? fullPageExit : exit;
  }
}

const ModalContent = styled(BaseBox)<{ isVisible: boolean; size: NonNullable<ModalProps['size']> }>(
  ({ isVisible, theme, size }) => {
    return css`
      box-shadow: ${theme.elevation.highRaised};
      position: fixed;
      transform: ${size === 'full' ? 'none' : 'translate(-50%, -50%)'};
      opacity: 0;
      ${isVisible &&
      css`
        opacity: 1;
        animation: ${getAnimation(isVisible, size)}
          ${castWebType(makeMotionTime(theme.motion.duration.moderate))}
          ${castWebType(theme.motion.easing.entrance)};
      `}
      ${!isVisible &&
      css`
        animation: ${getAnimation(isVisible, size)}
          ${castWebType(makeMotionTime(theme.motion.duration.moderate))}
          ${castWebType(theme.motion.easing.exit)};
      `}
      ${size === 'full' &&
      css`
        top: ${makeSize(modalMargin[size])};
        left: ${makeSize(modalMargin[size])};
        right: ${makeSize(modalMargin[size])};
        bottom: ${makeSize(modalMargin[size])};
      `}
    `;
  },
);

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
                maxWidth={size === 'full' ? '100%' : makeSize(modalMaxWidth[size])}
                minWidth={makeSize(modalMinWidth)}
                maxHeight={modalMaxHeight[size]}
                width={
                  size === 'full'
                    ? `calc(100vw - ${makeSize(modalMargin[size] * 2)})`
                    : `calc(100vw - ${makeSize(modalResponsiveScreenGap)})`
                }
                borderRadius={modalBorderRadius}
                backgroundColor="popup.background.subtle"
                display="flex"
                flexDirection="column"
                top="50%"
                left="50%"
                onKeyDown={handleKeyDown}
                isVisible={isVisible}
                size={size}
                ref={refs.setFloating}
                overflow="hidden"
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
