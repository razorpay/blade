import React from 'react';
import type { SpacingValueType } from '~components/Box/BaseBox';
import { Text } from '~components/Typography';

type ModalBodyProps = {
  children: React.ReactNode;
  padding?: Extract<SpacingValueType, 'spacing.0' | 'spacing.6'>;
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
