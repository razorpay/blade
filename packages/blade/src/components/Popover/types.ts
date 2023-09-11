/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Side, UseFloatingOptions } from '@floating-ui/react';
import type { CSSProperties } from 'react';
import type React from 'react';
import type { GestureResponderEvent } from 'react-native';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import type { Platform } from '~utils';

type PopoverProps = {
  title?: string;
  titleLeading?: React.ReactNode;
  footer?: React.ReactNode;
  /**
   * Popover content
   */
  content: React.ReactElement;
  /**
   * Placement of Popover
   *
   * @default "top"
   */
  placement?: UseFloatingOptions['placement'];
  children: React.ReactElement;
  isOpen?: boolean;
  defaultIsOpen?: boolean;
  onOpenChange?: ({ isOpen }: { isOpen: boolean }) => void;
  /**
   * Sets the z-index of the modal
   * @default 1100
   */
  zIndex?: number;
  initialFocusRef?: React.RefObject<any>;
};

type PopoverContentProps = {
  title?: string;
  titleLeading?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  style: CSSProperties;
  arrow: React.ReactNode;
  zIndex?: number;
  /**
   * react-native only
   */
  isVisible?: boolean;
  /**
   * react-native only
   */
  side?: Side;
};

type PopoverContentWrapperProps = {
  styles: CSSProperties;
  side?: Side;
  isVisible?: boolean;
} & BaseBoxProps;

/**
 * PopoverTriggerProps
 *
 * This can be useful when working with Custom Trigger Components
 */
type PopoverTriggerProps = {
  onMouseDown?: Platform.Select<{ web: React.MouseEventHandler; native: undefined }>;
  onPointerDown?: Platform.Select<{ web: React.PointerEventHandler; native: undefined }>;
  onKeyDown?: Platform.Select<{ web: React.KeyboardEventHandler; native: undefined }>;
  onKeyUp?: Platform.Select<{ web: React.KeyboardEventHandler; native: undefined }>;
  onClick?: Platform.Select<{ web: React.MouseEventHandler; native: undefined }>;
  onTouchEnd?: Platform.Select<{
    web: React.TouchEventHandler;
    native: (event: GestureResponderEvent) => void;
  }>;
};

export { PopoverProps, PopoverContentProps, PopoverContentWrapperProps, PopoverTriggerProps };
