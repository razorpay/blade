/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable consistent-return */
import React from 'react';
import styled from 'styled-components';
import { useTabsContext } from './TabsContext';
import { useTheme } from '~components/BladeProvider';
import { castWebType, makeMotionTime } from '~utils';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

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
  const [hasMeasured, setHasMeasured] = React.useState(false);
  const [activeElementDimensions, setActiveElementDimensions] = React.useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  // Update the dimensions of the active element
  const updateDimensions = React.useCallback(() => {
    const tabItemId = `${baseId}-${selectedValue}-tabitem`;
    const activeTabItem = document.getElementById(tabItemId);
    if (!activeTabItem) return;

    setActiveElementDimensions({
      width: activeTabItem.offsetWidth,
      height: activeTabItem.offsetHeight,
      x: activeTabItem.offsetLeft,
      y:
        variant === 'filled'
          ? // on filled variant the indicator is positioned on top of the tab item
            // so no need to add offsetHeight
            activeTabItem.offsetTop
          : activeTabItem.offsetTop + activeTabItem.offsetHeight - 1.5,
    });
  }, [baseId, selectedValue, tabListContainerRef, variant]);

  // Update the dimensions when the selected value changes
  useIsomorphicLayoutEffect(() => {
    if (!selectedValue) return;

    updateDimensions();

    const id = requestAnimationFrame(() => {
      setHasMeasured(true);
    });

    return () => {
      if (id) {
        cancelAnimationFrame(id);
      }
    };
  }, [baseId, selectedValue]);

  // Update the dimensions when the window resizes or when the font loads
  React.useEffect(() => {
    if (!tabListContainerRef.current) return;

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

    window.addEventListener('resize', updateDimensions);

    return () => {
      if (!tabListContainerRef.current) return;
      window.removeEventListener('resize', updateDimensions);
    };
  }, [tabListContainerRef, updateDimensions]);

  const transitionProps = {
    transitionProperty: 'transform, width, background-color',
    transitionDuration: hasMeasured
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
          width: `${activeElementDimensions.width}px`,
          height: `${activeElementDimensions.height}px`,
          transform: `translate(${activeElementDimensions.x}px, ${activeElementDimensions.y}px)`,
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
        width: `${activeElementDimensions.width}px`,
        transform: `translate(${activeElementDimensions.x}px, ${activeElementDimensions.y}px)`,
      }}
      {...metaAttribute({ name: MetaConstants.TabIndicator })}
    />
  );
};

export { TabIndicator };
