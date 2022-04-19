import typography from '../../tokens/global/typography';
import attachTypographyUnit from './';

describe('attachTypographyUnit', () => {
  it('should return the font-size value in `px`', () => {
    const fontSize = attachTypographyUnit(typography.onMobile.fonts.size[10]);
    expect(fontSize).toEqual('10px');
  });

  it('should return the line-height value in `px`', () => {
    const lineHeight = attachTypographyUnit(typography.onMobile.lineHeights.m);
    expect(lineHeight).toEqual('16px');
  });
});
