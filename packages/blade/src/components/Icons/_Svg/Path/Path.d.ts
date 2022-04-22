export type PathProps = {
  clipPath?: string;
  clipRule?: 'evenodd' | 'nonzero';
  d?: string;
  fill?: string;
  fillOpacity?: number | string;
  fillRule?: 'evenodd' | 'nonzero';
  height?: number;
  stroke?: string;
  strokeLinecap?: 'butt' | 'round' | 'square';
  strokeLinejoin?: 'bevel' | 'miter' | 'round';
  strokeWidth?: number | string;
  viewBox?: string;
  width?: number;
};

const Path: React.ComponentType<PathProps>;

export default Path;
