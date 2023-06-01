import type { GestureResponderEvent } from 'react-native';
import type { Platform } from '~utils';

type TooltipTriggerProps = {
  onBlur?: Platform.Select<{
    native: (event: GestureResponderEvent) => void;
    web: React.FocusEventHandler;
  }>;
  onFocus?: Platform.Select<{
    native: (event: GestureResponderEvent) => void;
    web: React.FocusEventHandler;
  }>;
  onMouseLeave?: React.MouseEventHandler;
  onMouseMove?: React.MouseEventHandler;
  onPointerDown?: React.PointerEventHandler;
  onPointerEnter?: React.PointerEventHandler;
  onTouchStart?: React.TouchEventHandler;
  onTouchEnd?: React.TouchEventHandler;
};

export { TooltipTriggerProps };
