/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import styled from 'styled-components';
import { ComponentIds } from './componentIds';
import { useBottomSheetContext } from './BottomSheetContext';
import { useIsomorphicLayoutEffect } from '~src/hooks/useIsomorphicLayoutEffect';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';
import { makeMotionTime } from '~utils';

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

const OverflowGradient = styled(BaseBox)(({ theme }) => {
  return {
    background: `linear-gradient(180deg, transparent 0%, ${theme.colors.surface.background.level2.lowContrast} 57.66%)`,
    transitionDuration: `${makeMotionTime(theme.motion.duration.moderate)}`,
    transitionTimingFunction: `${theme.motion.easing.standard.effective}`,
  };
});

const _BottomSheetBody = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const { scrollRef, setContentHeight, footerHeight, isOpen, bind } = useBottomSheetContext();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [showOverflowIndicator, setShowOverflowIndicator] = React.useState(true);

  useIsomorphicLayoutEffect(() => {
    if (!contentRef.current) return;
    setContentHeight(contentRef.current.getBoundingClientRect().height);
  }, [contentRef, isOpen]);

  const handleOverflowIndicator = React.useCallback((element: HTMLElement | null): void => {
    if (!element) return;
    const scrollValue = element.offsetHeight + element.scrollTop;
    const isAtBottom = scrollValue >= element.scrollHeight;
    setShowOverflowIndicator(!isAtBottom);
  }, []);

  const handleScroll = React.useCallback(
    (event: React.UIEvent<HTMLDivElement, UIEvent>): void => {
      const element = event.currentTarget;
      handleOverflowIndicator(element);
    },
    [handleOverflowIndicator],
  );

  useIsomorphicLayoutEffect(() => {
    const element = (contentRef as React.MutableRefObject<HTMLElement>)?.current;
    handleOverflowIndicator(element);
  }, [handleOverflowIndicator, contentRef]);

  return (
    <BaseBox
      ref={scrollRef}
      flexGrow={1}
      flexShrink={1}
      style={bodyStyles}
      onScroll={handleScroll}
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
        overflow="auto"
      >
        {children}
      </BaseBox>
      <OverflowGradient
        data-oveerflow
        position="fixed"
        bottom={`${footerHeight}px`}
        width="100%"
        height="48px"
        opacity={showOverflowIndicator ? 0.9 : 0}
      />
    </BaseBox>
  );
};

const BottomSheetBody = assignWithoutSideEffects(_BottomSheetBody, {
  componentId: ComponentIds.BottomSheetBody,
});

export { BottomSheetBody };
