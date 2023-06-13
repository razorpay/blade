import type { ReactElement, ReactNode } from 'react';
import { CollapsiblePanel } from './CollapsiblePanel';
import BaseBox from '~components/Box/BaseBox';
import { MetaConstants, assignWithoutSideEffects, metaAttribute } from '~utils';
import type { TestID } from '~src/_helpers/types';

type CollapsibleBodyProps = {
  children: ReactNode;
} & TestID;

const _CollapsibleBody = ({ children, testID }: CollapsibleBodyProps): ReactElement => {
  return (
    <BaseBox {...metaAttribute({ name: MetaConstants.Alert, testID })}>
      <CollapsiblePanel>{children}</CollapsiblePanel>
    </BaseBox>
  );
};

const CollapsibleBody = assignWithoutSideEffects(_CollapsibleBody, {
  componentId: MetaConstants.CollapsibleBody,
});

export { CollapsibleBody, CollapsibleBodyProps };
