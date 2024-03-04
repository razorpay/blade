import type { ReactElement, ReactNode } from 'react';
import { CollapsibleBodyContent } from './CollapsibleBodyContent';
import { useCollapsible } from './CollapsibleContext';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import BaseBox from '~components/Box/BaseBox';
import type { TestID } from '~utils/types';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAccessible } from '~utils/makeAccessible';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

type CollapsibleBodyProps = {
  children: ReactNode;
  width?: BaseBoxProps['width'];
  /**
   * @internal
   *
   * Used inside Accordion to set top border on content
   */
  _borderTopWidth?: BaseBoxProps['borderTopWidth'];
  /**
   * @internal
   *
   * Used inside Accordion to set top border on content
   */
  _borderTopColor?: BaseBoxProps['borderTopColor'];
} & TestID;

const _CollapsibleBody = ({
  children,
  testID,
  width,
  _borderTopColor,
  _borderTopWidth,
}: CollapsibleBodyProps): ReactElement => {
  const { collapsibleBodyId, isExpanded } = useCollapsible();
  return (
    <BaseBox
      id={collapsibleBodyId}
      width={width}
      borderTopWidth={_borderTopWidth}
      borderTopColor={_borderTopColor}
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

export type { CollapsibleBodyProps };
export { CollapsibleBody };
