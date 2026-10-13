import { afterEach, describe, it, expect, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import BankListHarness from './fixtures/BankListHarness.svelte';
import VirtualBankListHarness from './fixtures/VirtualBankListHarness.svelte';
import { expectClass, expectNoClass } from './classes';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ActionList variant="card"', () => {
  it('each section is its own box, its heading above; sections 24px apart', () => {
    const { getByTestId, getByText } = render(BankListHarness);
    const suggested = getByTestId('suggested');
    const heading = getByText('Suggested Banks');
    const box = heading.nextElementSibling as HTMLElement;
    expect(heading.parentElement).toBe(suggested);
    expectClass(box, 'rounded-small');
    expectClass(box, 'border-thin');
    expectClass(box, '[&>*+*]:border-t-thin');
    expect(box.contains(getByTestId('sbi'))).toBe(true);
    expectClass(suggested.parentElement, 'gap-6');
  });

  it('without sections the list itself is the box', () => {
    const { getByTestId } = render(BankListHarness, { props: { withSections: false } });
    const box = getByTestId('sbi').parentElement!;
    expectClass(box, 'rounded-small');
    expectClass(box, 'border-thin');
  });

  it('rows are 16px in and 12px tall; the leading box is 24px, centred', () => {
    const { getByTestId } = render(BankListHarness);
    const row = getByTestId('sbi');
    expectClass(row, 'px-4');
    expectClass(row, 'py-3');
    expectClass(getByTestId('logo').parentElement, 'w-6');
    expectClass(getByTestId('logo').parentElement, 'self-center');
    expect(getByTestId('icici-corp').textContent).toContain('For Businesses');
  });
});

describe('ActionList search: query, filter, empty', () => {
  it('a query hides the rows that fail it, and a section left with none', async () => {
    const { queryByTestId, getByTestId, rerender } = render(BankListHarness);
    await rerender({ query: '  AXIS ' });
    expect(queryByTestId('sbi')).toBeNull();
    expect(getByTestId('axis')).toBeTruthy();
    expectClass(getByTestId('suggested'), 'hidden');
    expectNoClass(getByTestId('all'), 'hidden');
    expect(getByTestId('banks-empty').textContent?.trim()).toBe('');
  });

  it('a query that leaves no row shows the empty state in a status region', async () => {
    const { getByTestId, rerender } = render(BankListHarness);
    await rerender({ query: 'zzz' });
    const status = getByTestId('banks-empty');
    expect(status.getAttribute('role')).toBe('status');
    expect(status.textContent).toContain('No banks match "zzz"');
    await rerender({ query: '' });
    expect(status.textContent?.trim()).toBe('');
    expect(getByTestId('sbi')).toBeTruthy();
  });

  it('filter replaces the title match', () => {
    const filter = (item: { title: string; value: string }, query: string): boolean =>
      item.value.startsWith(query);
    const { queryByTestId, getByTestId } = render(BankListHarness, {
      props: { filter, query: 'ko' },
    });
    expect(getByTestId('kotak')).toBeTruthy();
    expect(queryByTestId('axis')).toBeNull();
  });
});

describe('ActionList selectionType="none"', () => {
  it('rows are buttons in a group: a press reports and holds nothing', async () => {
    const onChange = vi.fn();
    const onSbiClick = vi.fn();
    const { getByRole, getByTestId } = render(BankListHarness, {
      props: { onChange, onSbiClick },
    });
    expect(getByRole('group', { name: 'Banks' })).toBeTruthy();
    const sbi = getByTestId('sbi');
    expect(sbi.tagName).toBe('BUTTON');
    expect(sbi.getAttribute('type')).toBe('button');
    await fireEvent.click(sbi);
    expect(onChange).toHaveBeenCalledWith({ name: undefined, value: 'sbi' });
    expect(onSbiClick).toHaveBeenCalledTimes(1);
    expect(sbi.hasAttribute('aria-checked')).toBe(false);
    expectNoClass(sbi, 'bg-interactive-gray-faded-highlighted');
    await fireEvent.click(sbi);
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('one tab stop; the arrows move focus across sections', async () => {
    const { getByTestId } = render(BankListHarness);
    const stops = ['sbi', 'icici-corp', 'airtel'].map((id) => getByTestId(id).tabIndex);
    expect(stops).toEqual([0, -1, -1]);
    getByTestId('icici-corp').focus();
    await fireEvent.focus(getByTestId('icici-corp'));
    await fireEvent.keyDown(getByTestId('icici-corp'), { key: 'ArrowDown' });
    await waitFor(() => expect(document.activeElement).toBe(getByTestId('airtel')));
  });
});

// jsdom has no layout: every row 48px, the viewport 400px.
function stubLayout(): void {
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(400);
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    height: 48,
    width: 300,
    top: 0,
    left: 0,
  } as DOMRect);
}

describe('VirtualActionList with sections', () => {
  it('headings are rows of their own; a card frames each row by its place', async () => {
    stubLayout();
    const { getByText, getByTestId } = render(VirtualBankListHarness);
    await waitFor(() => getByTestId('b0'));
    const first = getByText('Suggested Banks');
    expectClass(first, 'pb-3');
    expectNoClass(first, 'pt-6');
    expectClass(getByText('All Banks'), 'pt-6');
    // A frame per row: the section's first opens the box, its last closes it.
    expectClass(getByTestId('sbi').parentElement, 'rounded-tl-small');
    expectClass(getByTestId('kotak').parentElement, 'rounded-bl-small');
    expectClass(getByTestId('b2').parentElement, 'border-t-thin');
    expectNoClass(getByTestId('b2').parentElement, 'rounded-small');
  });

  it('a query filters the data, leaving an emptied section out', async () => {
    stubLayout();
    const { queryByText, queryByTestId, getByTestId, rerender } = render(VirtualBankListHarness);
    await waitFor(() => getByTestId('b0'));
    await rerender({ query: 'bank 3' });
    await waitFor(() => expect(queryByTestId('sbi')).toBeNull());
    expect(queryByText('Suggested Banks')).toBeNull();
    expect(getByTestId('b3')).toBeTruthy();
    // The only row of its section: framed all round.
    expectClass(getByTestId('b3').parentElement, 'rounded-small');
  });

  it('none: a press reports the option; an empty search shows the status', async () => {
    stubLayout();
    const onChange = vi.fn();
    const { getByTestId, rerender } = render(VirtualBankListHarness, { props: { onChange } });
    await waitFor(() => getByTestId('b0'));
    await fireEvent.click(getByTestId('b1'));
    expect(onChange.mock.calls[0][0].value).toEqual({ code: 'b1', name: 'Bank 1' });
    await rerender({ query: 'zzz', onChange });
    await waitFor(() =>
      expect(getByTestId('banks-empty').textContent).toContain('No banks match "zzz"'),
    );
  });
});
