export type NonDashedProps<T> = {
  [K in keyof T]: K extends `${string}-${string}` ? never : T[K];
};

export type PathProps = {
  clipPath?: string;
  clipRule?: 'evenodd' | 'nonzero';
  d: string;
  fill?: string;
  fillOpacity?: number;
  fillRule?: 'evenodd' | 'nonzero';
  stroke?: string;
  strokeLinecap?: 'butt' | 'round' | 'square';
  strokeLinejoin?: 'bevel' | 'miter' | 'round';
  strokeWidth?: string;
};
