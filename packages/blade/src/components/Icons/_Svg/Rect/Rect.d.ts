import type { ComponentType } from 'react';

export type RectProps = {
  width: string;
  height: string;
  rx?: string;
  ry?: string;
  x?: string;
  y?: string;
};

const Rect: ComponentType<RectProps>;

export default Rect;
