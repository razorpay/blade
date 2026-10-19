import { describe, it, expect } from 'vitest';
import { createGenerator } from 'unocss';
import { bladeNeutralTheme, bladeTheme } from '@razorpay/blade-core/tokens';
import { colorsToCSSVariables } from '@razorpay/blade-core/utils';
import defaultUnoConfig from '../../uno.config';

/**
 * Colours and faces read blade-core's token variables over their static values
 * (uno.config.ts `themed`): an app themes Blade by setting them. The snapshot is
 * the list of variables Blade reads.
 */

const neutral = colorsToCSSVariables(bladeNeutralTheme.colors.onLight);
const standard = colorsToCSSVariables(bladeTheme.colors.onLight);

/** Every class a static rule names, generated with the preflights (keyframes) */
async function bladeCSS(): Promise<string> {
  const uno = await createGenerator(defaultUnoConfig);
  const names = (defaultUnoConfig.rules ?? [])
    .map(([matcher]) => matcher)
    .filter((matcher): matcher is string => typeof matcher === 'string');
  return (await uno.generate(names.join(' '), { preflights: true })).css;
}

/** `var(--token, fallback)` pairs, the fallback up to the var's closing paren */
function tokenReads(css: string): [token: string, fallback: string][] {
  const reads: [string, string][] = [];
  for (const match of css.matchAll(/var\(--([\w-]+), /g)) {
    let depth = 1;
    let end = match.index + match[0].length;
    for (; depth > 0 && end < css.length; end++) {
      if (css[end] === '(') depth++;
      if (css[end] === ')') depth--;
    }
    reads.push([match[1], css.slice(match.index + match[0].length, end - 1)]);
  }
  return reads;
}

const isThemeToken = (token: string): boolean =>
  `--${token}` in neutral || token.startsWith('font-family-');

describe('theme variables', () => {
  it('reads a variable for every colour token with a utility, and the three faces', async () => {
    const tokens = new Set(
      tokenReads(await bladeCSS())
        .map(([token]) => token)
        .filter(isThemeToken),
    );
    const colors = [...tokens].filter((token) => !token.startsWith('font-family-')).sort();
    const faces = [...tokens].filter((token) => token.startsWith('font-family-')).sort();

    expect(faces).toEqual(['font-family-code', 'font-family-heading', 'font-family-text']);
    expect(colors).toHaveLength(285);
    expect(colors.some((token) => token.startsWith('data-'))).toBe(false);
    expect(colors).toMatchSnapshot();
  });

  it("falls back to the token's light mode value, so nothing changes until one is set", async () => {
    for (const [token, fallback] of tokenReads(await bladeCSS())) {
      if (!(`--${token}` in neutral)) continue;
      // The primary button's frame takes the standard theme's blue (`standardColor`).
      expect([neutral[`--${token}`], standard[`--${token}`]]).toContain(fallback);
    }
  });

  it('follows a variable an app sets', async () => {
    const uno = await createGenerator(defaultUnoConfig);
    const { css } = await uno.generate('bg-interactive-primary-default shadow-button-primary', {
      preflights: false,
    });
    expect(css).toContain(
      `background-color:var(--interactive-background-primary-default, ${neutral['--interactive-background-primary-default']})`,
    );
    expect(css).toContain(
      `var(--interactive-border-primary-default, ${standard['--interactive-border-primary-default']})`,
    );
  });
});
