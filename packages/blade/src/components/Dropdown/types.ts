import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { TestID } from '~utils/types';

type DropdownProps = {
  selectionType?: 'single' | 'multiple';
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
