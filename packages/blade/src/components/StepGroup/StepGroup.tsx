import React from 'react';
import type { StepGroupContextType, StepGroupProps } from './types';
import { StepGroupContext, useStepGroup } from './StepGroupContext';
import { componentIds } from './componentIds';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

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

const _StepGroup = ({
  size = 'medium',
  orientation = 'vertical',
  children,
  testID,
  _nestingLevel = 0,
  ...styledProps
}: StepGroupProps): React.ReactElement => {
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

  return (
    <StepGroupContext.Provider value={contextValue}>
      <BaseBox
        {...getStyledProps(styledProps)}
        display="flex"
        flexDirection={orientation === 'vertical' ? 'column' : 'row'}
      >
        {childrenWithIndex}
      </BaseBox>
    </StepGroupContext.Provider>
  );
};

const StepGroup = assignWithoutSideEffects(_StepGroup, {
  componentId: componentIds.StepGroup,
  displayName: componentIds.StepGroup,
});

export { StepGroup };
