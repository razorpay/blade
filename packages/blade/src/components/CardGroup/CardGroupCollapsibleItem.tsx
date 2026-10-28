import React from 'react';
import { Collapsible } from '~components/Collapsible';
import { ComponentIds } from './componentIds';
import type { CardGroupCollapsibleItemProps } from './types';
import { getStyledProps } from '~components/Box/styledProps';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _CardGroupCollapsibleItem = ({
  children,
  isExpanded,
  defaultIsExpanded = false,
  onExpandChange,
  testID,
  ...rest
}: CardGroupCollapsibleItemProps): React.ReactElement => {
  return (
    <Collapsible
      direction="bottom"
      isExpanded={isExpanded}
      defaultIsExpanded={defaultIsExpanded}
      onExpandChange={onExpandChange}
      _shouldApplyWidthRestrictions={false}
      // The trigger row is a CardGroupItem, not one of Collapsible's own
      // trigger children, so the allowed-children check must be disabled.
      _dangerouslyDisableValidations
      testID={testID}
      {...getStyledProps(rest)}
      {...makeAnalyticsAttribute(rest)}
    >
      {children}
    </Collapsible>
  );
};

const CardGroupCollapsibleItem = assignWithoutSideEffects(_CardGroupCollapsibleItem, {
  displayName: 'CardGroupCollapsibleItem',
  componentId: ComponentIds.CardGroupCollapsibleItem,
});

export { CardGroupCollapsibleItem };
