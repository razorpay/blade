/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { modalBodyPadding } from './modalTokens';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';
import { MetaConstants, metaAttribute } from '~utils';

type ModalBodyProps = {
  children: React.ReactNode;
};

const _ModalBody = ({ children }: ModalBodyProps): React.ReactElement => {
  const contentRef = React.useRef<HTMLDivElement>(null);

  return (
    <BaseBox
      {...metaAttribute({ name: MetaConstants.ModalBody })}
      padding={modalBodyPadding}
      ref={contentRef}
      overflowY="auto"
      overflowX="hidden"
    >
      {children}
    </BaseBox>
  );
};

const ModalBody = assignWithoutSideEffects(_ModalBody, {
  componentId: MetaConstants.ModalBody,
});

export { ModalBody };
export type { ModalBodyProps };
