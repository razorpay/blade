/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Side, UseFloatingOptions } from '@floating-ui/react';
import type { CSSProperties } from 'react';
import type React from 'react';
import type { BaseBoxProps } from '~components/Box/BaseBox';

type PopoverProps = {
  headerTitle?: string;
  headerLeading?: React.ReactNode;
  footerContent?: React.ReactNode;
  /**
   * Popover content
   */
  content: React.ReactNode;
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
  headerTitle?: string;
  headerLeading?: React.ReactNode;
  footerContent?: React.ReactNode;
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

type PopoverContentWrapperProps = {
  styles: CSSProperties;
  side?: Side;
  isVisible?: boolean;
} & BaseBoxProps;

export { PopoverProps, PopoverContentProps, PopoverContentWrapperProps };
