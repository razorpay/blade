import React from 'react';
import { ScrollView } from 'react-native';
import type { StepGroupContextType, StepGroupProps } from './types';
import { StepGroupContext, useStepGroup } from './StepGroupContext';
import { componentIds } from './componentIds';
import BaseBox from '~components/Box/BaseBox';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { BladeElementRef } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { componentIds as collapsibleComponentIds } from '~components/Collapsible/componentIds';
import { throwBladeError } from '~utils/logger';

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
    // Mutable counter so Collapsible recursion can increment indexes that siblings after it see.
    // A primitive param would not propagate increments back (nested groups get a fresh counter).
    stepItemIndex = { current: 0 },
  ): React.ReactNode => {
    return React.Children.map(groupChildrenProp, (child, index) => {
      const componentId = getComponentId(child);
      if (componentId === componentIds.StepItem) {
        return React.cloneElement(child, {
          _index: stepItemIndex.current++,
          _totalIndex: totalIndex++,
          _nestingLevel: nestingLevelOfGroup,
          key: index,
        });
      }

      if (componentId === collapsibleComponentIds.Collapsible) {
        if (parentStepGroupProps.orientation !== 'vertical' && __DEV__) {
          throwBladeError({
            message: 'Collapsible is not supported in horizontal orientation',
            moduleName: 'StepGroup',
          });
        }

        return React.cloneElement(child, {
          children: React.Children.map(child.props.children, (nestedChild) => {
            if (
              React.isValidElement(nestedChild) &&
              getComponentId(nestedChild) === collapsibleComponentIds.CollapsibleBody
            ) {
              const nestedChildProps = nestedChild.props as {
                children: React.ReactElement;
                width?: BaseBoxProps['width'];
              };
              return React.cloneElement(nestedChild as React.ReactElement, {
                /*
                  Collapsible aligns its children to the start (alignItems: 'flex-start'), so the
                  body shrink-wraps to its content width by default. StepItem relies on width: '100%'
                  to fill the row and let its header column flex-grow — without a definite full width
                  the header collapses to 0 and only the markers stay visible. Forcing the body to
                  full width gives StepItem a definite width to resolve against.
                */
                width: nestedChildProps.width ?? '100%',
                children: traverseGroupAndAddIndex(
                  nestedChildProps.children,
                  nestingLevelOfGroup,
                  stepItemIndex,
                ),
                key: totalIndex,
              });
            }
            return nestedChild;
          }),
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
  const paddingY = _nestingLevel === 0 ? ('spacing.4' as const) : undefined;
  const flexDirection = isHorizontal ? ('row' as const) : ('column' as const);

  // Horizontal: put ref + styled props on an outer wrapper so margins apply around the
  // scroller (web puts them on the same root as overflowX). Inner box keeps the row layout.
  if (isHorizontal && _nestingLevel === 0) {
    return (
      <StepGroupContext.Provider value={contextValue}>
        <BaseBox
          ref={ref as never}
          {...getStyledProps(rest)}
          maxWidth={maxWidth}
          minWidth={minWidth}
          width={width}
          {...metaAttribute({ name: MetaConstants.StepGroup, testID })}
          {...makeAnalyticsAttribute(rest)}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BaseBox paddingY={paddingY} flexDirection={flexDirection}>
              {childrenWithIndex}
            </BaseBox>
          </ScrollView>
        </BaseBox>
      </StepGroupContext.Provider>
    );
  }

  return (
    <StepGroupContext.Provider value={contextValue}>
      <BaseBox
        ref={ref as never}
        {...getStyledProps(rest)}
        maxWidth={maxWidth ?? '100%'}
        minWidth={minWidth}
        width={width}
        paddingY={paddingY}
        flexDirection={flexDirection}
        {...metaAttribute({ name: MetaConstants.StepGroup, testID })}
        {...makeAnalyticsAttribute(rest)}
      >
        {childrenWithIndex}
      </BaseBox>
    </StepGroupContext.Provider>
  );
};

const StepGroup = assignWithoutSideEffects(React.forwardRef(_StepGroup), {
  componentId: componentIds.StepGroup,
  displayName: componentIds.StepGroup,
});

export { StepGroup };
