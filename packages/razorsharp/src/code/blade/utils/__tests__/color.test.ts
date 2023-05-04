import { convertRGBDecimalToHex } from '../color';

const convertRGBDecimalToHEXtable = [
  {
    rgb: {
      r: 0.5,
      g: 0.5,
      b: 0.5,
    },
    expected: '808080',
  },
  {
    rgb: {
      r: 0.06666667014360428,
      g: 0.09019608050584793,
      b: 0.2235294133424759,
    },
    expected: '111739',
  },
  {
    rgb: {
      r: 0,
      g: 0,
      b: 0,
    },
    expected: '000000',
  },
  {
    rgb: {
      r: 1,
      g: 1,
      b: 1,
    },
    expected: 'ffffff',
  },
];

describe('convertRGBDecimalToHEX', () => {
  test.each(convertRGBDecimalToHEXtable)('should generate HEX correctly', ({ rgb, expected }) => {
    const hex = convertRGBDecimalToHex(rgb);
    expect(hex).toBe(expected);
  });
});
