import { describe, expect, it } from 'vitest';
import { mergeStyleOverride } from './mergeStyleOverride';
import type { ButtonSlot } from '../styles/Button/slots';
import type { StyleOverride } from '../styles/shared/styleOverride';

describe('mergeStyleOverride', () => {
  it('merges provider and instance overrides with instance winning', () => {
    const provider: StyleOverride<ButtonSlot> = {
      root: 'provider-cta',
      text: 'provider-label',
    };
    const instance: StyleOverride<ButtonSlot> = {
      root: 'instance-cta',
      icon: 'instance-icon',
    };

    expect(mergeStyleOverride(provider, instance)).toEqual({
      root: 'instance-cta',
      text: 'provider-label',
      icon: 'instance-icon',
    });
  });

  it('returns empty object when no overrides are passed', () => {
    expect(mergeStyleOverride()).toEqual({});
  });

  it('skips undefined entries', () => {
    expect(mergeStyleOverride(undefined, { root: 'cta' }, undefined)).toEqual({ root: 'cta' });
  });
});
