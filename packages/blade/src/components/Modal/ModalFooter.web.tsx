import React from 'react';
import { BaseFooter } from '../BaseHeaderFooter/BaseFooter';
import type { BaseFooterProps } from '../BaseHeaderFooter/BaseFooter';
import { useModalContext } from './ModalContext';
import { Box } from '~components/Box';
import { MetaConstants, assignWithoutSideEffects } from '~utils';

type ModalFooterProps = Pick<BaseFooterProps, 'children'>;

const _ModalFooter = (props: ModalFooterProps): React.ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const containerRef = React.useRef<any>(null);
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
        metaComponentName={MetaConstants.ModalFooter}
        children={props.children}
        showDivider={true}
      />
    </Box>
  );
};

const ModalFooter = assignWithoutSideEffects(_ModalFooter, {
  componentId: MetaConstants.ModalFooter,
});

export { ModalFooter };
export type { ModalFooterProps };
