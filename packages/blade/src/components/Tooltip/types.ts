/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UseFloatingOptions } from '@floating-ui/react';
import type { GestureResponderEvent, NativeSyntheticEvent } from 'react-native';
import type { Platform } from '~utils';

type TooltipProps = {
  content: string;
  placement?: Exclude<
    UseFloatingOptions['placement'],
    'left-end' | 'left-start' | 'right-end' | 'right-start'
  >;
  children: React.ReactElement;
  shouldWrapChildren?: boolean;
  onOpenChange?: ({ isOpen }: { isOpen: boolean }) => void;
};

type TooltipTriggerProps = {
  onBlur?: Platform.Select<{
    native: (event: NativeSyntheticEvent<any>) => void;
    web: React.FocusEventHandler;
  }>;
  onFocus?: Platform.Select<{
    native: (event: NativeSyntheticEvent<any>) => void;
    web: React.FocusEventHandler;
  }>;
  onMouseLeave?: React.MouseEventHandler;
  onMouseMove?: React.MouseEventHandler;
  onPointerDown?: React.PointerEventHandler;
  onPointerEnter?: React.PointerEventHandler;
  onTouchStart?: Platform.Select<{
    native: (event: GestureResponderEvent) => void;
    web: React.TouchEventHandler;
  }>;
  onTouchEnd?: Platform.Select<{
    native: (event: GestureResponderEvent) => void;
    web: React.TouchEventHandler;
  }>;
};

export { TooltipProps, TooltipTriggerProps };
