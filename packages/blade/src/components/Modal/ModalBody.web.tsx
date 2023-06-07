/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useModalContext } from './ModalContext';
import { modalHighestZIndex, scrollOverlayHeight } from './modalTokens';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';
import BaseBox from '~components/Box/BaseBox';
import { MetaConstants, makeMotionTime, makeSize, metaAttribute } from '~utils';
import type { SpacingValueType } from '~components/Box/BaseBox';

type ModalBodyProps = {
  children: React.ReactNode;
  /**
   * Sets the padding equally on all sides. Only few `spacing` tokens are allowed deliberately
   * @default `spacing.6`
   *
   * **Links:**
   * - Docs: https://blade.razorpay.com/?path=/docs/tokens-spacing--page
   */
  padding?: Extract<SpacingValueType, 'spacing.0' | 'spacing.6'>;
};

const OverflowOverlay = styled(BaseBox)<{
  scrollbarWidth: number;
  footerHeight: number;
  showOverlay: boolean;
}>`
  position: absolute;
  left: 0%;
  right: ${({ scrollbarWidth }) => `${scrollbarWidth}px`};
  bottom: ${({ footerHeight }) => `${footerHeight}px`};
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.6) 47.66%,
    #ffffff 115.17%
  );
  height: ${makeSize(scrollOverlayHeight)};
  z-index: ${modalHighestZIndex};
  pointer-events: none;
  opacity: ${({ showOverlay }) => (showOverlay ? 1 : 0)};
  transition: ${({ theme }) =>
    `opacity ${makeMotionTime(theme.motion.duration.moderate)} ${
      theme.motion.easing.standard.effective
    }`};
`;

const _ModalBody = ({ children, padding = 'spacing.6' }: ModalBodyProps): React.ReactElement => {
  const contentRef = React.useRef<any>(null);
  const { footerHeight } = useModalContext();
  const [hasScrollbar, setHasScrollbar] = useState(false);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const [scrollEnd, setScrollEnd] = useState(false);

  const checkForScrollbar = useCallback(() => {
    // Checks if the content has a scrollbar
    // and sets the width of the scrollbar
    const element = contentRef.current;
    if (element) {
      const hasScrollbar = element.scrollHeight > element.clientHeight;
      setScrollbarWidth(element.offsetWidth - element.clientWidth);
      setHasScrollbar(hasScrollbar);
    }
  }, [contentRef]);

  useEffect(() => {
    // Check for scrollbar on mount
    checkForScrollbar();
  }, [contentRef, checkForScrollbar]);

  useEffect(() => {
    // Check for scrollbar on resize of content
    if (!contentRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      checkForScrollbar();
    });
    resizeObserver.observe(contentRef.current);
    // eslint-disable-next-line consistent-return
    return () => resizeObserver.disconnect();
  }, []);

  const hideOverlayOnScrollEnd = (e: any): void => {
    const bottom = e?.target?.scrollHeight - e?.target?.scrollTop === e?.target?.clientHeight;
    if (bottom && !scrollEnd) {
      setScrollEnd(true);
    } else if (!bottom && scrollEnd) {
      setScrollEnd(false);
    }
  };

  return (
    <BaseBox
      {...metaAttribute({ name: MetaConstants.ModalBody })}
      padding={padding}
      ref={contentRef}
      overflowY="auto"
      overflowX="hidden"
      onScroll={hideOverlayOnScrollEnd}
    >
      <OverflowOverlay
        {...metaAttribute({ name: MetaConstants.ModalScrollOverlay })}
        scrollbarWidth={scrollbarWidth}
        footerHeight={footerHeight}
        showOverlay={hasScrollbar && !scrollEnd}
      />
      {children}
    </BaseBox>
  );
};

const ModalBody = assignWithoutSideEffects(_ModalBody, {
  componentId: MetaConstants.ModalBody,
});

export { ModalBody };
export type { ModalBodyProps };
