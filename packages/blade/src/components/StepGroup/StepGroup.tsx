import React from 'react';
import type { StepGroupContextType, StepGroupProps } from './types';
import { StepGroupContext, useStepGroup } from './StepGroupContext';
import { componentIds } from './componentIds';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _StepGroup = ({
  size = 'medium',
  orientation = 'vertical',
  children,
  testID,
  _isFirstGroup,
  _isLastGroup,
  ...styledProps
}: StepGroupProps): React.ReactElement => {
  const { nestingLevel: parentStepGroupNestingLevel = 0 } = useStepGroup();
  const itemsCount = React.Children.count(children);
  const contextValue = React.useMemo<StepGroupContextType>(
    () => ({
      size,
      orientation,
      nestingLevel: parentStepGroupNestingLevel + 1,
      itemsCount,
    }),
    [size, orientation, parentStepGroupNestingLevel, itemsCount],
  );

  let stepItemIndex = 0;
  const childrenWithIndex = React.Children.map(children, (child, index) => {
    const componentId = getComponentId(child);
    let isFirstItem = false;
    let isLastItem = false;
    let isFirstGroup = false;
    let isLastGroup = false;

    if (parentStepGroupNestingLevel === -1) {
      // find 1st and last item of Parent StepGroup
      if (index === 0) {
        if (componentId === componentIds.StepItem) {
          isFirstItem = true;
        }

        if (componentId === componentIds.StepGroup) {
          isFirstGroup = true;
        }
      }

      if (index === itemsCount - 1) {
        if (componentId === componentIds.StepItem) {
          isLastItem = true;
        }

        if (componentId === componentIds.StepGroup) {
          isLastGroup = true;
        }
      }
    }

    if (componentId === componentIds.StepItem) {
      return React.cloneElement(child, {
        _index: stepItemIndex++,
        _isFirstItem: isFirstItem || (_isFirstGroup && stepItemIndex === 0),
        _isLastItem: isLastItem || (_isLastGroup && stepItemIndex === itemsCount - 1),
        key: index,
      });
    }

    if (componentId === componentIds.StepGroup) {
      return React.cloneElement(child, {
        _isFirstGroup: isFirstGroup,
        _isLastGroup: isLastGroup,
        key: index,
      });
    }

    return child;
  });

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
