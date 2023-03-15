import typography from '../../tokens/global/typography';
import { makeTypographySize } from './';

describe('makeTypographySize', () => {
  it('should return the font-size value in `rem`', () => {
    const fontSize = makeTypographySize(typography.onDesktop.fonts.size[10]);
    expect(fontSize).toEqual('0.5625rem');
  });

  it('should return the line-height value in `rem`', () => {
    const lineHeight = makeTypographySize(typography.onDesktop.lineHeights.m);
    expect(lineHeight).toEqual('1.5rem');
  });
});
