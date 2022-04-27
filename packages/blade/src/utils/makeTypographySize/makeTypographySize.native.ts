const makeTypographySize = <T extends number>(size: T): `${T}px` => {
  return `${size}px`;
};

export default makeTypographySize;
