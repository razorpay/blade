/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { ComponentIds } from './componentIds';
import { useBottomSheetContext } from './BottomSheetContext';
import { useIsomorphicLayoutEffect } from '~src/hooks/useIsomorphicLayoutEffect';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';

const bodyStyles: React.CSSProperties = {
  WebkitTapHighlightColor: 'revert',
  WebkitTouchCallout: 'revert',
  WebkitUserSelect: 'auto',
  overscrollBehavior: 'contain',
  WebkitOverflowScrolling: 'touch',
  userSelect: 'auto',
  overflow: 'auto',
  touchAction: 'none',
};

const _BottomSheetBody = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const { scrollRef, setContentHeight, isOpen, bind } = useBottomSheetContext();
  const contentRef = React.useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!contentRef.current) return;
    setContentHeight(contentRef.current.getBoundingClientRect().height);
  }, [contentRef, isOpen]);

  return (
    <BaseBox
      ref={scrollRef}
      flexGrow={1}
      flexShrink={1}
      style={bodyStyles}
      // Passing isContentDragging to bind()
      // Inside the useDrag() hook this will let us know if user is dragging the content or not
      {...bind?.({ isContentDragging: true })}
    >
      <BaseBox
        marginLeft="spacing.5"
        marginRight="spacing.5"
        paddingTop="spacing.5"
        paddingBottom="spacing.5"
        ref={contentRef}
        overflow="hidden"
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
