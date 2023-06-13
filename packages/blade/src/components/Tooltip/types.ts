/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Side, UseFloatingOptions } from '@floating-ui/react';
import type { CSSProperties } from 'react';
import type { Platform } from '~utils';
import type { BaseBoxProps } from '~components/Box/BaseBox';

type TooltipProps = {
  content: string;
  placement?: Exclude<
    UseFloatingOptions['placement'],
    'left-end' | 'left-start' | 'right-end' | 'right-start'
  >;
  children: React.ReactElement;
  onOpenChange?: ({ isOpen }: { isOpen: boolean }) => void;
};

type BladeCommonEvents = {
  onBlur?: Platform.Select<{
    native: undefined | ((event: any) => void);
    web: React.FocusEventHandler;
  }>;
  onFocus?: Platform.Select<{
    native: undefined | ((event: any) => void);
    web: React.FocusEventHandler;
  }>;
  onMouseLeave?: Platform.Select<{ web: React.MouseEventHandler; native: undefined }>;
  onMouseMove?: Platform.Select<{ web: React.MouseEventHandler; native: undefined }>;
  onPointerDown?: Platform.Select<{ web: React.PointerEventHandler; native: undefined }>;
  onPointerEnter?: Platform.Select<{ web: React.PointerEventHandler; native: undefined }>;
  onTouchStart?: Platform.Select<{
    native: undefined | ((event: any) => void);
    web: React.TouchEventHandler;
  }>;
  onTouchEnd?: Platform.Select<{
    native: undefined | ((event: any) => void);
    web: React.TouchEventHandler;
  }>;
};

type TooltipContentProps = {
  children: string;
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

type TooltipContentWrapperProps = {
  styles: CSSProperties;
  side?: Side;
  isVisible?: boolean;
} & BaseBoxProps;

export { TooltipProps, BladeCommonEvents, TooltipContentProps, TooltipContentWrapperProps };
