// https://github.com/microsoft/TypeScript/issues/12936#issuecomment-368244671
export type Exact<T, X extends T> = T &
  {
    [K in keyof X]: K extends keyof T ? X[K] : never;
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

export { default } from './Path.web';
