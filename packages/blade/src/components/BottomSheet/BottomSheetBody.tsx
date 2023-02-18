/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useBottomSheetContext } from './BottomSheet';
import { ComponentIds } from './componentIds';
import type { WithComponentId } from '~utils';
import { useIsomorphicLayoutEffect } from '~src/hooks/useIsomorphicLayoutEffect';
import BaseBox from '~components/Box/BaseBox';

const BottomSheetBody: WithComponentId<{ children: React.ReactNode }> = ({ children }) => {
  const { scrollRef, setContentHeight, isOpen, bind } = useBottomSheetContext();
  const contentRef = React.useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!contentRef.current) return;
    setContentHeight(contentRef.current.getBoundingClientRect().height);
  }, [contentRef, isOpen]);

  return (
    <BaseBox
      data-scroll
      ref={scrollRef}
      style={{
        flexShrink: 1,
        flexGrow: 1,
        WebkitTapHighlightColor: 'revert',
        WebkitTouchCallout: 'revert',
        WebkitUserSelect: 'auto',
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        userSelect: 'auto',
        overflow: 'auto',
      }}
      {...bind?.({ isContentDragging: true })}
    >
      <BaseBox
        marginLeft="spacing.3"
        marginRight="spacing.3"
        marginTop="spacing.3"
        marginBottom="spacing.3"
        data-content
        ref={contentRef}
        overflow="hidden"
      >
        {children}
      </BaseBox>
    </BaseBox>
  );
};
BottomSheetBody.componentId = ComponentIds.BottomSheetBody;

export { BottomSheetBody };
