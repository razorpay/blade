import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { TestID } from '~src/_helpers/types';

type DropdownProps = {
  selectionType?: 'single' | 'multiple';
  onDismiss?: () => void;
  children: React.ReactNode[];
} & StyledPropsBlade;

type DropdownOverlayProps = {
  children: React.ReactElement[] | React.ReactElement;
} & TestID;

export { DropdownProps, DropdownOverlayProps };
