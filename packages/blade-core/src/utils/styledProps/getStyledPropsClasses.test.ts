import { describe, expect, it } from 'vitest';
import { getStyledPropsClasses } from './getStyledPropsClasses';

describe('getStyledPropsClasses → Tailwind vocabulary', () => {
  it('maps display to Tailwind display utilities', () => {
    expect(getStyledPropsClasses({ display: 'flex' }).classes).toContain('flex');
    expect(getStyledPropsClasses({ display: 'none' }).classes).toContain('hidden');
    expect(getStyledPropsClasses({ display: 'inline-flex' }).classes).toContain('inline-flex');
  });

  it('maps visibility (hidden → invisible)', () => {
    expect(getStyledPropsClasses({ visibility: 'hidden' }).classes).toContain('invisible');
    expect(getStyledPropsClasses({ visibility: 'visible' }).classes).toContain('visible');
  });

  it('maps position to the bare Tailwind utility', () => {
    expect(getStyledPropsClasses({ position: 'absolute' }).classes).toContain('absolute');
    expect(getStyledPropsClasses({ position: 'relative' }).classes).toContain('relative');
  });

  it('maps margin tokens to namespaced Tailwind margin utilities', () => {
    expect(getStyledPropsClasses({ marginX: 'spacing.1' }).classes).toContain('mx-spacing-1');
    expect(getStyledPropsClasses({ marginY: 'spacing.2' }).classes).toContain('my-spacing-2');
    expect(getStyledPropsClasses({ marginTop: 'spacing.3' }).classes).toContain('mt-spacing-3');
    expect(getStyledPropsClasses({ margin: 'spacing.4' }).classes).toContain('m-spacing-4');
  });

  it('keeps inset (top/right/bottom/left) spacing utilities namespaced', () => {
    expect(getStyledPropsClasses({ top: 'spacing.3' }).classes).toContain('top-spacing-3');
    expect(getStyledPropsClasses({ left: 'spacing.2' }).classes).toContain('left-spacing-2');
  });

  it('maps alignSelf and flexWrap', () => {
    expect(getStyledPropsClasses({ alignSelf: 'center' }).classes).toContain('self-center');
    expect(getStyledPropsClasses({ flexWrap: 'wrap' }).classes).toContain('flex-wrap');
    expect(getStyledPropsClasses({ flexWrap: 'nowrap' }).classes).toContain('flex-nowrap');
  });

  it('keeps inline-style fallbacks for numeric zIndex / order and arbitrary values', () => {
    expect(getStyledPropsClasses({ zIndex: 5 }).inlineStyles.zIndex).toBe(5);
    expect(getStyledPropsClasses({ order: 2 }).inlineStyles.order).toBe(2);
  });
});
