import { describe, it, expect, vi } from 'vitest';
import { nativeOptionState } from './option-list';

describe('nativeOptionState', () => {
  it('emits only the attributes that are on', () => {
    expect(nativeOptionState(false, false)).toEqual({});
    expect(nativeOptionState(true, false)).toEqual({ checked: 'true' });
    expect(nativeOptionState(true, true)).toEqual({
      checked: 'true',
      disabled: 'true',
    });
  });
});
