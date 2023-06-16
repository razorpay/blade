import type { ReactElement, ReactNode } from 'react';
import { CollapsibleBodyContent } from './CollapsibleBodyContent';
import { useCollapsible } from './CollapsibleContext';
import BaseBox from '~components/Box/BaseBox';
import { MetaConstants, assignWithoutSideEffects, makeAccessible, metaAttribute } from '~utils';
import type { TestID } from '~src/_helpers/types';

type CollapsibleBodyProps = {
  children: ReactNode;
} & TestID;

const _CollapsibleBody = ({ children, testID }: CollapsibleBodyProps): ReactElement => {
  const { collapsibleBodyId } = useCollapsible();
  return (
    <BaseBox
      id={collapsibleBodyId}
      {...makeAccessible({ role: 'region' })}
      {...metaAttribute({ name: MetaConstants.CollapsibleBody, testID })}
    >
      <CollapsibleBodyContent>{children}</CollapsibleBodyContent>
    </BaseBox>
  );
};

const CollapsibleBody = assignWithoutSideEffects(_CollapsibleBody, {
  componentId: MetaConstants.CollapsibleBody,
});

export { CollapsibleBody, CollapsibleBodyProps };
