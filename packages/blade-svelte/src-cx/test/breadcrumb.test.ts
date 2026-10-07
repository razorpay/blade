import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import BreadcrumbHarness from './fixtures/BreadcrumbHarness.svelte';
import { glyphsIn } from './classes';
import { ChevronRightIcon, HomeIcon } from '../icons';

describe('Breadcrumb', () => {
  it('a labelled nav of an ordered list; the current page is text marked aria-current', () => {
    const { getByRole, getByTestId } = render(BreadcrumbHarness);
    const nav = getByRole('navigation', { name: 'Breadcrumb' });
    const list = nav.querySelector('ol')!;
    expect(list.className).toContain('list-none');
    expect(list.className).toContain('gap-1');
    expect(list.children).toHaveLength(3);
    const current = getByTestId('current');
    expect(current.tagName).toBe('SPAN');
    expect(current.closest('li')!.getAttribute('aria-current')).toBe('page');
    expect(current.className).toContain('font-blade-medium text-100 leading-100');
  });

  it('links between slashes, none after the last; an icon-only item is named', () => {
    const { getByRole, getByTestId } = render(BreadcrumbHarness);
    expect(getByRole('link', { name: 'Home' }).getAttribute('href')).toBe('/');
    expect(glyphsIn(getByTestId('home'), HomeIcon)).toHaveLength(1);
    const separators = getByRole('navigation').querySelectorAll('li > [aria-hidden="true"]');
    expect([...separators].map((s) => s.textContent?.trim())).toEqual(['/', '/']);
  });

  it('showLastSeparator adds one after the last item', () => {
    const { getByRole } = render(BreadcrumbHarness, { props: { showLastSeparator: true } });
    expect(getByRole('navigation').querySelectorAll('li > [aria-hidden="true"]')).toHaveLength(3);
  });

  it('a neutral or white trail fades its links; primary keeps them full', () => {
    const neutral = render(BreadcrumbHarness, { props: { color: 'neutral' } });
    expect(neutral.getByTestId('payments').className).toContain('opacity-blade-700');
    neutral.unmount();
    const primary = render(BreadcrumbHarness, { props: { color: 'primary' } });
    expect(primary.getByTestId('payments').className).not.toContain('opacity-blade-700');
  });

  it('onClick reaches a router', async () => {
    const onClick = vi.fn((event: MouseEvent) => event.preventDefault());
    const { getByRole } = render(BreadcrumbHarness, { props: { onClick } });
    await fireEvent.click(getByRole('link', { name: 'Payments' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("intense: Figma's pills between chevrons, the current page in the tinted pill", () => {
    const { getByRole, getByTestId } = render(BreadcrumbHarness, { props: { emphasis: 'intense' } });
    const list = getByRole('navigation').querySelector('ol')!;
    expect(list.className).toContain('gap-6');
    const pill = getByRole('link', { name: 'Payments' });
    expect(pill.className).toContain('h-7');
    expect(pill.className).toContain('rounded-large px-3');
    expect(pill.className).toContain('hover:bg-interactive-gray-default');
    expect(getByTestId('current').className).toContain('bg-interactive-primary-faded text-interactive-primary-normal');
    expect(glyphsIn(list, ChevronRightIcon)).toHaveLength(2);
  });
});
