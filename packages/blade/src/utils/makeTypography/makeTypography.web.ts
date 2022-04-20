const makeTypography = (fontSize: number): `${number}rem` => {
  const remValue = fontSize / 16;
  return `${remValue}rem`;
};

export default makeTypography;
