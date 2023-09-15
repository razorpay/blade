import React, { SetStateAction } from 'react';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { TestID } from '~utils/types';

type DropdownProps = {
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<SetStateAction<boolean>>;
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
