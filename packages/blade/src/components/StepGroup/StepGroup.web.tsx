import React from 'react';
import type { StepGroupContextType, StepGroupProps } from './types';
import { StepGroupContext, useStepGroup } from './StepGroupContext';
import { componentIds } from './componentIds';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { BladeElementRef } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const useChildrenWithIndexes = ({
  _nestingLevel,
  children,
  ...parentStepGroupProps
}: Pick<StepGroupProps, 'children' | '_nestingLevel' | 'size' | 'orientation'>): {
  childrenWithIndex: React.ReactNode;
  totalItemsInParentGroupCount: number;
} => {
  const { totalItemsInParentGroupCount: totalItemsFromPreviousParent } = useStepGroup();

  let totalIndex = 0;
  const traverseGroupAndAddIndex = (
    groupChildrenProp: StepGroupProps['children'],
    nestingLevelOfGroup = 0,
  ): React.ReactNode => {
    let stepItemIndex = 0;
    return React.Children.map(groupChildrenProp, (child, index) => {
      const componentId = getComponentId(child);
      if (componentId === componentIds.StepItem) {
        return React.cloneElement(child, {
          _index: stepItemIndex++,
          _totalIndex: totalIndex++,
          _nestingLevel: nestingLevelOfGroup,
          key: index,
        });
      }

      if (componentId === componentIds.StepGroup && nestingLevelOfGroup < 3) {
        return React.cloneElement(child, {
          ...parentStepGroupProps,
          children: traverseGroupAndAddIndex(child.props.children, nestingLevelOfGroup + 1),
          _nestingLevel: nestingLevelOfGroup + 1,
        });
      }

      return child;
    });
  };

  const childrenWithIndex: React.ReactNode = React.useMemo(
    () => (_nestingLevel === 0 ? traverseGroupAndAddIndex(children) : children),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [children, _nestingLevel],
  );

  const totalItemsInParentGroupCount =
    _nestingLevel === 0 ? totalIndex : totalItemsFromPreviousParent;

  return { childrenWithIndex, totalItemsInParentGroupCount };
};

const _StepGroup = (
  {
    size = 'medium',
    orientation = 'vertical',
    children,
    testID,
    _nestingLevel = 0,
    width,
    minWidth,
    maxWidth,
    ...rest
  }: StepGroupProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  const itemsInGroupCount = React.Children.count(children);
  const { childrenWithIndex, totalItemsInParentGroupCount } = useChildrenWithIndexes({
    children,
    size,
    orientation,
    _nestingLevel,
  });
  const contextValue = React.useMemo<StepGroupContextType>(
    () => ({
      size,
      orientation,
      itemsInGroupCount,
      totalItemsInParentGroupCount,
    }),
    [size, orientation, itemsInGroupCount, totalItemsInParentGroupCount],
  );

  const isHorizontal = orientation === 'horizontal';
  const defaultWidth = isHorizontal ? '100%' : undefined;

  return (
    <StepGroupContext.Provider value={contextValue}>
      <BaseBox
        ref={ref as never}
        {...getStyledProps(rest)}
        display="inline-flex"
        maxWidth={maxWidth ?? '100%'}
        minWidth={minWidth}
        width={width ?? defaultWidth}
        padding={_nestingLevel === 0 ? 'spacing.4' : undefined}
        overflowX={orientation === 'horizontal' ? 'auto' : undefined}
        flexDirection={orientation === 'vertical' ? 'column' : 'row'}
        {...metaAttribute({ name: MetaConstants.StepGroup, testID })}
        {...makeAnalyticsAttribute(rest)}
      >
        {childrenWithIndex}
      </BaseBox>
    </StepGroupContext.Provider>
  );
};

/**
 * ## StepGroup
 *
 * Step Group visualises sequential processes with a consistent structure. It can be interactive, guiding users through steps, or function as a timeline for reference.
 *
 * ### Usage
 *
 * ```jsx
 * <StepGroup orientation="vertical" size="medium">
 *   <StepItem title="Personal Details" />
 *   <StepItem title="Business Details" />
 * </StepGroup>
 * ```
 *
 * ---
 *
 * Checkout {@link https://blade.razorpay.com/?path=/docs/components-stepgroup--docs StepGroup Documentation}
 */
const StepGroup = assignWithoutSideEffects(React.forwardRef(_StepGroup), {
  componentId: componentIds.StepGroup,
  displayName: componentIds.StepGroup,
});

export { StepGroup };
