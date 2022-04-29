import type { ReactElement, ComponentType } from 'react';

export type GProps = {
  children: ReactElement | ReactElement[];
  clipPath?: string;
  fill?: string;
};

const G: ComponentType<GProps>;

export default G;
