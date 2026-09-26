// @vitest-environment jsdom
// The "matches the browser validity flags" block cross-checks the model's
// constraint evaluation against real DOM inputs; everything else is Node-pure.
import { describe, it, expect } from 'vitest';
import { evaluateConstraints } from './constraints';
import type { FieldConstraints, FieldRecord } from './types';

const EMAIL_PATTERN =
  '^[a-zA-Z0-9]+([._%+\\-][a-zA-Z0-9]+)*@([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*)(\\.([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*))+$';

function text(
  value: unknown,
  constraints: Partial<FieldConstraints>,
  display?: () => string
): FieldRecord {
  return {
    name: 'f',
    value,
    constraints: { kind: 'text', ...constraints },
    getDisplayValue: display,
  };
}

describe('evaluateConstraints', () => {
  it('reports nothing without constraints', () => {
    expect(evaluateConstraints({ name: 'f', value: '' })).toBeNull();
  });

  it('required: text fails only on the empty string, whitespace counts as filled', () => {
    expect(evaluateConstraints(text('', { required: true }))).toBe('required');
    expect(evaluateConstraints(text(null, { required: true }))).toBe(
      'required'
    );
    expect(evaluateConstraints(text(' ', { required: true }))).toBeNull();
    expect(evaluateConstraints(text(0, { required: true }))).toBeNull();
  });

  it('required: a checkbox fails when unchecked, a radio group when nothing is selected', () => {
    const checkbox = (value: unknown): FieldRecord => ({
      name: 'c',
      value,
      constraints: { kind: 'checkbox', required: true },
    });
    const radio = (value: unknown): FieldRecord => ({
      name: 'r',
      value,
      constraints: { kind: 'radio', required: true },
    });
    expect(evaluateConstraints(checkbox(false))).toBe('required');
    expect(evaluateConstraints(checkbox(true))).toBeNull();
    expect(evaluateConstraints(radio(null))).toBe('required');
    expect(evaluateConstraints(radio({ id: 'hdfc' }))).toBeNull();
    expect(evaluateConstraints(radio(0))).toBeNull();
    expect(evaluateConstraints(radio([]))).toBe('required');
    expect(evaluateConstraints(radio(['hdfc']))).toBeNull();
  });

  it('pattern and email apply to the displayed string, not the raw value', () => {
    const digits = { pattern: '\\d{4} \\d{4}' };
    expect(
      evaluateConstraints(text('41111111', digits, () => '4111 1111'))
    ).toBeNull();
    expect(evaluateConstraints(text('41111111', digits))).toBe('pattern');
  });

  it('pattern and email are skipped for an empty value', () => {
    expect(evaluateConstraints(text('', { pattern: '\\d+' }))).toBeNull();
    expect(evaluateConstraints(text('', { email: true }))).toBeNull();
  });

  it('required wins over email, email over pattern', () => {
    expect(
      evaluateConstraints(
        text('', { required: true, email: true, pattern: 'x' })
      )
    ).toBe('required');
    expect(
      evaluateConstraints(text('nope', { email: true, pattern: 'x' }))
    ).toBe('email');
  });

  it('ignores a pattern that does not compile, like browsers do', () => {
    expect(evaluateConstraints(text('abc', { pattern: '[' }))).toBeNull();
  });

  describe('matches the browser validity flags', () => {
    const patterns = [
      EMAIL_PATTERN,
      '[0-9]',
      '\\d{6}',
      '[A-Z]{4}0[A-Z0-9]{6}',
      '[a-zA-Z ]+',
      '^\\d{5}(-\\d{4})?$',
    ];
    const samples = [
      'abc',
      'a@b.co',
      'not-an-email@',
      '1',
      '123456',
      '12',
      'SBIN0001234',
      'John Doe',
      'ünï',
      '12345-6789',
    ];

    for (const pattern of patterns) {
      it(`pattern ${pattern}`, () => {
        for (const sample of samples) {
          const input = document.createElement('input');
          input.setAttribute('pattern', pattern);
          input.value = sample;
          expect(
            evaluateConstraints(text(sample, { pattern })) === 'pattern',
            `${pattern} vs ${sample}`
          ).toBe(input.validity.patternMismatch);
        }
      });
    }

    it('type=email', () => {
      for (const sample of samples) {
        const input = document.createElement('input');
        input.type = 'email';
        input.value = sample;
        expect(
          evaluateConstraints(text(sample, { email: true })) === 'email',
          sample
        ).toBe(input.validity.typeMismatch);
      }
    });

    it('required', () => {
      for (const sample of ['', ' ', 'x']) {
        const input = document.createElement('input');
        input.required = true;
        input.value = sample;
        expect(
          evaluateConstraints(text(sample, { required: true })) === 'required',
          JSON.stringify(sample)
        ).toBe(input.validity.valueMissing);
      }
    });
  });
});
