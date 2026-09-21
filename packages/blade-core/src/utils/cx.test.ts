import { describe, expect, it } from 'vitest';
import { cn, cx, twMerge } from './cx';

describe('cx', () => {
  it('joins classes without conflict resolution (plain CVA cx)', () => {
    expect(cx('p-spacing-2', 'p-spacing-4')).toBe('p-spacing-2 p-spacing-4');
  });
});

describe('cn (tailwind-merge aware)', () => {
  it('dedupes conflicting namespaced spacing — last wins', () => {
    expect(cn('p-spacing-2', 'p-spacing-4')).toBe('p-spacing-4');
    expect(cn('mx-spacing-1 mx-spacing-3')).toBe('mx-spacing-3');
    expect(cn('gap-spacing-2', 'gap-spacing-3')).toBe('gap-spacing-3');
  });

  it('keeps non-conflicting spacing on different sides', () => {
    expect(cn('p-spacing-4', 'm-spacing-2')).toBe('p-spacing-4 m-spacing-2');
  });

  it('dedupes blade border-radius', () => {
    expect(cn('rounded-max', 'rounded-small')).toBe('rounded-small');
  });

  it('dedupes semantic background / text / border colors — last wins', () => {
    expect(
      cn('bg-feedback-background-neutral-subtle', 'bg-feedback-background-neutral-intense'),
    ).toBe('bg-feedback-background-neutral-intense');
    expect(cn('text-surface-text-gray-normal', 'text-surface-text-gray-muted')).toBe(
      'text-surface-text-gray-muted',
    );
    expect(cn('border-surface-border-gray-normal', 'border-surface-border-gray-subtle')).toBe(
      'border-surface-border-gray-subtle',
    );
  });

  it('models styleOverride precedence — a later override beats the base for the same property', () => {
    // base classes then an override class for the same property
    expect(
      cn('bg-surface-background-gray-subtle rounded-max', 'bg-surface-background-gray-intense'),
    ).toBe('rounded-max bg-surface-background-gray-intense');
  });
});

describe('twMerge', () => {
  it('is exported and resolves conflicts standalone', () => {
    expect(twMerge('p-spacing-2 p-spacing-4')).toBe('p-spacing-4');
  });
});
