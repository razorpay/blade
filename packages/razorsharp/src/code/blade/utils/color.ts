const convertRGBToHex = (rgb: RGB): string => {
  const { r, g, b } = rgb;
  // eslint-disable-next-line no-bitwise
  const hex = ((r << 16) | (g << 8) | b).toString(16);
  return hex.padStart(6, '0');
};

export const convertRGBDecimalToHex = (rgb: RGB): string => {
  const { r, g, b } = rgb;
  const hex = convertRGBToHex({
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  });
  return hex;
};

export const convertStyleNameToBladeName = (styleName: string): string => {
  return styleName
    .split('/')
    .map((tokenPart) => tokenPart.toLowerCase())
    .join('.');
};

export const isBackgroundColorToken = (bladeToken: string): boolean => {
  return bladeToken.includes('surface.background');
};

export const isIconColorToken = (bladeToken: string): boolean => {
  return bladeToken.includes('action.icon') || bladeToken.includes('feedback.icon');
};
