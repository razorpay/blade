import React from 'react';
import { useTheme } from '~components/BladeProvider';
import { makeMotionTime } from '~utils/makeMotionTime';

const BOTTOM_SHEET_EASING = 'cubic-bezier(.15,0,.24,.97)';

const useBottomSheetTransitionStyle = (
  isOpen: boolean,
  isDragging: boolean,
): React.CSSProperties => {
  const { theme } = useTheme();
  return {
    transform: isOpen ? 'translateY(0px)' : 'translateY(8px)',
    transitionProperty: 'transform',
    transitionDuration: isDragging ? undefined : makeMotionTime(theme.motion.duration.moderate),
    transitionTimingFunction: BOTTOM_SHEET_EASING,
    willChange: 'transform',
  };
};

export { BOTTOM_SHEET_EASING, useBottomSheetTransitionStyle };
