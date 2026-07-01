import React from 'react';
import { useSegmentedControlContext } from './SegmentedControlContext';
import { itemBorderRadius } from './segmentedControlTokens';
import { castWebType, makeMotionTime, makeSpace } from '~utils';
import { useTheme } from '~components/BladeProvider';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { useResize } from '~utils/useResize';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

const SegmentedControlIndicator = ({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
}): React.ReactElement => {
  const { theme } = useTheme();
  const { selectedValue, size, isDisabled, itemRefs } = useSegmentedControlContext();
  const [shouldAnimate, setShouldAnimate] = React.useState(false);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0, x: 0, y: 0 });
  const hasInitializedRef = React.useRef(false);

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

    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      requestAnimationFrame(() => setShouldAnimate(true));
    }
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

  const transitionProps = {
    transitionProperty: 'transform, width, height',
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
        boxShadow: isDisabled ? 'none' : castWebType(theme.elevation.lowRaised),
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        transform: `translate(${dimensions.x}px, ${dimensions.y}px)`,
      }}
      {...metaAttribute({ name: MetaConstants.SegmentedControlIndicator })}
    />
  );
};

export { SegmentedControlIndicator };
