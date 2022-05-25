const makeSpacingSize = <T extends number>(size: T): `${T}px` => {
  return `${size}px`;
};

export default makeSpacingSize;
