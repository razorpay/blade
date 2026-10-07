import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import DropdownHarness from './fixtures/DropdownHarness.svelte';

const flush = (): Promise<unknown> => new Promise((resolve) => setTimeout(resolve, 0));

interface Queries {
  getByTestId(id: string): HTMLElement;
  getByRole(role: string): HTMLElement;
}

async function open(view: Queries): Promise<HTMLElement> {
  await fireEvent.click(view.getByTestId('dd-trigger'));
  return waitFor(() => view.getByRole('listbox'));
}

describe('Dropdown', () => {
  it('is a select field: label, placeholder, and a listbox trigger', () => {
    const { getByRole } = render(DropdownHarness);
    const trigger = getByRole('combobox', { name: /Payment method/ });
    expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.textContent).toContain('Select a method');
  });

  it('a single pick holds the value, shows it, closes, and returns focus', async () => {
    const onChange = vi.fn();
    const view = render(DropdownHarness, { props: { onChange } });
    const list = await open(view);
    const options = view.getAllByRole('option');
    expect(options.map((option) => option.textContent?.trim())).toEqual(['UPI', 'Cards', 'Netbanking', 'Wallet']);
    expect(list.getAttribute('aria-multiselectable')).toBeNull();

    await fireEvent.click(view.getByTestId('opt-cards'));
    await waitFor(() => expect(view.queryByRole('listbox')).toBeNull());
    expect(view.getByTestId('bound').textContent).toBe('"cards"');
    expect(onChange).toHaveBeenCalledExactlyOnceWith({ name: 'method', value: 'cards' });
    const trigger = view.getByTestId('dd-trigger');
    expect(trigger.textContent).toContain('Cards');
    expect(document.activeElement).toBe(trigger);

    // Reopened, it lands on the pick, which is selected.
    await open(view);
    await waitFor(() => {
      const cards = view.getByTestId('opt-cards');
      expect(cards.getAttribute('aria-selected')).toBe('true');
      expect(view.getByRole('listbox').getAttribute('aria-activedescendant')).toBe(cards.id);
    });
  });

  it('multiple: a pick toggles, keeps the list open, and reports each time', async () => {
    const onChange = vi.fn();
    const view = render(DropdownHarness, { props: { isMultiple: true, hasFooter: true, onChange } });
    const list = await open(view);
    expect(list.getAttribute('aria-multiselectable')).toBe('true');

    await fireEvent.click(view.getByTestId('opt-upi'));
    await fireEvent.click(view.getByTestId('opt-netbanking'));
    await flush();
    expect(view.getByRole('listbox')).toBeTruthy();
    expect(view.getByTestId('bound').textContent).toBe('["upi","netbanking"]');
    expect(onChange).toHaveBeenCalledTimes(2);

    await fireEvent.click(view.getByTestId('opt-upi'));
    expect(view.getByTestId('bound').textContent).toBe('["netbanking"]');

    // The footer's Apply closes it.
    await fireEvent.click(view.getByTestId('apply'));
    await waitFor(() => expect(view.queryByRole('listbox')).toBeNull());
  });

  it('keys: arrows move the active row past a disabled one; Enter and Space pick by the same rule', async () => {
    const view = render(DropdownHarness, { props: { isMultiple: true } });
    const trigger = view.getByTestId('dd-trigger');
    trigger.focus();
    await fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    const list = await waitFor(() => view.getByRole('listbox'));
    await waitFor(() => expect(document.activeElement).toBe(list));
    await waitFor(() => expect(list.getAttribute('aria-activedescendant')).toBe(view.getByTestId('opt-upi').id));

    await fireEvent.keyDown(list, { key: 'Enter' });
    await fireEvent.keyDown(list, { key: 'ArrowDown' });
    await fireEvent.keyDown(list, { key: ' ' });
    expect(view.getByTestId('bound').textContent).toBe('["upi","cards"]');
    expect(view.getByRole('listbox')).toBeTruthy();

    // Wallet is disabled: End lands on Netbanking.
    await fireEvent.keyDown(list, { key: 'End' });
    expect(list.getAttribute('aria-activedescendant')).toBe(view.getByTestId('opt-netbanking').id);

    await fireEvent.keyDown(list, { key: 'Escape' });
    await waitFor(() => expect(view.queryByRole('listbox')).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it('a disabled row refuses the pick', async () => {
    const view = render(DropdownHarness);
    await open(view);
    await fireEvent.click(view.getByTestId('opt-wallet'));
    expect(view.getByTestId('bound').textContent).toBe('null');
    expect(view.getByRole('listbox')).toBeTruthy();
  });

  it('search filters the rows, keeps focus in its field, and says when nothing matches', async () => {
    const view = render(DropdownHarness, { props: { hasSearch: true } });
    await open(view);
    const search = view.getByRole('combobox', { name: 'Search' });
    await waitFor(() => expect(document.activeElement).toBe(search));
    expect(search.getAttribute('aria-controls')).toBe(view.getByRole('listbox').id);

    await fireEvent.input(search, { target: { value: 'net' } });
    await flush();
    const shown = view.getAllByRole('option').filter((option) => !option.hidden);
    expect(shown.map((option) => option.textContent?.trim())).toEqual(['Netbanking']);
    await waitFor(() => expect(search.getAttribute('aria-activedescendant')).toBe(view.getByTestId('opt-netbanking').id));

    // Space types; Enter picks.
    await fireEvent.keyDown(search, { key: ' ' });
    expect(view.getByTestId('bound').textContent).toBe('null');
    await fireEvent.keyDown(search, { key: 'Enter' });
    await waitFor(() => expect(view.queryByRole('listbox')).toBeNull());
    expect(view.getByTestId('bound').textContent).toBe('"netbanking"');

    await open(view);
    const again = view.getByRole('combobox', { name: 'Search' }) as HTMLInputElement;
    // A search is for one visit.
    expect(again.value).toBe('');
    await fireEvent.input(again, { target: { value: 'zzz' } });
    await flush();
    expect(view.getByRole('status').textContent).toBe('No results found');
  });

  it('a press outside closes it and leaves focus where the press put it', async () => {
    const view = render(DropdownHarness);
    await open(view);
    await fireEvent.pointerDown(document.body);
    await waitFor(() => expect(view.queryByRole('listbox')).toBeNull());
    expect(view.getByTestId('open').textContent).toBe('false');
  });

  it('loading: a busy list with a loading row instead of the options', async () => {
    const view = render(DropdownHarness, { props: { isLoading: true } });
    const list = await open(view);
    expect(list.getAttribute('aria-busy')).toBe('true');
    expect(view.queryAllByRole('option').filter((option) => !option.closest('[hidden]'))).toHaveLength(0);
    expect(view.getByRole('status', { name: 'Loading' })).toBeTruthy();
  });

  it('in a Form: required blocks submit, then the pick is submitted under its name', async () => {
    const onSubmit = vi.fn();
    const view = render(DropdownHarness, { props: { inForm: true, onSubmit } });
    await fireEvent.click(view.getByTestId('submit'));
    await flush();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(view.getByTestId('dd-trigger').getAttribute('aria-invalid')).toBe('true');

    await open(view);
    await fireEvent.click(view.getByTestId('opt-upi'));
    await fireEvent.click(view.getByTestId('submit'));
    await flush();
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toEqual({ method: 'upi' });
  });
});
