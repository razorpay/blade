import { describe, it, expect } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import CardGroupDataHarness from './fixtures/CardGroupDataHarness.svelte';

const radio = (element: HTMLElement): HTMLInputElement => element as HTMLInputElement;

describe('CardGroup with items (data rows)', () => {
  it('an item takes its place from the data, not the document', () => {
    const { getByTestId } = render(CardGroupDataHarness, { props: { isReversed: true } });
    // The last row in the document is the first item: `${testID}-${index}`.
    expect(getByTestId('banks-0').closest('label')?.textContent).toContain('HDFC');
    expect(getByTestId('banks-3').closest('label')?.textContent).toContain('AXIS');
  });

  it('a pick binds the item, with headings between the rows', async () => {
    const { getByTestId, getByText } = render(CardGroupDataHarness);
    expect(getByText('Others')).toBeTruthy();
    await fireEvent.click(getByTestId('banks-1'));
    expect(getByTestId('bound').textContent).toBe('icici');
    expect(radio(getByTestId('banks-1')).checked).toBe(true);
  });

  it('the keyboard moves in data order and skips what the data disables', async () => {
    const { getByTestId } = render(CardGroupDataHarness, { props: { isReversed: true } });
    const first = getByTestId('banks-1');
    first.focus();
    await fireEvent.focus(first);
    await fireEvent.keyDown(first, { key: 'ArrowDown' });
    // icici → (sbi disabled) → axis
    expect(getByTestId('view').textContent).toBe('3:3');
    await fireEvent.keyDown(getByTestId('banks-3'), { key: ' ' });
    expect(getByTestId('bound').textContent).toBe('axis');
  });

  it('typeahead matches itemText', async () => {
    const { getByTestId } = render(CardGroupDataHarness);
    const first = getByTestId('banks-0');
    first.focus();
    await fireEvent.focus(first);
    await fireEvent.keyDown(first, { key: 'a' });
    expect(getByTestId('view').textContent).toBe('3:3');
  });

  it('with a slice mounted, the one tab stop is among the mounted rows', () => {
    const { getByTestId } = render(CardGroupDataHarness, { props: { mounted: [2, 3] } });
    // sbi is disabled: the first enabled mounted row holds the stop.
    expect(getByTestId('banks-3').tabIndex).toBe(0);
    expect(getByTestId('banks-2').tabIndex).toBe(-1);
  });

  it('reports a keyboard move to a row not mounted, for a window to reveal', async () => {
    const { getByTestId } = render(CardGroupDataHarness, { props: { mounted: [0, 1] } });
    const first = getByTestId('banks-0');
    first.focus();
    await fireEvent.focus(first);
    await fireEvent.keyDown(first, { key: 'End' });
    expect(getByTestId('view').textContent).toBe('3:3');
  });

  it('opens at the pick: the tab stop is the picked item', () => {
    const { getByTestId } = render(CardGroupDataHarness, { props: { value: 'axis' } });
    expect(getByTestId('view').textContent).toBe('-1:3');
    expect(getByTestId('banks-3').tabIndex).toBe(0);
  });

  it('follows the items as they shrink (a search), keeping one tab stop', async () => {
    const { getByTestId, rerender } = render(CardGroupDataHarness);
    await rerender({ query: 'a' });
    expect(getByTestId('banks-0').closest('label')?.textContent).toContain('AXIS');
    expect(getByTestId('banks-0').tabIndex).toBe(0);
  });
});
