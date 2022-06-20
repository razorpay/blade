const makeSize = <T extends number>(size: T): `${T}px` => {
  return `${size}px`;
};

export default makeSize;
