export function makeBorderSize<T extends number>(size: T): `${T}px`;
export function makeBorderSize<T extends string>(size: T): T;
export function makeBorderSize<T extends number | string>(size: T): `${T}px` | T {
  if (typeof size === 'number') {
    return `${size}px`;
  }
  return size;
}
