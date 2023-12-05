import { makeTypographySize } from './';
import { typography } from '~tokens/global';

describe('makeTypographySize', () => {
  it('should return the font-size value in `px`', () => {
    const fontSize = makeTypographySize(typography.onMobile.fonts.size[25]);
    expect(fontSize).toEqual('10px');
  });

  it('should return the line-height value in `px`', () => {
    const lineHeight = makeTypographySize(typography.onMobile.lineHeights[200]);
    expect(lineHeight).toEqual('24px');
  });
});
