import type { StyledProps } from '~components/Box/styled-props';

export type SvgProps = {
  children: React.ReactNode;
  fill?: string;
  height: string;
  viewBox: string;
  width: string;
} & Omit<StyledProps, 'order'>; // Order prop on SVG has different meaning so removing this prop from styled-props
