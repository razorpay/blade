import type { StyledPropsBlade } from '~components/Box/styled-props';

export type SvgProps = {
  children: React.ReactNode;
  fill?: string;
  height: string;
  viewBox: string;
  width: string;
} & Omit<StyledPropsBlade, 'order'>; // Order prop on SVG has different meaning so removing this prop from styled-props
