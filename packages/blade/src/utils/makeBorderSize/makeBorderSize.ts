function makeBorderSize<T extends number>(s: T): `${T}px`;
function makeBorderSize<T extends string>(s: T): T;
function makeBorderSize<T extends number | string>(size: T): `${T}px` | T {
  if (typeof size === 'number') {
    return `${size}px`;
  }
  return size;
}

export default makeBorderSize;
