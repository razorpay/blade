import React from 'react';
import { emptyStateSizeTokens } from './emptyStateTokens';
import type { EmptyStateProps } from './types';
import type { BladeElementRef } from '~utils/types';
import BaseBox from '~components/Box/BaseBox';
import { Heading, Text } from '~components/Typography';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const _EmptyState: React.ForwardRefRenderFunction<BladeElementRef, EmptyStateProps> = (
  { asset, title, description, children, size = 'medium', testID, ...props },
  ref,
) => {
  const tokens = emptyStateSizeTokens[size];

  return (
    <BaseBox
      ref={ref as never}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={tokens.gapBetweenSections}
      {...metaAttribute({ name: MetaConstants.EmptyState, testID })}
      {...getStyledProps(props)}
      {...makeAnalyticsAttribute(props)}
    >
      {asset}
      <BaseBox display="flex" flexDirection="column" gap="spacing.2" alignItems="center">
        {title && (
          <Heading
            textAlign="center"
            size={tokens.titleSize}
            weight="semibold"
            color="surface.text.gray.subtle"
          >
            {title}
          </Heading>
        )}

        {description && (
          <Text
            textAlign="center"
            size={tokens.descriptionSize}
            color="surface.text.gray.muted"
            weight="regular"
            variant="body"
          >
            {description}
          </Text>
        )}
      </BaseBox>

      {children}
    </BaseBox>
  );
};

const EmptyState = assignWithoutSideEffects(React.forwardRef(_EmptyState), {
  displayName: 'EmptyState',
  componentId: 'EmptyState',
});

export { EmptyState };
