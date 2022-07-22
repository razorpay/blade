export type MakeSize<T extends number> = `${T}px`;

export const makeSize = <T extends number>(size: T): `${T}px` => {
  return `${size}px`;
};
