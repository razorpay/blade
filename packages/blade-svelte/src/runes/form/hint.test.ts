import { describe, it, expect } from 'vitest';
import { resolveHint } from './hint';
describe('resolveHint', () => {
  it('shows the hint under whatever state the consumer passes', () => {
    expect(resolveHint({ hint: 'Help' })).toEqual({
      validationState: 'none',
      text: 'Help',
    });
    expect(resolveHint({ hint: 'Bad', validationState: 'error' })).toEqual({
      validationState: 'error',
      text: 'Bad',
    });
    expect(resolveHint({ hint: 'Good', validationState: 'success' })).toEqual({
      validationState: 'success',
      text: 'Good',
    });
  });

  it('mirrors the form error when no state is passed, replacing the hint', () => {
    expect(resolveHint({ hint: 'Help' }, 'required')).toEqual({
      validationState: 'error',
      text: 'required',
    });
    expect(resolveHint({ hint: 'Help' })).toEqual({
      validationState: 'none',
      text: 'Help',
    });
  });

  it('an explicit state wins over the form error', () => {
    expect(resolveHint({ hint: 'Help', validationState: 'none' }, 'required')).toEqual({
      validationState: 'none',
      text: 'Help',
    });
  });

  it('an explicit error with no hint borrows the form message', () => {
    expect(resolveHint({ validationState: 'error' }, 'required')).toEqual({
      validationState: 'error',
      text: 'required',
    });
    expect(resolveHint({ validationState: 'success' }, 'required').text).toBeUndefined();
  });
});
