import type { ReactElement } from 'react';

export type GProps = {
  children: React.ReactElement | ReactElement[];
  clipPath?: string;
  fill?: string;
};

const G: React.ComponentType<GProps>;

export default G;
