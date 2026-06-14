import React from 'react';
import styled from 'styled-components';
import { useSegmentedControlContext } from './SegmentedControlContext';
import { indicatorBackgroundColor, indicatorBorderRadius } from './segmentedControlTokens';
import { castWebType, makeMotionTime } from '~utils';
import { useTheme } from '~components/BladeProvider';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { useResize } from '~utils/useResize';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

const StyledIndicator = styled(BaseBox)(({ theme }) => {
  return {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.colors.interactive.background.primary.fadedHighlighted,
    },
  };
});

const SegmentedControlIndicator = ({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
}): React.ReactElement => {
  const { theme } = useTheme();
  const { selectedValue, baseId } = useSegmentedControlContext();
  const [shouldAnimate, setShouldAnimate] = React.useState(false);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0, x: 0, y: 0 });

  const updateDimensions = React.useCallback(() => {
    const activeItem = document.getElementById(`${baseId}-${selectedValue}-item`);
    if (!activeItem || activeItem.offsetWidth === 0) return;

    setDimensions({
      width: activeItem.offsetWidth,
      height: activeItem.offsetHeight,
      x: activeItem.offsetLeft,
      y: activeItem.offsetTop,
    });

    setShouldAnimate((prev) => {
      if (!prev) requestAnimationFrame(() => setShouldAnimate(true));
      return prev;
    });
  }, [baseId, selectedValue]);

  useIsomorphicLayoutEffect(() => {
    if (!selectedValue) return;
    updateDimensions();
  }, [baseId, selectedValue, updateDimensions]);

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
    transitionProperty: 'transform, width, height, background-color',
    transitionDuration: shouldAnimate
      ? castWebType(makeMotionTime(theme.motion.duration.moderate))
      : '0ms',
    transitionTimingFunction: castWebType(theme.motion.easing.standard),
  };

  return (
    <StyledIndicator
      pointerEvents="none"
      position="absolute"
      left="0px"
      top="0px"
      borderRadius={indicatorBorderRadius}
      backgroundColor={indicatorBackgroundColor}
      style={{
        ...transitionProps,
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        transform: `translate(${dimensions.x}px, ${dimensions.y}px)`,
      }}
      {...metaAttribute({ name: MetaConstants.SegmentedControlIndicator })}
    />
  );
};

export { SegmentedControlIndicator };
