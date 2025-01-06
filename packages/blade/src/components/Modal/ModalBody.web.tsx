/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { componentIds } from './constants';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';
import BaseBox from '~components/Box/BaseBox';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import type { SpacingValueType } from '~components/Box/BaseBox';
import type { DataAnalyticsAttribute } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

type ModalBodyProps = {
  children: React.ReactNode;
  /**
   * Sets the padding equally on all sides. Only few `spacing` tokens are allowed deliberately
   * @default `spacing.6`
   *
   * **Links:**
   * - Docs: https://blade.razorpay.com/?path=/docs/tokens-spacing--docs
   */
  padding?: Extract<SpacingValueType, 'spacing.0' | 'spacing.6'>;
} & DataAnalyticsAttribute;

const _ModalBody = ({
  children,
  padding = 'spacing.6',
  ...rest
}: ModalBodyProps): React.ReactElement => {
  const contentRef = React.useRef<any>(null);

  return (
    <BaseBox
      {...metaAttribute({ name: MetaConstants.ModalBody })}
      padding={padding}
      ref={contentRef}
      overflowY="auto"
      overflowX="hidden"
      {...makeAnalyticsAttribute(rest)}
    >
      {children}
    </BaseBox>
  );
};

const ModalBody = assignWithoutSideEffects(_ModalBody, {
  componentId: componentIds.ModalBody,
});

export { ModalBody };
export type { ModalBodyProps };
