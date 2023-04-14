/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { ComponentIds } from './componentIds';
import { useBottomSheetContext } from './BottomSheetContext';
import { useIsomorphicLayoutEffect } from '~src/hooks/useIsomorphicLayoutEffect';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';

const _BottomSheetBody = ({ children }: { children: React.ReactNode }): React.ReactElement => {
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
      data-testid="bottomsheet-body"
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
        paddingTop="spacing.3"
        paddingBottom="spacing.3"
        data-content
        data-testid="bottomsheet-content"
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
