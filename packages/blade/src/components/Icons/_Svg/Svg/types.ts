import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { TestID } from '~utils/types';

export type SvgProps = {
  children: React.ReactNode;
  fill?: string;
  height: string;
  viewBox: string;
  width: string;
  fillOpacity?: number;
} & TestID &
  Omit<StyledPropsBlade, 'order' | 'visibility'>; // Order prop on SVG has different meaning so removing this prop from styledProps
