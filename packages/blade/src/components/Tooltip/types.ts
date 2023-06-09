/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Side, UseFloatingOptions } from '@floating-ui/react';
import type { GestureResponderEvent, NativeSyntheticEvent } from 'react-native';
import type { CSSProperties } from 'react';
import type { Platform } from '~utils';

type TooltipProps = {
  content: string;
  placement?: Exclude<
    UseFloatingOptions['placement'],
    'left-end' | 'left-start' | 'right-end' | 'right-start'
  >;
  children: React.ReactElement;
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

type TooltipContentProps = {
  children: React.ReactNode;
  style: CSSProperties;
  arrow: React.ReactNode;
  /**
   * react-native only
   */
  isVisible?: boolean;
  /**
   * react-native only
   */
  side?: Side;
};

export { TooltipProps, TooltipTriggerProps, TooltipContentProps };
