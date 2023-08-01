/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Side, UseFloatingOptions } from '@floating-ui/react';
import type { CSSProperties } from 'react';
import type { BaseBoxProps } from '~components/Box/BaseBox';

type TooltipProps = {
  /**
   * Tooltip content
   */
  content: string;
  /**
   * Placement of tooltip
   *
   * @default "top"
   */
  placement?: Exclude<
    UseFloatingOptions['placement'],
    'left-end' | 'left-start' | 'right-end' | 'right-start'
  >;
  children: React.ReactElement;
  onOpenChange?: ({ isOpen }: { isOpen: boolean }) => void;
  /**
   * Sets the z-index of the modal
   * @default 1100
   */
  zIndex?: number;
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

export { TooltipProps, TooltipContentProps, TooltipContentWrapperProps };
