import type { StyledProps } from '~utils';

export type SvgProps = {
  children: React.ReactNode;
  fill?: string;
  height: `${string}px`;
  viewBox: string;
  width: `${string}px`;
} & StyledProps;
