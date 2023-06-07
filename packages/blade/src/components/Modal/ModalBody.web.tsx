/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';
import BaseBox from '~components/Box/BaseBox';
import { MetaConstants, metaAttribute } from '~utils';
import type { SpacingValueType } from '~components/Box/BaseBox';

type ModalBodyProps = {
  children: React.ReactNode;
  /**
   * Sets the padding equally on all sides. Only few `spacing` tokens are allowed deliberately
   * @default `spacing.6`
   *
   * **Links:**
   * - Docs: https://blade.razorpay.com/?path=/docs/tokens-spacing--page
   */
  padding?: Extract<SpacingValueType, 'spacing.0' | 'spacing.6'>;
};

const _ModalBody = ({ children, padding = 'spacing.6' }: ModalBodyProps): React.ReactElement => {
  const contentRef = React.useRef<any>(null);

  return (
    <BaseBox
      {...metaAttribute({ name: MetaConstants.ModalBody })}
      padding={padding}
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
