import { describe, it, expect } from 'vitest';
import {
  applyRules,
  compileRules,
  isFormatRules,
  patternFormat,
  serializeSpec,
  validateRules,
  type FormatRule,
  type FormatSpec,
} from './format';
// A copy of the checkout's `native/specs/format-spec-fixtures.json`, shared
// there with the Kotlin suite (InputFormattingTest): both sides must produce
// these exact outputs or native/web formatting diverges.
import fixtures from './format-spec-fixtures.json';

type Fixture = {
  name: string;
  spec: { p: FormatRule[]; f: FormatRule[] };
  cases: { input: string; format: string; parse: string }[];
};

// Digits only, grouped in fours: the shape every card-like spec takes.
const digitGroups: FormatSpec = {
  parse: [['\\D', 'g', '']],
  format: [
    ['\\D', 'g', ''],
    ['(\\d{4})(?=\\d)', 'g', '$1 '],
  ],
};

describe('formatSpec shared fixtures (JS side)', () => {
  for (const fixture of fixtures as Fixture[]) {
    it(`matches every ${fixture.name} case`, () => {
      for (const c of fixture.cases) {
        expect(applyRules(fixture.spec.f, c.input)).toBe(c.format);
        expect(applyRules(fixture.spec.p, c.input)).toBe(c.parse);
      }
    });
  }
});

describe('runner + guards', () => {
  it('folds rules left to right', () => {
    expect(applyRules(digitGroups.format, '4111-1111 1111')).toBe(
      '4111 1111 1111'
    );
    expect(compileRules(digitGroups.parse)('4111 1111')).toBe('41111111');
  });

  it('null/undefined fold as empty string', () => {
    expect(applyRules(digitGroups.format, null)).toBe('');
    expect(applyRules(digitGroups.format, undefined)).toBe('');
    expect(compileRules(digitGroups.parse)(undefined)).toBe('');
  });

  it('isFormatRules distinguishes rule lists from functions', () => {
    expect(isFormatRules(digitGroups.format)).toBe(true);
    expect(isFormatRules([])).toBe(true);
    expect(isFormatRules((v: string) => v)).toBe(false);
    expect(isFormatRules('x')).toBe(false);
  });

  it('serializeSpec emits the short-key wire form', () => {
    expect(JSON.parse(serializeSpec(digitGroups))).toEqual({
      p: digitGroups.parse,
      f: digitGroups.format,
    });
  });

  it('validateRules rejects syntax outside the JS↔native subset', () => {
    expect(validateRules([['(?<=a)b', 'g', '']])).toMatch(/subset/);
    expect(validateRules([['(?<name>a)', '', '$1']])).toMatch(/subset/);
    expect(validateRules([['(a)\\1', 'g', '']])).toMatch(/subset/);
    expect(validateRules([['\\p{L}', 'g', '']])).toMatch(/subset/);
    expect(validateRules([['a', 'gi' as 'g', '']])).toMatch(/flags/);
    expect(validateRules([['a', 'g', '$&']])).toMatch(/\$1/);
    expect(validateRules([['[', 'g', '']])).toMatch(/compile/);
    expect(validateRules(digitGroups.format)).toBeNull();
  });
});

describe('patternFormat', () => {
  const run = (pattern: string, input: string) => {
    const spec = patternFormat(pattern);
    return applyRules(spec.format, applyRules(spec.parse, input));
  };

  it('places the literals as the digits reach them', () => {
    expect(run('#### #### #### ####', '4111')).toBe('4111');
    expect(run('#### #### #### ####', '41111')).toBe('4111 1');
    expect(run('#### #### #### ####', '4111111111111111')).toBe(
      '4111 1111 1111 1111'
    );
    expect(run('#### ###### #####', '378282246310005')).toBe(
      '3782 822463 10005'
    );
    expect(run('## / ##', '1')).toBe('1');
    expect(run('## / ##', '123')).toBe('12 / 3');
  });

  it('keeps digits only, one per slot', () => {
    expect(run('## / ##', '12/345')).toBe('12 / 34');
    expect(applyRules(patternFormat('## / ##').parse, '1a2 / 3')).toBe('123');
  });

  it('stays inside the JS–native rule subset and keeps its identity', () => {
    const spec = patternFormat('#### #### ####');
    expect(validateRules([...spec.parse, ...spec.format])).toBeNull();
    expect(patternFormat('#### #### ####')).toBe(spec);
  });
});
