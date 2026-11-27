// The thinking label's shine used tinycolor2's mix: the small mix that replaced it gives the same colour, to within 1 of 255 a
// channel, for every Blade theme's text colours (and a custom brand's), in light and dark.
import tinycolor from 'tinycolor2';
import { mixColors } from '../mixColors';
import { bladeNeutralTheme, bladeTheme, createTheme } from '~tokens/theme';

const SHINE_LIFT = { light: 78, dark: 72 } as const;

const channels = (color: tinycolor.Instance): number[] => {
  const { r, g, b } = color.toRgb();
  // (its own alpha: toRgb's is rounded to 2 places)
  return [r, g, b, color.getAlpha()];
};

const expectSameColor = (ours: string, theirs: tinycolor.Instance): void => {
  const [mine, wanted] = [channels(tinycolor(ours)), channels(theirs)];
  mine.slice(0, 3).forEach((v, i) => expect(Math.abs(v - wanted[i])).toBeLessThanOrEqual(1));
  expect(mine[3]).toBeCloseTo(wanted[3], 2);
};

const themes = {
  bladeTheme,
  bladeNeutralTheme,
  customBrand: createTheme({ brandColor: '#83003D' }).theme,
};

describe('mixColors', () => {
  describe.each(Object.entries(themes))('%s', (_, theme) => {
    it.each([
      ['light', 'onLight'],
      ['dark', 'onDark'],
    ] as const)('mixes the %s shine as tinycolor2 did', (mode, scheme) => {
      const text = theme.colors[scheme].surface.text;
      const [base, white] = [text.primary.normal, text.staticWhite.normal];
      const theirs = tinycolor.mix(base, white, SHINE_LIFT[mode]);
      const ours = mixColors(base, white, SHINE_LIFT[mode]);
      expect(ours).toMatch(/^rgba\(\d+, \d+, \d+, [\d.]+\)$/);
      expectSameColor(ours, theirs);
      // (the label drew tinycolor2's mix as hex, without its alpha: the tokens are opaque, so nothing changes)
      expect(theirs.getAlpha()).toBe(1);
    });
  });

  it.each([
    ['hsla(217, 56%, 17%, 1)', 'hsla(0, 0%, 100%, 1)', 50],
    ['hsl(340, 100%, 26%)', '#fff', 30],
    ['rgb(10, 20, 30)', 'rgba(250, 240, 230, 0.5)', 25],
    ['#83003D', '#00ff00', 100],
    ['#83003d', '#000', 0],
  ])('reads %s and %s', (from, to, percent) => {
    expectSameColor(mixColors(from, to, percent), tinycolor.mix(from, to, percent));
  });

  it('gives the first colour back for a colour it cannot read', () => {
    expect(mixColors('var(--text)', '#fff', 50)).toBe('var(--text)');
    expect(mixColors('#123', 'currentColor', 50)).toBe('#123');
  });
});
