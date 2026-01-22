export const makeTypographySize = (size: number): `${number}rem` => {
  const remValue = size / 16;
  return `${remValue}rem`;
};
