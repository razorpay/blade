import typography from '../../tokens/global/typography';
import { makeTypographySize } from './';

describe('makeTypographySize', () => {
  it('should return the font-size value in `px`', () => {
    const fontSize = makeTypographySize(typography.onMobile.fonts.size[10]);
    expect(fontSize).toEqual('10px');
  });

  it('should return the line-height value in `px`', () => {
    const lineHeight = makeTypographySize(typography.onMobile.lineHeights.m);
    expect(lineHeight).toEqual('18px');
  });
});
