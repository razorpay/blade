import React from 'react';
import { CollapsibleBody } from '~components/Collapsible';
import { Divider } from '~components/Divider';
import { CardGroupBodyProvider } from './CardGroupContext';
import { ComponentIds } from './componentIds';
import type { CardGroupCollapsibleItemBodyProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _CardGroupCollapsibleItemBody = ({
  children,
  testID,
  ...rest
}: CardGroupCollapsibleItemBodyProps): React.ReactElement => {
  return (
    <CollapsibleBody _hasMargin={false} width="100%" {...makeAnalyticsAttribute(rest)}>
      {/* Content here is not a disclosure trigger — see CardGroupContext. */}
      <CardGroupBodyProvider>
        {/* Full-bleed divider separating the revealed content from the trigger row. */}
        <Divider />
        <BaseBox
          paddingY="spacing.4"
          paddingX="spacing.5"
          {...metaAttribute({ name: MetaConstants.CardGroupCollapsibleItemBody, testID })}
        >
          {children}
        </BaseBox>
      </CardGroupBodyProvider>
    </CollapsibleBody>
  );
};

const CardGroupCollapsibleItemBody = assignWithoutSideEffects(_CardGroupCollapsibleItemBody, {
  displayName: 'CardGroupCollapsibleItemBody',
  componentId: ComponentIds.CardGroupCollapsibleItemBody,
});

export { CardGroupCollapsibleItemBody };
