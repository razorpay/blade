/* eslint-disable consistent-return */
import React from 'react';
import { useTabsContext } from './TabsContext';
import { castWebType, makeMotionTime, useTheme } from '~utils';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import BaseBox from '~components/Box/BaseBox';

const TabsIndicator = (): React.ReactElement => {
  const { selectedValue, baseId } = useTabsContext();
  const { theme } = useTheme();
  const [activeElementDimensions, setActiveElementDimensions] = React.useState({
    width: 0,
    x: 0,
  });
  const [hasMeasured, setHasMeasured] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    if (!selectedValue) return;
    // Set the initial active element dimensions
    const tabItemId = `${baseId}-${selectedValue}-tabitem`;
    const activeTabItem = document.getElementById(tabItemId);
    if (!activeTabItem) return;

    setActiveElementDimensions({
      width: activeTabItem.offsetWidth,
      x: activeTabItem.offsetLeft,
    });

    const id = requestAnimationFrame(() => {
      setHasMeasured(true);
    });

    return () => {
      if (id) {
        cancelAnimationFrame(id);
      }
    };
  }, [baseId, selectedValue]);

  return (
    <BaseBox
      position="absolute"
      left="spacing.0"
      borderBottomWidth="thick"
      style={{
        transitionProperty: 'transform, width',
        transitionDuration: hasMeasured
          ? castWebType(makeMotionTime(theme.motion.duration.gentle))
          : '0ms',
        transitionTimingFunction: castWebType(theme.motion.easing.standard.effective),
        borderBottomColor: theme.colors.brand.primary[500],
        width: `${activeElementDimensions.width}px`,
        transform: `translate(${activeElementDimensions.x}px, -1.5px)`,
      }}
    />
  );
};

export { TabsIndicator };
