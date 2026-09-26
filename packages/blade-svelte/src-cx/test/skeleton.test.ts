import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { Skeleton } from '../components/skeleton';

describe('Skeleton (preset component)', () => {
  it('pulses, is hidden from assistive tech and takes its box from class', () => {
    const bone = render(Skeleton, {
      props: { class: 'h-10 w-40', testID: 'bone' },
    }).getByTestId('bone');
    expect(bone.getAttribute('aria-hidden')).toBe('true');
    expect(bone.className).toContain('animate-skeleton');
    expect(bone.className.endsWith('h-10 w-40')).toBe(true);
    expect(bone.children).toHaveLength(0);
  });
});
