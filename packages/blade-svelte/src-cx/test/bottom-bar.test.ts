import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { BottomBar } from '../index';
import { expectClass } from './classes';

const children = createRawSnippet(() => ({ render: () => '<a href="#home" data-testid="item">Home</a>' }));

describe('BottomBar', () => {
  it("draws Figma's surface: border on top, upward shadow, 4px in, the safe area below", () => {
    const { getByTestId } = render(BottomBar, { props: { children, testID: 'bar' } });
    const bar = getByTestId('bar');
    expectClass(bar, 'bg-surface-gray-intense');
    expectClass(bar, 'border-t-thin');
    expectClass(bar, 'border-surface-gray-muted');
    expectClass(bar, 'shadow-bottomBar');
    expectClass(bar, 'px-1 pt-1');
    expectClass(bar, '[padding-bottom:max(0.25rem,env(safe-area-inset-bottom))]');
    expect(bar.contains(getByTestId('item'))).toBe(true);
  });

  it('positions nothing itself: placement is the consumer class', () => {
    const { getByTestId } = render(BottomBar, {
      props: { children, testID: 'bar', class: 'fixed inset-x-0 bottom-0' },
    });
    const bar = getByTestId('bar');
    expect(bar.className.replace('fixed inset-x-0 bottom-0', '')).not.toMatch(/\b(fixed|sticky|absolute|bottom-0)\b/);
    expect(bar.className.endsWith('fixed inset-x-0 bottom-0')).toBe(true);
  });
});
