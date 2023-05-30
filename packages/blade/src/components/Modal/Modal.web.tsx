import React from 'react';
import styled from 'styled-components';
import { FloatingFocusManager, useFloating } from '@floating-ui/react';
import { ModalPortal } from './ModalPortal';
import { ModalHeader } from './ModalHeader';
import type { ModalHeaderProps } from './ModalHeader';
import { ModalFooter } from './ModalFooter';
import type { ModalFooterProps } from './ModalFooter';
import { ModalBody } from './ModalBody';
import type { ModalBodyProps } from './ModalBody';
import { ModalContext } from './ModalContext';
import { ModalBackdrop } from './ModalBackdrop';

const ModalContent = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  background-color: #fff;
  border-radius: 12px;
  width: calc(100vw - 32px);
  max-width: 760px;
  min-width: 320px;
  transform: translate(-50%, -50%);
  z-index: 1000;
  visibility: ${(props) => (props.isOpen ? 'visible' : 'hidden')};
`;

type ModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onDismiss: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialFocusRef?: React.MutableRefObject<any>;
};

const Modal = ({
  isOpen,
  children,
  onDismiss,
  initialFocusRef,
}: ModalProps): React.ReactElement => {
  const { refs, context } = useFloating({
    open: isOpen,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const defaultInitialFocusRef = React.useRef<any>(null);
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
      focusOnInitialRef();
    }
  }, [isOpen, focusOnInitialRef]);

  return (
    <ModalPortal>
      <ModalContext.Provider value={{ isOpen, close: onDismiss, defaultInitialFocusRef }}>
        {isOpen ? (
          <FloatingFocusManager context={context} modal={true} initialFocus={-1}>
            <>
              <ModalBackdrop zIndex={999} />
              <ModalContent ref={refs.setFloating} isOpen={isOpen}>
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
