import React from 'react';
import { useSegmentedControlContext } from './SegmentedControlContext';
import { itemBorderRadius } from './segmentedControlTokens';
import { castWebType, makeMotionTime, makeSpace } from '~utils';
import { useTheme } from '~components/BladeProvider';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { useResize } from '~utils/useResize';
import BaseBox from '~components/Box/BaseBox';

const SegmentedControlIndicator = ({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
}): React.ReactElement | null => {
  const { theme } = useTheme();
  const { selectedValue, size, itemRefs } = useSegmentedControlContext();
  const [shouldAnimate, setShouldAnimate] = React.useState(false);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0, x: 0, y: 0 });

  const updateDimensions = React.useCallback(() => {
    if (!selectedValue || !itemRefs) return;
    const activeItem = itemRefs.current.get(selectedValue);
    if (!activeItem || activeItem.offsetWidth === 0) return;

    setDimensions({
      width: activeItem.offsetWidth,
      height: activeItem.offsetHeight,
      x: activeItem.offsetLeft,
      y: activeItem.offsetTop,
    });
  }, [selectedValue, itemRefs]);

  useIsomorphicLayoutEffect(() => {
    if (!selectedValue) return;
    updateDimensions();
  }, [selectedValue, updateDimensions]);

  React.useEffect(() => {
    if ('fonts' in document) {
      try {
        void document.fonts.ready.then(() => {
          updateDimensions();
        });
      } catch {
        /* empty */
      }
    }
  }, [updateDimensions]);

  useResize(containerRef, updateDimensions);

  // Enable animation only after the first paint with real dimensions.
  // useEffect fires after the browser paints, guaranteeing the initial
  // position is committed before transitions are turned on.
  React.useEffect(() => {
    if (dimensions.width > 0) {
      setShouldAnimate(true);
    }
  }, [dimensions.width]);

  // Nothing to show until dimensions are measured — avoids a 0×0 flash.
  if (!dimensions.width) return null;

  const transitionProps = {
    transitionProperty: 'transform',
    transitionDuration: shouldAnimate
      ? castWebType(makeMotionTime(theme.motion.duration.moderate))
      : '0ms',
    transitionTimingFunction: castWebType(theme.motion.easing.standard),
  };

  const radiusToken = itemBorderRadius[size];
  const borderRadiusValue =
    typeof radiusToken === 'number'
      ? `${radiusToken}px`
      : makeSpace(theme.border.radius[radiusToken]);

  return (
    <BaseBox
      pointerEvents="none"
      position="absolute"
      left="0px"
      top="0px"
      backgroundColor="surface.background.gray.intense"
      style={{
        ...transitionProps,
        borderRadius: borderRadiusValue,
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        transform: `translate(${dimensions.x}px, ${dimensions.y}px)`,
      }}
    />
  );
};

export { SegmentedControlIndicator };
