import { describe, it, expect } from 'vitest';
import { resolveHint, visibleFieldError, visibleGroupError } from './hint';
import type { FormState } from './types';

function formState(partial: Partial<FormState>): FormState {
  return {
    data: {},
    touched: {},
    errors: {},
    submitted: false,
    submitting: false,
    ...partial,
  };
}

describe('visibleFieldError', () => {
  const errors = { 'card.number': 'required' };

  it('keeps an untouched field quiet until a submit attempt', () => {
    const field = { name: 'card.number', value: '' };
    expect(visibleFieldError(field, formState({ errors }))).toBeUndefined();
    expect(visibleFieldError(field, formState({ errors, submitted: true }))).toBe('required');
  });

  it('shows the error once the field is touched', () => {
    const field = { name: 'card.number', value: '', touched: true };
    expect(visibleFieldError(field, formState({ errors }))).toBe('required');
  });

  it('ignores a field without a name', () => {
    expect(
      visibleFieldError({ value: '' }, formState({ errors, submitted: true })),
    ).toBeUndefined();
  });
});

describe('visibleGroupError', () => {
  const errors = { number: 'bad number', cvv: 'bad cvv' };
  const number = { name: 'number', value: '' };
  const cvv = { name: 'cvv', value: '', touched: true };

  it('shows the first member error that is visible', () => {
    expect(visibleGroupError([number, cvv], formState({ errors }))).toBe('bad cvv');
    expect(visibleGroupError([number, cvv], formState({ errors, submitted: true }))).toBe(
      'bad number',
    );
  });

  it('is quiet while no member shows an error', () => {
    expect(visibleGroupError([number], formState({ errors }))).toBeUndefined();
  });
});

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
