import React from 'react';
import { componentIds } from './constants';
import { BaseFooter } from '~components/BaseHeaderFooter/BaseFooter';
import type { BaseFooterProps } from '~components/BaseHeaderFooter/BaseFooter';
import { Box } from '~components/Box';
import { MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

type ModalFooterProps = Pick<BaseFooterProps, 'children'>;

const _ModalFooter = (props: ModalFooterProps): React.ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const containerRef = React.useRef<any>(null);

  return (
    <Box ref={containerRef}>
      <BaseFooter
        metaComponentName={MetaConstants.ModalFooter}
        children={props.children}
        showDivider={true}
      />
    </Box>
  );
};

const ModalFooter = assignWithoutSideEffects(_ModalFooter, {
  componentId: componentIds.ModalFooter,
});

export { ModalFooter };
export type { ModalFooterProps };
