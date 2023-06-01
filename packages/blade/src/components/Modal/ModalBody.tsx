/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { modalBodyPadding, scrollOverlayHeight } from './modalTokens';
import { useModalContext } from './ModalContext';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';
import { MetaConstants, makeSize, metaAttribute } from '~utils';

type ModalBodyProps = {
  children: React.ReactNode;
};

const OverflowOverlay = styled(BaseBox)<{ scrollbarWidth: number; footerHeight: number }>`
  position: absolute;
  left: 0%;
  right: ${({ scrollbarWidth }) => `${scrollbarWidth}px`};
  bottom: ${({ footerHeight }) => `${footerHeight}px`};
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 58.7%);
  height: ${makeSize(scrollOverlayHeight)};
  z-index: 999;
  pointer-events: none;
`;

const _ModalBody = ({ children }: ModalBodyProps): React.ReactElement => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const { footerHeight } = useModalContext();
  const [hasScrollbar, setHasScrollbar] = useState(false);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

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

  return (
    <BaseBox
      {...metaAttribute({ name: MetaConstants.ModalBody })}
      padding={modalBodyPadding}
      ref={contentRef}
      overflowY="auto"
      overflowX="hidden"
    >
      {hasScrollbar && (
        <OverflowOverlay scrollbarWidth={scrollbarWidth} footerHeight={footerHeight} />
      )}
      {children}
    </BaseBox>
  );
};

const ModalBody = assignWithoutSideEffects(_ModalBody, {
  componentId: MetaConstants.ModalBody,
});

export { ModalBody };
export type { ModalBodyProps };
