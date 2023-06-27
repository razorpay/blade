import type { ReactElement, ReactNode } from 'react';
import { CollapsibleBodyContent } from './CollapsibleBodyContent';
import { useCollapsible } from './CollapsibleContext';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import BaseBox from '~components/Box/BaseBox';
import { MetaConstants, assignWithoutSideEffects, makeAccessible, metaAttribute } from '~utils';
import type { TestID } from '~src/_helpers/types';

type CollapsibleBodyProps = {
  children: ReactNode;

  /**
   * **Internal**: used for React Native specific workarounds. Collapsible automatically takes care of width, you shouldn't need to configure this
   */
  _width?: BaseBoxProps['width'];
} & TestID;

const _CollapsibleBody = ({ children, testID, _width }: CollapsibleBodyProps): ReactElement => {
  const { collapsibleBodyId, isExpanded } = useCollapsible();
  return (
    <BaseBox
      id={collapsibleBodyId}
      // Just React Native things, need this 100% so collapsed content flows correctly inside Accordion
      width={_width}
      {...makeAccessible({ role: 'region', hidden: !isExpanded })}
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
