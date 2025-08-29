import { default as React } from 'react';
import { ModalHeader, ModalHeaderProps } from './ModalHeader';
import { ModalFooter, ModalFooterProps } from './ModalFooter';
import { ModalBody, ModalBodyProps } from './ModalBody';
import { ModalProps } from './types';
declare const Modal: ({ isOpen, children, onDismiss, initialFocusRef, size, accessibilityLabel, zIndex, ...rest }: ModalProps) => React.ReactElement;
export { Modal, ModalHeader, ModalFooter, ModalBody };
export type { ModalProps, ModalHeaderProps, ModalFooterProps, ModalBodyProps };
