import typography from '../../tokens/global/typography';
import { makeTypographySize } from './';

describe('makeTypographySize', () => {
  it('should return the font-size value in `px`', () => {
    const fontSize = makeTypographySize(typography.onMobile.fonts.size[10]);
    expect(fontSize).toEqual('9px');
  });

  it('should return the line-height value in `px`', () => {
    const lineHeight = makeTypographySize(typography.onMobile.lineHeights[200]);
    expect(lineHeight).toEqual('20px');
  });
});
