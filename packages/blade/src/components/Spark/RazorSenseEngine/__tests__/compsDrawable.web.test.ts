/* eslint-disable @typescript-eslint/no-var-requires */
// The engine leaves out what no comp uses (its build, scripts/razorsenseEngine/buildFreshEngine.js, the bundle review): the effects
// stack (fx), refraction (rOn) and the studio's debug views. A comp exported again from the studio with one of them on would draw
// without it, with no error anywhere: this fails first, for every comp under Spark (found by name, so new ones are checked too).
import fs from 'fs';
import path from 'path';

const SPARK = path.join(__dirname, '..', '..');

const compFiles = (dir: string): string[] =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) =>
      entry.isDirectory()
        ? entry.name === '__tests__'
          ? []
          : compFiles(path.join(dir, entry.name))
        : /comps\.ts$/i.test(entry.name)
        ? [path.join(dir, entry.name)]
        : [],
    );

/** what in `value` the engine no longer draws: an effect switched on in a layer's list, or refraction */
const cutFeatures = (value: unknown): string[] => {
  if (!value || typeof value !== 'object') return [];
  const found: string[] = [];
  const { fx, rOn } = value as { fx?: unknown; rOn?: unknown };
  if (Array.isArray(fx) && fx.some((effect) => (effect as { on?: unknown } | null)?.on))
    found.push('an effect (fx)');
  if (rOn) found.push('refraction (rOn)');
  return found.concat(Object.values(value).flatMap(cutFeatures));
};

describe('RazorSense comps', () => {
  const files = compFiles(SPARK).map((file) => path.relative(SPARK, file));

  it('are found', () => {
    expect(files).toEqual(
      expect.arrayContaining([
        'RazorSenseChat/comps.ts',
        'RazorSenseChatBackground/comps.ts',
        'RazorSenseLoader/comps.ts',
      ]),
    );
  });

  it.each(files)('%s uses only what the engine draws', (file) => {
    const comps: Record<string, unknown> = require(path.join(SPARK, file));
    expect(Object.keys(comps).length).toBeGreaterThan(0);
    Object.entries(comps).forEach(([name, comp]) =>
      expect({ [name]: cutFeatures(comp) }).toEqual({ [name]: [] }),
    );
  });

  it('sees an effect or refraction turned on', () => {
    expect(
      cutFeatures({ layers: [{ p: { fx: [{ t: 'fractal', on: true }], rOn: false } }] }),
    ).toEqual(['an effect (fx)']);
    expect(
      cutFeatures({ layers: [{ p: { fx: [{ t: 'fractal', on: false }], rOn: true } }] }),
    ).toEqual(['refraction (rOn)']);
  });
});

export {};
