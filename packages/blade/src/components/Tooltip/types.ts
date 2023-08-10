/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CSSProperties } from 'react';
import type { BaseBoxProps } from '~components/Box/BaseBox';

// similar to Side from '@floating-ui/react'. Hardcoding this since importing from floating-ui/react breaks react native builds
type Side = 'top' | 'right' | 'bottom' | 'left';

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
  placement?: Side | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
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
