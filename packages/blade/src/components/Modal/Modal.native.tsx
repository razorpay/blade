/* eslint-disable react/no-unused-prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { ModalHeader } from './ModalHeader';
import type { ModalHeaderProps } from './ModalHeader';
import { ModalFooter } from './ModalFooter';
import type { ModalFooterProps } from './ModalFooter';
import { ModalBody } from './ModalBody';
import type { ModalBodyProps } from './ModalBody';
import type { ModalProps } from './types';
import { Text } from '~components/Typography';
import { logger } from '~utils/logger';

const Modal = (props: ModalProps): React.ReactElement => {
  if (__DEV__) {
    logger({
      type: 'warn',
      moduleName: 'Modal',
      message: 'Modal is not supported on mobile devices. Please use BottomSheet instead.',
    });
  }

  return (
    <Text>
      Modal Component is not available for Native mobile apps and we should use BottomSheet
      component instead for all use-cases of Modal on Native mobile apps.
    </Text>
  );
};

export { Modal, ModalHeader, ModalFooter, ModalBody };
export type { ModalProps, ModalHeaderProps, ModalFooterProps, ModalBodyProps };
