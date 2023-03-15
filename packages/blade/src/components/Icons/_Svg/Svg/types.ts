import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { TestID } from '~src/_helpers/types';

export type SvgProps = {
  children: React.ReactNode;
  fill?: string;
  height: string;
  viewBox: string;
  width: string;
} & TestID &
  Omit<StyledPropsBlade, 'order'>; // Order prop on SVG has different meaning so removing this prop from styledProps
