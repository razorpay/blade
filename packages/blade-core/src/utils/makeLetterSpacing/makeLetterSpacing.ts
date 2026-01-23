export const makeLetterSpacing = (letterSpacing: number, fontSize: number): `${number}px` => {
  // Calculating a px letter-spacing from % letter spacing
  return `${fontSize * (letterSpacing / 100)}px`;
};
