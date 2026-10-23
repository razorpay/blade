import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import Harness from './fixtures/ActionListDataHarness.svelte';

const flush = (): Promise<unknown> => new Promise((resolve) => setTimeout(resolve, 0));
const rows = (container: HTMLElement): string[] =>
  Array.from(container.querySelectorAll<HTMLInputElement>('input')).map((input) =>
    input.closest('label')!.textContent.trim(),
  );

describe('ActionList parity', () => {
  it('onChange reports { name, value }: the pick, or an array with multiple', async () => {
    const onChange = vi.fn();
    const single = render(Harness, { props: { onChange } });
    await fireEvent.click(single.getByTestId('banks-1'));
    expect(onChange).toHaveBeenLastCalledWith({ name: undefined, value: 'bank-1' });
    single.unmount();

    const { getByTestId } = render(Harness, { props: { onChange, selectionType: 'multiple' } });
    await fireEvent.click(getByTestId('banks-0'));
    await fireEvent.click(getByTestId('banks-2'));
    expect(onChange).toHaveBeenLastCalledWith({ name: undefined, value: ['bank-0', 'bank-2'] });
    await fireEvent.click(getByTestId('banks-0'));
    expect(onChange).toHaveBeenLastCalledWith({ name: undefined, value: ['bank-2'] });
  });

  it("an item's onClick gets React's { name, value, event }: value is whether it was selected", async () => {
    const onItemClick = vi.fn();
    const { getByTestId } = render(Harness, { props: { onItemClick } });
    await fireEvent.click(getByTestId('banks-1'));
    expect(onItemClick).toHaveBeenLastCalledWith({
      name: 'bank-1',
      value: false,
      event: expect.any(MouseEvent),
    });
    await fireEvent.click(getByTestId('banks-1'));
    expect(onItemClick).toHaveBeenLastCalledWith(expect.objectContaining({ value: true }));
    await fireEvent.focus(getByTestId('banks-1'));
    await fireEvent.keyDown(getByTestId('banks-1'), { key: 'Enter' });
    expect(onItemClick).toHaveBeenLastCalledWith({
      name: 'bank-1',
      value: true,
      event: expect.any(KeyboardEvent),
    });
  });

  it("the arrows move and pick nothing (a listbox's keys, as React's)", async () => {
    const onChange = vi.fn();
    const { getByTestId } = render(Harness, { props: { onChange } });
    getByTestId('banks-0').focus();
    await fireEvent.focus(getByTestId('banks-0'));
    await fireEvent.keyDown(getByTestId('banks-0'), { key: 'ArrowDown' });
    await flush();
    expect(document.activeElement).toBe(getByTestId('banks-1'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("a link row goes through the app's router, with its click payload", () => {
    const navigate = vi.fn(() => true);
    const onItemClick = vi.fn();
    const { getByTestId } = render(Harness, { props: { navigate, onItemClick } });
    const more = getByTestId('more');
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    more.dispatchEvent(event);
    const [click] = onItemClick.mock.calls[0] as [Record<string, unknown>];
    expect([click.name, click.value, click.event === event]).toEqual(['more', false, true]);
    const [href, routed] = (navigate.mock.calls[0] as unknown) as [string, MouseEvent];
    expect([href, routed === event]).toEqual(['/more', true]);
    expect(event.defaultPrevented).toBe(true);
  });

  it('passes data-analytics-* to the list root and to each row control', () => {
    const { getByTestId } = render(Harness);
    expect(getByTestId('banks').getAttribute('data-analytics-list')).toBe('banks');
    expect(getByTestId('banks-2').getAttribute('data-analytics-row')).toBe('bank-2');
  });
});

describe('ActionList and CardGroup rows as data', () => {
  it('renders each item through `row`, sections as titled groups, empty ones left out', () => {
    const { getByRole, queryByText, container } = render(Harness, {
      props: { withSections: true },
    });
    expect(getByRole('group', { name: 'Popular' })).toBeTruthy();
    expect(getByRole('group', { name: 'All banks' })).toBeTruthy();
    expect(queryByText('Empty')).toBeNull();
    expect(rows(container)).toEqual(['BANK-0', 'BANK-1', 'BANK-2', 'BANK-3', 'BANK-4']);
  });

  it.each(['action-list', 'card-group'] as const)(
    '%s: isVirtualized mounts only the rows in view, keyed to the data',
    async (kind) => {
      const { container, getByTestId } = render(Harness, {
        props: { kind, count: 200, isVirtualized: true },
      });
      await flush();
      const shown = rows(container);
      expect(shown.length).toBeGreaterThan(0);
      expect(shown.length).toBeLessThan(20);
      expect(shown[0]).toBe('BANK-0');
      // The index is the item's among all of them, mounted or not.
      expect(getByTestId('banks-0')).toBeTruthy();
      // The padding stands in for the rest.
      const content = container.querySelector<HTMLElement>('[style*="padding-bottom"]')!;
      expect(parseFloat(content.style.paddingBottom)).toBeGreaterThan(0);
    },
  );

  it('virtualized: the keyboard reaches a row not mounted, and the window brings it in', async () => {
    const { getByTestId, container } = render(Harness, {
      props: { count: 200, isVirtualized: true },
    });
    await flush();
    getByTestId('banks-0').focus();
    await fireEvent.focus(getByTestId('banks-0'));
    await fireEvent.keyDown(getByTestId('banks-0'), { key: 'End' });
    await flush();
    expect(rows(container)).toContain('BANK-199');
  });

  it.each([false, true])(
    'no rows to show: no rows box (virtualized: %s)',
    async (isVirtualized) => {
      const empty = render(Harness, { props: { kind: 'card-group', count: 0, isVirtualized } });
      await flush();
      expect(empty.getByTestId('banks').children).toHaveLength(0);
      empty.unmount();
      // What follows the rows keeps the box.
      const { getByTestId } = render(Harness, { props: { count: 0, isVirtualized } });
      await flush();
      expect(getByTestId('banks').children).toHaveLength(1);
      expect(getByTestId('more')).toBeTruthy();
    },
  );

  it('virtualized with sections: a heading is a row of its own', async () => {
    const { getByText } = render(Harness, {
      props: { withSections: true, isVirtualized: true },
    });
    await flush();
    expect(getByText('Popular').tagName).toBe('DIV');
  });
});
