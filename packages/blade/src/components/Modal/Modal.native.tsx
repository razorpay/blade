import React from 'react';
import { Text } from '~components/Typography';

type ModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onDismiss: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialFocusRef?: React.MutableRefObject<any>;
  size?: 'small' | 'medium' | 'large';
  accessibilityLabel?: string;
};

const Modal = (): React.ReactElement => {
  return (
    <Text>
      Modal Component is not available for Native mobile apps and we should use BottomSheet
      component instead for all use-cases of Modal on Native mobile apps.
    </Text>
  );
};

export { Modal };
export type { ModalProps };
