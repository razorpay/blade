import { describe, it, expect } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import ActionListHarness from './fixtures/ActionListHarness.svelte';

const flush = (): Promise<unknown> => new Promise((resolve) => setTimeout(resolve, 0));
const control = (row: HTMLElement): HTMLInputElement => row as HTMLInputElement;
/** The row (a label) around a choice's native control. */
const rowOf = (input: HTMLElement): HTMLElement => input.closest('label')!;

describe('ActionList, standalone', () => {
  it('is a CardGroup of native radios in the action look: the rows of a menu', () => {
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

  it('sections are labelled groups; a link row navigates and holds nothing; a negative row is red', () => {
    const { getByRole, getByTestId } = render(ActionListHarness);
    expect(getByRole('group', { name: 'Plans' })).toBe(getByTestId('plans'));
    // Figma's separator row before every section but the first: a hairline 8px in.
    const separator = getByTestId('more').firstElementChild!;
    expect(separator.className).toContain('mx-2 my-[1.5px] h-0 border-t-thin');
    expect(separator.className).toContain('group-first/section:hidden');
    const link = getByRole('link', { name: 'Compare plans' });
    expect(link.getAttribute('href')).toBe('/plans');
    expect(link.className).toContain('rounded-small');
    // CardGroupItem's link row, in ActionList's look: no chevron.
    expect(link.querySelector('[aria-hidden="true"].hidden')).not.toBeNull();
    const cancel = rowOf(getByTestId('cancel'));
    expect(cancel.dataset.intent).toBe('negative');
    expect(cancel.className).toContain('data-[intent=negative]:text-interactive-negative-normal');
  });
});

describe('ActionList inset', () => {
  it("keeps a plain list's gutter inside the rows", async () => {
    const { resolveActionList } = await import('../components/action-list/styles');
    expect(resolveActionList().options).toBe('flex flex-col');
    expect(resolveActionList({ inset: 'large' }).options.split(' ')).toEqual([
      'flex',
      'flex-col',
      'px-5',
      'pt-5',
      'pb-5',
    ]);
  });

  it('insets a card list around its boxes', async () => {
    const { resolveActionList } = await import('../components/action-list/styles');
    const card = resolveActionList({ variant: 'card', inset: 'medium' });
    expect(card.root.split(' ')).toEqual(expect.arrayContaining(['px-4', 'pt-4', 'pb-4']));
    expect(card.options).not.toContain('px-4');
  });
});
