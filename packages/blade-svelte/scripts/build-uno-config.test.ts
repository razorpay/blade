// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import { OUTFILE, bundleUnoConfig } from './build-uno-config.mjs';

describe('uno/config.js', () => {
  it('is the bundle of uno/config.ts (run `yarn build:uno-config` after editing uno/)', async () => {
    expect(readFileSync(OUTFILE, 'utf8') === (await bundleUnoConfig())).toBe(true);
  });
});
