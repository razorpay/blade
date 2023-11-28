import { makeTypographySize } from './';
import { typography } from '~tokens/global';

describe('makeTypographySize', () => {
  it('should return the font-size value in `rem`', () => {
    const fontSize = makeTypographySize(typography.onDesktop.fonts.size[25]);
    expect(fontSize).toEqual('0.5625rem');
  });

  it('should return the line-height value in `rem`', () => {
    const lineHeight = makeTypographySize(typography.onDesktop.lineHeights[200]);
    expect(lineHeight).toEqual('1.5rem');
  });
});
