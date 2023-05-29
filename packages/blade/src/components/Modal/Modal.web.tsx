import styled from 'styled-components';
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
};

const Modal = (props: ModalProps): React.ReactElement => {
  return (
    <ModalPortal>
      <ModalContext.Provider value={{ isOpen: props.isOpen, close: props.onDismiss }}>
        {props.isOpen ? (
          <>
            <ModalBackdrop zIndex={999} />
            <ModalContent isOpen={props.isOpen}>{props.children}</ModalContent>
          </>
        ) : null}
      </ModalContext.Provider>
    </ModalPortal>
  );
};

export { Modal, ModalHeader, ModalFooter, ModalBody };
export type { ModalProps, ModalHeaderProps, ModalFooterProps, ModalBodyProps };
