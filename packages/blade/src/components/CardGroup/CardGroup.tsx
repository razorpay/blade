import React from 'react';
import { StyledCardGroupSurface } from './StyledCardGroupSurface';
import { CardGroupProvider } from './CardGroupContext';
import { ComponentIds } from './componentIds';
import type { CardGroupProps } from './types';
import { Divider } from '~components/Divider';
import { getStyledProps } from '~components/Box/styledProps';
import { useTheme } from '~components/BladeProvider';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAccessible } from '~utils/makeAccessible';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import type { BladeElementRef } from '~utils/types';

const _CardGroup = (
  { children, accessibilityLabel, testID, ...rest }: CardGroupProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  const { colorScheme } = useTheme();

  return (
    <CardGroupProvider>
      <StyledCardGroupSurface
        ref={ref as never}
        colorScheme={colorScheme}
        {...metaAttribute({ name: MetaConstants.CardGroup, testID })}
        {...makeAccessible({ role: 'group', label: accessibilityLabel })}
        {...getStyledProps(rest)}
        {...makeAnalyticsAttribute(rest)}
      >
        {React.Children.map(children, (child, index) => (
          <>
            {index > 0 ? <Divider /> : null}
            {child}
          </>
        ))}
      </StyledCardGroupSurface>
    </CardGroupProvider>
  );
};

/**
 * ### CardGroup
 *
 * `CardGroup` stacks navigating, selecting and disclosing rows into a single
 * surface. It owns the border, radius, elevation, the top/bottom gradient and
 * the dividers between rows.
 *
 * ---
 *
 * #### Usage
 *
 * ```jsx
 * <CardGroup accessibilityLabel="Payment methods">
 *   <CardGroupItem href="/cards" leading={<CreditCardIcon />}>Cards</CardGroupItem>
 *   <CardGroupCollapsibleItem defaultIsExpanded>
 *     <CardGroupItem leading={<UpiIcon />}>UPI</CardGroupItem>
 *     <CardGroupCollapsibleItemBody>Google Pay, PhonePe</CardGroupCollapsibleItemBody>
 *   </CardGroupCollapsibleItem>
 *   <CardGroupItem onClick={handleSelect} isSelected>Wallet</CardGroupItem>
 * </CardGroup>
 * ```
 */
const CardGroup = assignWithoutSideEffects(React.forwardRef(_CardGroup), {
  displayName: 'CardGroup',
  componentId: ComponentIds.CardGroup,
});

export { CardGroup };
