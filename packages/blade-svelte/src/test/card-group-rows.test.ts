import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import CardGroupRowsHarness from './fixtures/CardGroupRowsHarness.svelte';
import { expectClass, expectNoClass } from './classes';

// Blade DSL's Card Group: rows that pick (a `value`), navigate (`href`),
// disclose (`content`) or just show.
describe('CardGroup rows without a value', () => {
  it('a link row navigates with a chevron and is no choice', () => {
    const { getByTestId, getAllByRole } = render(CardGroupRowsHarness);
    const cards = getByTestId('cards');
    expect(cards.tagName).toBe('A');
    expect(cards.getAttribute('href')).toBe('/cards');
    expect(cards.querySelector('[aria-hidden="true"]')).not.toBeNull();
    // Only the value rows are radios.
    expect(getAllByRole('radio')).toHaveLength(2);
  });

  it('a disabled link loses its href and leaves the tab order', () => {
    const { getByTestId } = render(CardGroupRowsHarness);
    const emi = getByTestId('emi');
    expect(emi.hasAttribute('href')).toBe(false);
    expect(emi.getAttribute('aria-disabled')).toBe('true');
    expect(emi.getAttribute('tabindex')).toBe('-1');
    // As Blade's disabled ActionListItem: the disabled text colour, no fade.
    expectClass(emi, 'text-interactive-gray-disabled!');
    expectNoClass(emi, 'opacity-50');
  });

  it("a disabled link's onClick does not run, even when a click reaches it", async () => {
    const onClick = vi.fn();
    const { getByTestId } = render(CardGroupRowsHarness, { props: { onEmiClick: onClick } });
    // The built-in look sets pointer-events-none; a programmatic click goes past it.
    await fireEvent.click(getByTestId('emi'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('a row with content toggles it, and controls it while shown', async () => {
    const onExpandChange = vi.fn();
    const { getByTestId, queryByTestId } = render(CardGroupRowsHarness, {
      props: { onExpandChange },
    });
    const trigger = getByTestId('upi-trigger');
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(queryByTestId('upi-body')).toBeNull();

    await fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    const body = getByTestId('upi-body');
    expect(body.closest(`#${trigger.getAttribute('aria-controls')}`)).not.toBeNull();
    expect(onExpandChange).toHaveBeenCalledWith({ isExpanded: true });
  });

  it('a row in the content is content, not the trigger again', async () => {
    const { getByTestId } = render(CardGroupRowsHarness, { props: { isExpanded: true } });
    await tick();
    const gpay = getByTestId('gpay');
    expect(gpay.tagName).toBe('DIV');
    expect(gpay.hasAttribute('aria-expanded')).toBe(false);
  });

  it('a host drives isExpanded', async () => {
    const { getByTestId, queryByTestId, rerender } = render(CardGroupRowsHarness);
    expect(queryByTestId('upi-body')).toBeNull();
    await rerender({ isExpanded: true });
    expect(getByTestId('upi-body')).toBeTruthy();
  });

  it("a choice's content shows while it is picked", async () => {
    const { getAllByRole, queryByTestId } = render(CardGroupRowsHarness);
    const [wallet, part] = getAllByRole('radio');
    expect(queryByTestId('part-body')).toBeNull();
    await fireEvent.click(part);
    expect(queryByTestId('part-body')).not.toBeNull();
    // The row and its body are one row of the group.
    expect(queryByTestId('part-body')?.closest('div.flex-col')?.contains(part)).toBe(true);
    await fireEvent.click(wallet);
    await tick();
    // CollapsePanel's out-transition: the body leaves once it ends.
    await new Promise((resolve) => setTimeout(resolve, 350));
    expect(queryByTestId('part-body')).toBeNull();
  });

  it("isExpanded overrides a choice's body following the pick", () => {
    const { getByTestId } = render(CardGroupRowsHarness, { props: { detailsExpanded: true } });
    expect(getByTestId('part-body')).toBeTruthy();
  });

  it('a row with neither value nor href is plain content', () => {
    const { getByTestId } = render(CardGroupRowsHarness);
    const note = getByTestId('note');
    expect(note.tagName).toBe('DIV');
    expect(note.className).not.toContain('cursor-pointer');
  });

  it('a value row still picks, drawn with the primary ring', async () => {
    const { getAllByRole } = render(CardGroupRowsHarness);
    const [wallet] = getAllByRole('radio');
    await fireEvent.click(wallet);
    expectClass(wallet.closest('label'), 'shadow-card-group-picked');
  });
});
