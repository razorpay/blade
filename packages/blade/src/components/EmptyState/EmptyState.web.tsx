import React from 'react';
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

const _EmptyState: React.ForwardRefRenderFunction<BladeElementRef, EmptyStateProps> = (
  { asset, title, description, children, size = 'medium', testID, ...props },
  ref,
) => {
  const tokens = emptyStateSizeTokens[size];
  // Title and description render BaseText with Heading / Text props so they can use the web-only
  // `textWrap="balance"`: centred copy then doesn't leave a single word on its last line.
  const titleProps = getHeadingProps({
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
          <BaseText {...titleProps} textAlign="center" textWrap="balance">
            {title}
          </BaseText>
        ) : null}

        {description ? (
          <BaseText {...descriptionProps} as="p" textWrap="balance">
            {description}
          </BaseText>
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
