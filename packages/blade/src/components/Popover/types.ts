/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Side, UseFloatingOptions } from '@floating-ui/react';
import type { CSSProperties } from 'react';
import type React from 'react';
import type { GestureResponderEvent } from 'react-native';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import type { Platform } from '~utils';
import type { DataAnalyticsAttribute } from '~utils/types';

type PopoverProps = {
  /**
   * Popover title
   */
  title?: string;
  /**
   * Leading content placed before the title
   *
   * Can be any blade icon or asset.
   */
  titleLeading?: React.ReactNode;
  /**
   * Footer content
   */
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
  /**
   * Popover trigger
   */
  children: React.ReactElement;
  /**
   * Open state of Popover
   * If set to true makes the popover controlled
   */
  isOpen?: boolean;
  /**
   * Uncontrolled state of the popover
   */
  defaultIsOpen?: boolean;
  /**
   * Called when popover open state is changed, this can be used to detect when popover opens or closed
   */
  onOpenChange?: ({ isOpen }: { isOpen: boolean }) => void;
  /**
   * Sets the z-index of the Popover
   * @default 1000
   */
  zIndex?: number;
  /**
   * The ref of the element that should receive focus when the popover opens.
   *
   * @default PopoverCloseButton
   */
  initialFocusRef?: React.RefObject<any>;
} & DataAnalyticsAttribute;

type PopoverContentProps = {
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
} & Pick<PopoverProps, 'title' | 'titleLeading' | 'footer' | 'children'>;

type PopoverContentWrapperProps = {
  styles: CSSProperties;
  side?: Side;
  isVisible?: boolean;
  isMobile: boolean;
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

export type { PopoverProps, PopoverContentProps, PopoverContentWrapperProps, PopoverTriggerProps };
