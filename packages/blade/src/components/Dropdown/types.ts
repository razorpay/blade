import type React from 'react';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { TestID } from '~utils/types';

type DropdownProps = {
  /**
   * Control open / close state of the Dropdown component
   *
   * Make sure to not misuse this prop to create custom triggers. Use DropdownButton instead for such usecases.
   * This can be used to close the dropdown when button in the footer of dropdown is clicked
   */
  isOpen?: boolean;
  /**
   * Callback when open state of the dropdown changes
   */
  onOpenChange?: (isOpen: boolean) => void;
  selectionType?: 'single' | 'multiple';
  /**
   * ## Deprecated ⚠️
   *
   * Use `onOpenChange` instead for knowing when dropdown gets dismissed.
   *
   * ### Migration
   * ```diff
   * <Dropdown
   * - onDismiss={() => console.log('dismissed')}
   * + onOpenChange={(isOpen) => {
   * +  if (!isOpen) {
   * +    console.log('dismissed');
   * +  }
   * + }}
   * />
   *
   * ```
   *
   * @deprecated
   */
  onDismiss?: () => void;
  children: React.ReactNode[];
} & TestID &
  StyledPropsBlade;

type DropdownOverlayProps = {
  children: React.ReactElement[] | React.ReactElement;
  /**
   * Sets the z-index of the DropdownOverlay
   *
   * @default 1001
   */
  zIndex?: number;
} & TestID;

export type { DropdownProps, DropdownOverlayProps };
