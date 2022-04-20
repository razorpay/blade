import typography from '../../tokens/global/typography';
import makeTypography from './';

describe('makeTypography', () => {
  it('should return the font-size value in `rem`', () => {
    const fontSize = makeTypography(typography.onDesktop.fonts.size[10]);
    expect(fontSize).toEqual('0.5625rem');
  });

  it('should return the line-height value in `rem`', () => {
    const lineHeight = makeTypography(typography.onDesktop.lineHeights.m);
    expect(lineHeight).toEqual('1.125rem');
  });
});
