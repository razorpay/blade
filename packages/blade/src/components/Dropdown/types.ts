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
} & TestID;

export { DropdownProps, DropdownOverlayProps };
