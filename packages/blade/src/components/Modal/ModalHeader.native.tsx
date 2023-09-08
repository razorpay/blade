import React from 'react';
import type { BaseHeaderProps } from '~components/BaseHeaderFooter/BaseHeader';
import { Text } from '~components/Typography';

type ModalHeaderProps = Pick<
  BaseHeaderProps,
  'title' | 'subtitle' | 'leading' | 'trailing' | 'titleSuffix'
>;

const ModalHeader = (): React.ReactElement => {
  return (
    <Text>
      Modal Component is not available for Native mobile apps and we should use BottomSheet
      component instead for all use-cases of Modal on Native mobile apps.
    </Text>
  );
};

export { ModalHeader };
export type { ModalHeaderProps };
