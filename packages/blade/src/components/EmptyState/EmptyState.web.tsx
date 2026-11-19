import React from 'react';
import styled from 'styled-components';
import { emptyStateSizeTokens } from './emptyStateTokens';
import type { EmptyStateProps } from './types';
import type { BladeElementRef } from '~utils/types';
import BaseBox from '~components/Box/BaseBox';
import { BaseText } from '~components/Typography/BaseText';
import { getHeadingProps } from '~components/Typography/Heading/Heading';
import { getTextProps } from '~components/Typography/Text/Text';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

// Renders the same elements and styles as `Heading` / `Text`, plus balanced line breaks so
// centred copy doesn't leave a single word on its last line. Browsers without
// `text-wrap: balance` wrap as before. Heading and Text don't forward `className`, so this
// wraps BaseText directly.
const BalancedText = styled(BaseText)`
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
  const descriptionProps = getTextProps({
    variant: 'body',
    size: tokens.descriptionSize,
    weight: 'regular',
    color: 'surface.text.gray.muted',
    textAlign: 'center',
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
          <BalancedText {...titleProps} forwardedAs={titleAs} textAlign="center">
            {title}
          </BalancedText>
        ) : null}

        {description ? (
          <BalancedText {...descriptionProps} forwardedAs="p">
            {description}
          </BalancedText>
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
