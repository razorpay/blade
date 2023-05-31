import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { FloatingFocusManager, useFloating } from '@floating-ui/react';
import usePresence from 'use-presence';
import { ModalPortal } from './ModalPortal';
import { ModalHeader } from './ModalHeader';
import type { ModalHeaderProps } from './ModalHeader';
import { ModalFooter } from './ModalFooter';
import type { ModalFooterProps } from './ModalFooter';
import { ModalBody } from './ModalBody';
import type { ModalBodyProps } from './ModalBody';
import { ModalContext } from './ModalContext';
import { ModalBackdrop } from './ModalBackdrop';
import { castWebType, makeMotionTime } from '~utils';

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

const ModalContent = styled.div<{ isVisible: boolean }>(({ isVisible, theme }) => {
  return css`
    position: absolute;
    top: 50%;
    left: 50%;
    background-color: #fff;
    border-radius: 12px;
    width: calc(100vw - 32px);
    max-width: 760px;
    min-width: 320px;
    transform: translate(-50%, -50%);
    opacity: ${isVisible ? 1 : 0};
    animation: ${isVisible ? entry : exit}
      ${castWebType(makeMotionTime(theme.motion.duration.xmoderate))}
      ${
        isVisible
          ? castWebType(theme.motion.easing.entrance.revealing)
          : castWebType(theme.motion.easing.exit.revealing)
      }};
  `;
});

type ModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onDismiss: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialFocusRef?: React.MutableRefObject<any>;
};

const Modal = ({
  isOpen = false,
  children,
  onDismiss,
  initialFocusRef,
}: ModalProps): React.ReactElement => {
  const { isMounted, isVisible } = usePresence(isOpen, {
    transitionDuration: 1000,
    initialEnter: true,
  });
  const { refs, context } = useFloating({
    open: isMounted,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const defaultInitialFocusRef = React.useRef<any>(null);

  const originalFocusElement = React.useRef<HTMLElement | null>(null);
  const returnFocus = React.useCallback(() => {
    if (!originalFocusElement.current) return;
    originalFocusElement.current.focus();
    // After returning focus we will clear the original focus
    // Because if modal can be opened up via multiple triggers
    // We want to ensure the focus returns back to the most recent triggerer
    originalFocusElement.current = null;
  }, [originalFocusElement]);

  const focusOnInitialRef = React.useCallback(() => {
    if (!initialFocusRef) {
      // focus on close button
      defaultInitialFocusRef.current?.focus();
    } else {
      // focus on the initialRef passed by the user
      initialFocusRef.current?.focus();
    }
  }, [initialFocusRef]);

  React.useEffect(() => {
    if (isOpen) {
      // set the original focus element where the focus will return to after closing the modal
      originalFocusElement.current =
        originalFocusElement.current ?? (document.activeElement as HTMLElement);
      // focus on an element on Modal, if initialFocusRef is not passed, focus on the close button
      focusOnInitialRef();
    }
  }, [isOpen, focusOnInitialRef]);

  React.useEffect(() => {
    if (!isOpen) {
      returnFocus();
    }
  }, [isOpen, returnFocus]);

  return (
    <ModalPortal>
      <ModalContext.Provider
        value={{ isOpen, close: onDismiss, defaultInitialFocusRef, isVisible }}
      >
        {isMounted ? (
          <FloatingFocusManager context={context} modal={true}>
            <>
              <ModalBackdrop />
              <ModalContent ref={refs.setFloating} isVisible={isVisible}>
                {children}
              </ModalContent>
            </>
          </FloatingFocusManager>
        ) : null}
      </ModalContext.Provider>
    </ModalPortal>
  );
};

export { Modal, ModalHeader, ModalFooter, ModalBody };
export type { ModalProps, ModalHeaderProps, ModalFooterProps, ModalBodyProps };
