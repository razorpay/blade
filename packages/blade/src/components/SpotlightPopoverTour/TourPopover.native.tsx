import React from 'react';
import { Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { PopoverContent } from '../Popover/PopoverContent';
import { PopoverContext } from '../Popover/PopoverContext';
import { transitionDelay } from './tourTokens';
import type { SpotlightPopoverTourMaskRect } from './types';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAccessible } from '~utils/makeAccessible';
import { useId } from '~utils/useId';
import type { PopoverProps } from '~components/Popover';

type TourPopoverProps = Omit<PopoverProps, 'children' | 'initialFocusRef'> & {
  attachTo: React.RefObject<unknown> | undefined;
  isTransitioning: boolean;
  targetRect?: SpotlightPopoverTourMaskRect;
};

const POPOVER_GAP = 12;
const POPOVER_MAX_WIDTH = 320;

const TourPopover = ({
  content,
  title,
  titleLeading,
  footer,
  placement = 'bottom',
  onOpenChange,
  isOpen,
  targetRect,
}: TourPopoverProps): React.ReactElement | null => {
  const { theme } = useTheme();
  const titleId = useId('tour-popover-title');
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);

  React.useEffect(() => {
    if (isOpen) {
      opacity.value = withTiming(1, { duration: transitionDelay });
      translateY.value = withTiming(0, { duration: transitionDelay });
    } else {
      opacity.value = withTiming(0, { duration: theme.motion.duration.xquick });
      translateY.value = withTiming(8, { duration: theme.motion.duration.xquick });
    }
  }, [isOpen, opacity, translateY, theme.motion.duration.xquick]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const close = React.useCallback(() => {
    onOpenChange?.({ isOpen: false });
  }, [onOpenChange]);

  const contextValue = React.useMemo(
    () => ({
      close,
      defaultInitialFocusRef: { current: null },
      titleId,
      openInteraction: 'click' as const,
    }),
    [close, titleId],
  );

  if (!isOpen || !targetRect) return null;

  // Calculate position based on placement and target rect
  const { width: windowWidth } = Dimensions.get('window');
  const side = placement.split('-')[0] || 'bottom';

  let top = 0;
  let left = 0;

  switch (side) {
    case 'bottom':
      top = targetRect.y + targetRect.height + POPOVER_GAP;
      left = targetRect.x + targetRect.width / 2 - POPOVER_MAX_WIDTH / 2;
      break;
    case 'top':
      top = targetRect.y - POPOVER_GAP;
      left = targetRect.x + targetRect.width / 2 - POPOVER_MAX_WIDTH / 2;
      break;
    case 'left':
      top = targetRect.y + targetRect.height / 2;
      left = targetRect.x - POPOVER_MAX_WIDTH - POPOVER_GAP;
      break;
    case 'right':
      top = targetRect.y + targetRect.height / 2;
      left = targetRect.x + targetRect.width + POPOVER_GAP;
      break;
  }

  // Clamp to screen bounds
  left = Math.max(8, Math.min(left, windowWidth - POPOVER_MAX_WIDTH - 8));

  return (
    <PopoverContext.Provider value={contextValue}>
      <Animated.View
        style={[
          {
            position: 'absolute',
            top,
            left,
            maxWidth: POPOVER_MAX_WIDTH,
            zIndex: 9999,
          },
          animatedStyle,
        ]}
        {...metaAttribute({ name: MetaConstants.TourPopover })}
        {...makeAccessible({ labelledBy: titleId })}
      >
        <PopoverContent title={title} titleLeading={titleLeading} footer={footer}>
          {content}
        </PopoverContent>
      </Animated.View>
    </PopoverContext.Provider>
  );
};

export { TourPopover };
