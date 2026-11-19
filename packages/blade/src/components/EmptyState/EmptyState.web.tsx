import React from 'react';
import styled from 'styled-components';
import { emptyStateSizeTokens } from './emptyStateTokens';
import type { EmptyStateProps } from './types';
import type { BladeElementRef } from '~utils/types';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { BaseText } from '~components/Typography/BaseText';
import { getHeadingProps } from '~components/Typography/Heading/Heading';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

// Renders the same element and styles as `Heading`, plus balanced line breaks so a centred
// title doesn't leave a single word on its last line. Browsers without `text-wrap: balance`
// wrap as before. Heading doesn't forward `className`, so this wraps BaseText directly.
const BalancedTitle = styled(BaseText)`
  text-wrap: balance;
`;

const _EmptyState: React.ForwardRefRenderFunction<BladeElementRef, EmptyStateProps> = (
  { asset, title, description, children, size = 'medium', testID, ...props },
  ref,
) => {
  const tokens = emptyStateSizeTokens[size];
  // `as` must reach BaseText via `forwardedAs`; on a styled() wrapper it would replace BaseText
  const { as: titleAs, ...titleProps } = getHeadingProps({
    size: tokens.titleSize,
    weight: 'semibold',
    color: 'surface.text.gray.subtle',
  });

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
      {asset ? (
        <BaseBox maxWidth={tokens.assetMaxWidth} maxHeight={tokens.assetMaxHeight}>
          {asset}
        </BaseBox>
      ) : null}
      <BaseBox display="flex" flexDirection="column" gap="spacing.1" alignItems="center">
        {title ? (
          <BalancedTitle {...titleProps} forwardedAs={titleAs} textAlign="center">
            {title}
          </BalancedTitle>
        ) : null}

        {description ? (
          <Text
            textAlign="center"
            size={tokens.descriptionSize}
            color="surface.text.gray.muted"
            weight="regular"
            variant="body"
          >
            {description}
          </Text>
        ) : null}
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
