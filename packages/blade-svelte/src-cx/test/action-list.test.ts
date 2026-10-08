import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import ActionListHarness from './fixtures/ActionListHarness.svelte';
import DropdownHarness from './fixtures/DropdownHarness.svelte';

const flush = (): Promise<unknown> => new Promise((resolve) => setTimeout(resolve, 0));
const control = (row: HTMLElement): HTMLInputElement => row as HTMLInputElement;
/** The row (a label) around a choice's native control. */
const rowOf = (input: HTMLElement): HTMLElement => input.closest('label')!;

describe('ActionList, standalone', () => {
  it('is an OptionList of native radios in the action look: rows of Menu and Dropdown', () => {
    const { getByRole, getByTestId } = render(ActionListHarness);
    expect(getByRole('radiogroup', { name: 'Plan' })).toBeTruthy();
    const basic = getByTestId('basic');
    expect(basic.getAttribute('type')).toBe('radio');
    expect(basic.className).toContain('sr-only');
    const row = rowOf(basic);
    expect(row.className).toContain('gap-2 p-2 rounded-small');
    expect(row.className).toContain('hover:bg-interactive-gray-default');
    expect(row.textContent).toContain('For new businesses');
  });

  it('single: a pick holds and binds, drawn with the selected wash', async () => {
    const { getByTestId } = render(ActionListHarness);
    await fireEvent.click(getByTestId('pro'));
    await flush();
    expect(getByTestId('bound').textContent).toBe('"pro"');
    expect(control(getByTestId('pro')).checked).toBe(true);
    expect(rowOf(getByTestId('pro')).className).toContain('bg-interactive-gray-faded-highlighted');
    await fireEvent.click(getByTestId('legacy'));
    expect(getByTestId('bound').textContent).toBe('"pro"');
  });

  it('multiple: checkboxes, each row leading with the drawn checkbox', async () => {
    const { getByTestId, getByRole } = render(ActionListHarness, { props: { isMultiple: true } });
    expect(getByRole('group', { name: 'Plan' })).toBeTruthy();
    await fireEvent.click(getByTestId('basic'));
    await fireEvent.click(getByTestId('pro'));
    await flush();
    expect(getByTestId('bound').textContent).toBe('["basic","pro"]');
    expect(getByTestId('basic').getAttribute('type')).toBe('checkbox');
    const box = rowOf(getByTestId('basic')).querySelector('[aria-hidden="true"] > span')!;
    expect(box.className).toContain('bg-interactive-primary-default');
  });

  it('sections are labelled groups; a link row navigates and holds nothing; a negative row is red', async () => {
    const { getByRole, getByTestId } = render(ActionListHarness);
    expect(getByRole('group', { name: 'Plans' })).toBe(getByTestId('plans'));
    // Figma's separator row before every section but the first: a hairline 8px in.
    const separator = getByTestId('more').firstElementChild!;
    expect(separator.className).toContain('mx-2 my-[1.5px] h-0 border-t-thin');
    expect(separator.className).toContain('group-first/section:hidden');
    const link = getByRole('link', { name: 'Compare plans' });
    expect(link.getAttribute('href')).toBe('/plans');
    expect(link.className).toContain('rounded-small');
    const cancel = rowOf(getByTestId('cancel'));
    expect(cancel.dataset.intent).toBe('negative');
    expect(cancel.className).toContain('data-[intent=negative]:text-interactive-negative-normal');
  });

  it('in a Form: required blocks submit, then the pick submits under its name', async () => {
    const onSubmit = vi.fn();
    const { getByTestId } = render(ActionListHarness, { props: { inForm: true, onSubmit } });
    await fireEvent.click(getByTestId('submit'));
    await flush();
    expect(onSubmit).not.toHaveBeenCalled();
    await fireEvent.click(getByTestId('basic'));
    await fireEvent.click(getByTestId('submit'));
    await flush();
    expect(onSubmit.mock.calls[0][0]).toEqual({ plan: 'basic' });
  });
});

describe('ActionList inside a Dropdown', () => {
  it('its items are the listbox options, held by the Dropdown', async () => {
    const view = render(DropdownHarness);
    await fireEvent.click(view.getByTestId('dd-trigger'));
    await waitFor(() => view.getByRole('listbox'));
    expect(view.getAllByRole('option').map((option) => option.textContent?.trim())).toEqual(['UPI', 'Cards', 'Netbanking', 'Wallet']);
    expect(view.queryAllByRole('radio')).toHaveLength(0);
  });

  it('a link row follows its link, closes the list, and holds no value — even with isMultiple', async () => {
    const view = render(DropdownHarness, { props: { hasLink: true, isMultiple: true } });
    await fireEvent.click(view.getByTestId('dd-trigger'));
    await waitFor(() => view.getByRole('listbox'));
    const link = view.getByRole('link', { name: 'Payment help' });
    expect(link.getAttribute('href')).toBe('#help');
    expect(link.getAttribute('aria-selected')).toBeNull();
    await fireEvent.click(link);
    await waitFor(() => expect(view.queryByRole('listbox')).toBeNull());
    expect(view.getByTestId('bound').textContent).toBe('null');
  });

  it('Enter on an active link row follows it', async () => {
    const view = render(DropdownHarness, { props: { hasLink: true } });
    const trigger = view.getByTestId('dd-trigger');
    trigger.focus();
    await fireEvent.keyDown(trigger, { key: 'ArrowUp' });
    const list = await waitFor(() => view.getByRole('listbox'));
    const link = view.getByRole('link', { name: 'Payment help' });
    await waitFor(() => expect(list.getAttribute('aria-activedescendant')).toBe(link.id));
    const followed = vi.fn((event: Event) => event.preventDefault());
    link.addEventListener('click', followed);
    await fireEvent.keyDown(list, { key: 'Enter' });
    expect(followed).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(view.queryByRole('listbox')).toBeNull());
  });
});
