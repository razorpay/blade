import type { StyledProps } from '~utils';

export type SvgProps = {
  children: React.ReactNode;
  fill?: string;
  height: `${string}px`;
  viewBox: string;
  width: `${string}px`;
} & Omit<StyledProps, 'order'>; // Order prop on SVG has different meaning so removing this prop from styled-props
