/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable consistent-return */
import React from 'react';
import styled from 'styled-components';
import { castWebType, makeBorderSize, makeMotionTime, makeSpace } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { useTheme } from '~components/BladeProvider';
import { useResize } from '~utils/useResize';
import BaseBox from '~components/Box/BaseBox';

const StyledTabNavIndicator = styled(BaseBox)(({ theme }) => {
  return {
    pointerEvents: 'none',
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: makeSpace(theme.border.width.thin),
    borderTopLeftRadius: makeBorderSize(theme.border.radius.medium),
    borderTopRightRadius: makeBorderSize(theme.border.radius.medium),
    willChange: 'transform, width, opacity',
  };
});

const ACTIVE_ITEM_SELECTOR = '[data-blade-component="tab-nav-item"][data-active="true"]';

const TabNavIndicator = ({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
}): React.ReactElement => {
  const { theme } = useTheme();
  const indicatorRef = React.useRef<HTMLDivElement>(null);
  const shouldAnimateRef = React.useRef(false);

  const updatePosition = React.useCallback(() => {
    const container = containerRef.current;
    const indicator = indicatorRef.current;
    if (!container || !indicator) return;

    const activeItem = container.querySelector<HTMLElement>(ACTIVE_ITEM_SELECTOR);

    if (!activeItem || activeItem.offsetWidth === 0) {
      indicator.style.opacity = '0';
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const activeRect = activeItem.getBoundingClientRect();
    const x = activeRect.left - containerRect.left;

    const duration = shouldAnimateRef.current
      ? makeMotionTime(theme.motion.duration.gentle)
      : '0ms';

    indicator.style.transitionDuration = castWebType(duration);
    indicator.style.width = `${activeRect.width}px`;
    indicator.style.transform = `translateX(${x}px)`;
    indicator.style.opacity = '1';

    if (!shouldAnimateRef.current) {
      requestAnimationFrame(() => {
        shouldAnimateRef.current = true;
      });
    }
  }, [containerRef, theme.motion.duration.gentle]);

  React.useEffect(() => {
    updatePosition();
  });

  React.useEffect(() => {
    if ('fonts' in document) {
      try {
        void document.fonts.ready.then(() => {
          updatePosition();
        });
      } catch {
        /* empty */
      }
    }
  }, [updatePosition]);

  useResize(containerRef, updatePosition);

  return (
    <StyledTabNavIndicator
      ref={indicatorRef}
      style={{
        transitionProperty: 'transform, width, opacity',
        transitionTimingFunction: castWebType(theme.motion.easing.standard),
        transitionDuration: '0ms',
        opacity: 0,
        background: `linear-gradient(90deg, transparent 0%, ${theme.colors.surface.icon.staticWhite.normal} 20%, ${theme.colors.surface.icon.staticWhite.normal} 80.29%, transparent 100%)`,
      }}
      {...metaAttribute({ name: MetaConstants.TabNavIndicator })}
    />
  );
};

export { TabNavIndicator };
