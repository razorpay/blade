import React from 'react';
import type { BaseFooterProps } from '../BaseHeaderFooter/BaseFooter';
import { Text } from '~components/Typography';

type ModalFooterProps = Pick<BaseFooterProps, 'children'>;

const ModalFooter = (): React.ReactElement => {
  return (
    <Text>
      Modal Component is not available for Native mobile apps and we should use BottomSheet
      component instead for all use-cases of Modal on Native mobile apps.
    </Text>
  );
};

export { ModalFooter };
export type { ModalFooterProps };
