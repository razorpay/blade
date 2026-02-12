/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable consistent-return */
import React from 'react';
import styled from 'styled-components';
import { useTabsContext } from './TabsContext';
import { castWebType, makeMotionTime } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { useTheme } from '~components/BladeProvider';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { useResize } from '~utils/useResize';
import BaseBox from '~components/Box/BaseBox';

const StyledTabIndicator = styled(BaseBox)(({ theme }) => {
  return {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.colors.interactive.background.primary.fadedHighlighted,
    },
  };
});

const TabIndicator = ({
  tabListContainerRef,
}: {
  tabListContainerRef: React.RefObject<HTMLElement | null>;
}): React.ReactElement => {
  const { theme } = useTheme();
  const { selectedValue, baseId, variant } = useTabsContext();
  const [shouldAnimate, setShouldAnimate] = React.useState(false);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0, x: 0, y: 0 });

  const updateDimensions = React.useCallback(() => {
    const activeTabItem = document.getElementById(`${baseId}-${selectedValue}-tabitem`);
    // Skip if element not found or not visible (width 0 means container is hidden)
    if (!activeTabItem || activeTabItem.offsetWidth === 0) return;

    setDimensions({
      width: activeTabItem.offsetWidth,
      height: activeTabItem.offsetHeight,
      x: activeTabItem.offsetLeft,
      y:
        variant === 'filled'
          ? activeTabItem.offsetTop
          : activeTabItem.offsetTop + activeTabItem.offsetHeight - 1.5,
    });

    // Enable animations after first valid measurement renders
    setShouldAnimate((prev) => {
      if (!prev) requestAnimationFrame(() => setShouldAnimate(true));
      return prev;
    });
  }, [baseId, selectedValue, variant]);

  // Update the dimensions when the selected value changes
  useIsomorphicLayoutEffect(() => {
    if (!selectedValue) return;
    updateDimensions();
  }, [baseId, selectedValue, updateDimensions]);

  // Update the dimensions when fonts load
  React.useEffect(() => {
    // check for FontFace API support
    // FontFaceAPI is widely supported but better to be safe than sorry
    if ('fonts' in document) {
      try {
        // wait for fonts to be loaded and then recalculate the dimensions
        void document.fonts.ready.then(() => {
          updateDimensions();
        });
      } catch (err: unknown) {
        /* empty */
      }
    }
  }, [updateDimensions]);

  // Update the dimensions when the container resizes (covers window resize,
  // sidebar toggles, lazy-loaded content, and containers becoming visible)
  useResize(tabListContainerRef, updateDimensions);

  const transitionProps = {
    transitionProperty: 'transform, width, background-color',
    transitionDuration: shouldAnimate
      ? castWebType(makeMotionTime(theme.motion.duration.gentle))
      : '0ms',
    transitionTimingFunction: castWebType(theme.motion.easing.standard),
  };

  if (variant === 'filled') {
    return (
      <StyledTabIndicator
        pointerEvents="none"
        position="absolute"
        left="0px"
        top="0px"
        borderRadius="small"
        backgroundColor="interactive.background.primary.faded"
        style={{
          ...transitionProps,
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          transform: `translate(${dimensions.x}px, ${dimensions.y}px)`,
        }}
        {...metaAttribute({ name: MetaConstants.TabIndicator })}
      />
    );
  }

  return (
    <StyledTabIndicator
      pointerEvents="none"
      position="absolute"
      left="0%"
      top="-0.5px"
      height="2px"
      backgroundColor="interactive.background.primary.default"
      style={{
        ...transitionProps,
        width: `${dimensions.width}px`,
        transform: `translate(${dimensions.x}px, ${dimensions.y}px)`,
      }}
      {...metaAttribute({ name: MetaConstants.TabIndicator })}
    />
  );
};

export { TabIndicator };
