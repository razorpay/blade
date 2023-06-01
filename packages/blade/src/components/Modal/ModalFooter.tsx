import React from 'react';
import { useModalContext } from './ModalContext';
import type { BaseFooterProps } from '~components/BaseHeaderFooter/BaseFooter';
import { BaseFooter } from '~components/BaseHeaderFooter/BaseFooter';
import { Box } from '~components/Box';
import { MetaConstants, assignWithoutSideEffects } from '~utils';

type ModalFooterProps = BaseFooterProps;

const _ModalFooter = (props: ModalFooterProps): React.ReactElement => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { setFooterHeight } = useModalContext();
  React.useEffect(() => {
    // Set the footer height on mount
    // Footer height is used to calculate the offset of the scroll overlay from bottom
    const element = containerRef.current;
    if (element) {
      setFooterHeight(element.offsetHeight);
    }
  }, []);

  return (
    <Box ref={containerRef}>
      <BaseFooter
        metaDataComponentName={MetaConstants.ModalFooter}
        children={props.children}
        showDivider={props.showDivider}
      />
    </Box>
  );
};

const ModalFooter = assignWithoutSideEffects(_ModalFooter, {
  componentId: MetaConstants.ModalFooter,
});

export { ModalFooter };
export type { ModalFooterProps };
