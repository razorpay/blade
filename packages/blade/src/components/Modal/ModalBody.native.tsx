import React from 'react';
import { Text } from '~components/Typography';

type ModalBodyProps = {
  children: React.ReactNode;
};

const ModalBody = (): React.ReactElement => {
  return (
    <Text>
      Modal Component is not available for Native mobile apps and we should use BottomSheet
      component instead for all use-cases of Modal on Native mobile apps.
    </Text>
  );
};

export { ModalBody };
export type { ModalBodyProps };
