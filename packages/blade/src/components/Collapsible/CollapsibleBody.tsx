import type { ReactElement } from 'react';
import { CollapsibleBodyContent } from './CollapsibleBodyContent';
import { useCollapsible } from './CollapsibleContext';
import type { CollapsibleBodyProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAccessible } from '~utils/makeAccessible';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const _CollapsibleBody = ({
  children,
  testID,
  width,
  _hasMargin = true,
  ...rest
}: CollapsibleBodyProps): ReactElement => {
  const { collapsibleBodyId, isExpanded } = useCollapsible();
  return (
    <BaseBox
      id={collapsibleBodyId}
      width={width}
      {...makeAccessible({ role: 'region', hidden: !isExpanded })}
      {...metaAttribute({ name: MetaConstants.CollapsibleBody, testID })}
      {...makeAnalyticsAttribute(rest)}
    >
      <CollapsibleBodyContent _hasMargin={_hasMargin}>{children}</CollapsibleBodyContent>
    </BaseBox>
  );
};

const CollapsibleBody = assignWithoutSideEffects(_CollapsibleBody, {
  componentId: MetaConstants.CollapsibleBody,
});

export type { CollapsibleBodyProps };
export { CollapsibleBody };
