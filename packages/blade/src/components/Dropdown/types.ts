import type React from 'react';
import type { Placement } from '@floating-ui/react';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { ContainerElementType, DataAnalyticsAttribute, TestID } from '~utils/types';
import type { BoxProps } from '~components/Box';

type DropdownProps = {
  /**
   * Control open / close state of the Dropdown component
   *
   * This can be used to close the dropdown when button in the footer of dropdown is clicked
   */
  isOpen?: boolean;
  /**
   * Callback when open state of the dropdown changes
   */
  onOpenChange?: (isOpen: boolean) => void;
  selectionType?: 'single' | 'multiple';
  children: React.ReactNode[];
  /**
   * @private
   *
   * width prop for outer relative container of Dropdown. Use width prop on DropdownOverlay to change width of menu
   */
  _width?: BoxProps['width'];
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

type DropdownOverlayProps = {
  children: React.ReactElement[] | React.ReactElement;
  /**
   * Sets the z-index of the DropdownOverlay
   *
   * @default 1001
   */
  zIndex?: number;
  /**
   * Override the default width of dropdown
   *
   * Avoid overriding width in SelectInput and AutoComplete as its expected to match the input
   */
  width?: BoxProps['width'];

  /**
   * Override the default minWidth of dropdown
   *
   * Avoid overriding minWidth in SelectInput and AutoComplete as its expected to match the input
   */
  minWidth?: BoxProps['minWidth'];

  /**
   * Override the default maxWidth of dropdown
   *
   * Avoid overriding maxWidth in SelectInput and AutoComplete as its expected to match the input
   */
  maxWidth?: BoxProps['maxWidth'];

  /**
   * Reference to the element which triggers the DropdownOverlay
   *
   * This is used to position the DropdownOverlay relative to a specific element,
   * for example in PhoneNumberInput the DropdownOverlay is positioned relative to the input element
   */
  referenceRef?: React.MutableRefObject<ContainerElementType | null>;
  /**
   * Sets the placement of the DropdownOverlay
   *
   * @default 'bottom-start'
   */
  defaultPlacement?: Placement;
} & TestID;

export type { DropdownProps, DropdownOverlayProps };
