import type { ComponentType } from 'react';

export type SvgProps = {
  children: React.ReactNode;
  fill?: string;
  height: string;
  viewBox: string;
  width: string;
};

const Svg: ComponentType<SvgProps>;

export default Svg;
