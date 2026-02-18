/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable consistent-return */
import React from 'react';
import styled from 'styled-components';
import { castWebType, makeBorderSize, makeMotionTime, makeSpace } from '~utils';
import { size } from '~tokens/global';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { useTheme } from '~components/BladeProvider';
import { useResize } from '~utils/useResize';
import BaseBox from '~components/Box/BaseBox';

const StyledIndicatorWrapper = styled.div({
  pointerEvents: 'none',
  position: 'absolute',
  bottom: 0,
  left: 0,
  willChange: 'transform, width, opacity',
});

const StyledTabNavIndicatorLine = styled(BaseBox)(({ theme }) => {
  return {
    position: 'relative',
    width: '100%',
    height: makeSpace(theme.border.width.thin),
    borderTopLeftRadius: makeBorderSize(theme.border.radius.medium),
    borderTopRightRadius: makeBorderSize(theme.border.radius.medium),
  };
});

const GLOW_OVERFLOW = 32;
const GLOW_HEIGHT = size[44];

const buildGlowMask = (width: number, height: number = GLOW_HEIGHT): string => {
  const cx = width / 2;
  const rx = (width * 55.045703124999996) / 157.2734375;
  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Cdefs%3E%3Cfilter id='b' filterUnits='userSpaceOnUse' x='0' y='0' width='${width}' height='${height}'%3E%3CfeGaussianBlur stdDeviation='40'/%3E%3C/filter%3E%3C/defs%3E%3Cellipse cx='${cx}' cy='${height}' rx='${rx}' ry='60' fill='black' filter='url(%23b)'/%3E%3C/svg%3E")`;
};

const StyledIndicatorGlow = styled.div<{ glowColor: string; glowWidth: number }>(
  ({ glowColor, glowWidth }) => {
    const totalWidth = glowWidth + GLOW_OVERFLOW * 2;
    const mask = buildGlowMask(totalWidth);
    return {
      position: 'absolute',
      bottom: 0,
      left: `${-GLOW_OVERFLOW}px`,
      width: `${totalWidth}px`,
      height: `${GLOW_HEIGHT}px`,
      opacity: 0.64,
      background: `radial-gradient(50% 100% at 50% 100%, ${glowColor} 0%, transparent 100%)`,
      WebkitMaskImage: mask,
      WebkitMaskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center bottom',
      WebkitMaskSize: '100% 100%',
      maskImage: mask,
      maskRepeat: 'no-repeat',
      maskPosition: 'center bottom',
      maskSize: '100% 100%',
    };
  },
);

const ACTIVE_ITEM_SELECTOR = '[data-blade-component="tab-nav-item"][data-active="true"]';

const TabNavIndicator = ({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
}): React.ReactElement => {
  const { theme } = useTheme();
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const shouldAnimateRef = React.useRef(false);
  const [activeWidth, setActiveWidth] = React.useState(0);

  const updatePosition = React.useCallback(() => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    if (!container || !wrapper) return;

    const activeItem = container.querySelector<HTMLElement>(ACTIVE_ITEM_SELECTOR);

    if (!activeItem || activeItem.offsetWidth === 0) {
      wrapper.style.opacity = '0';
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const activeRect = activeItem.getBoundingClientRect();
    const x = activeRect.left - containerRect.left;

    const duration = shouldAnimateRef.current
      ? makeMotionTime(theme.motion.duration.gentle)
      : '0ms';

    wrapper.style.transitionDuration = castWebType(duration);
    wrapper.style.width = `${activeRect.width}px`;
    wrapper.style.transform = `translateX(${x}px)`;
    wrapper.style.opacity = '1';

    setActiveWidth(activeRect.width);

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

  const glowColor = theme.colors.surface.background.primary.intense;

  return (
    <StyledIndicatorWrapper
      ref={wrapperRef}
      style={{
        transitionProperty: 'transform, width, opacity',
        transitionTimingFunction: castWebType(theme.motion.easing.standard),
        transitionDuration: '0ms',
        opacity: 0,
      }}
      {...metaAttribute({ name: MetaConstants.TabNavIndicator })}
    >
      {activeWidth > 0 && <StyledIndicatorGlow glowColor={glowColor} glowWidth={activeWidth} />}
      <StyledTabNavIndicatorLine
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${theme.colors.surface.icon.staticWhite.normal} 20%, ${theme.colors.surface.icon.staticWhite.normal} 80.29%, transparent 100%)`,
        }}
      />
    </StyledIndicatorWrapper>
  );
};

export { TabNavIndicator };
