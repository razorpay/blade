/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { ComponentIds } from './componentIds';
import { useBottomSheetContext } from './BottomSheetContext';
import type { BottomSheetBodyProps } from './types';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import BaseBox from '~components/Box/BaseBox';
import { componentIds } from '~components/ActionList/componentIds';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { isValidAllowedChildren } from '~utils/isValidAllowedChildren';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const bodyStyles: React.CSSProperties = {
  WebkitTapHighlightColor: 'revert',
  WebkitTouchCallout: 'revert',
  WebkitUserSelect: 'auto',
  overscrollBehavior: 'contain',
  WebkitOverflowScrolling: 'touch',
  userSelect: 'auto',
  touchAction: 'none',
};

const _BottomSheetBody = ({
  children,
  padding = 'spacing.5',
  overflow = 'auto',
  ...dataAnalyticsProps
}: BottomSheetBodyProps): React.ReactElement => {
  const { scrollRef, setContentHeight, setHasBodyPadding, isOpen, bind } = useBottomSheetContext();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [bottomSheetHasActionList, setBottomSheetHasActionList] = React.useState<boolean>(false);

  useIsomorphicLayoutEffect(() => {
    if (!contentRef.current) return;
    setContentHeight(contentRef.current.getBoundingClientRect().height);
  }, [contentRef, isOpen, children]);

  React.useEffect(() => {
    setBottomSheetHasActionList(false);
    React.Children.forEach(children, (child) => {
      if (isValidAllowedChildren(child, componentIds.ActionList)) {
        setBottomSheetHasActionList(true);
      }
    });
  }, [children]);

  React.useEffect(() => {
    if (padding === 'spacing.0') {
      setHasBodyPadding(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [padding]);

  return (
    <BaseBox
      {...metaAttribute({
        testID: 'bottomsheet-body',
        name: MetaConstants.BottomSheetBody,
      })}
      {...makeAnalyticsAttribute(dataAnalyticsProps)}
      ref={scrollRef}
      flexGrow={1}
      flexShrink={1}
      style={bodyStyles}
      overflow={overflow}
      // Passing isContentDragging to bind()
      // Inside the useDrag() hook this will let us know if user is dragging the content or not
      {...bind?.({ isContentDragging: true })}
    >
      <BaseBox
        paddingLeft={bottomSheetHasActionList ? 'spacing.3' : padding}
        paddingRight={bottomSheetHasActionList ? 'spacing.3' : padding}
        paddingTop={bottomSheetHasActionList ? 'spacing.3' : padding}
        paddingBottom={bottomSheetHasActionList ? 'spacing.3' : padding}
        ref={contentRef}
        overflow={overflow}
      >
        {children}
      </BaseBox>
    </BaseBox>
  );
};

const BottomSheetBody = assignWithoutSideEffects(_BottomSheetBody, {
  componentId: ComponentIds.BottomSheetBody,
});

export { BottomSheetBody };
