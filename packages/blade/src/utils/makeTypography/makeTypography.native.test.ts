import typography from '../../tokens/global/typography';
import makeTypography from './';

describe('makeTypography', () => {
  it('should return the font-size value in `px`', () => {
    const fontSize = makeTypography(typography.onMobile.fonts.size[10]);
    expect(fontSize).toEqual('10px');
  });

  it('should return the line-height value in `px`', () => {
    const lineHeight = makeTypography(typography.onMobile.lineHeights.m);
    expect(lineHeight).toEqual('16px');
  });
});
