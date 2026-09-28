import { describe, it, expect, vi } from 'vitest';
import { createRawSnippet } from 'svelte';
import { fireEvent, render } from '@testing-library/svelte';
import OptionRowNative from '../components/option-list/OptionRow.native.svelte';
import { resolveOptionList } from '../components/option-list';
import OptionListHarness from './fixtures/OptionListHarness.svelte';
import { expectClass, expectNoClass } from './classes';

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));
const input = (element: HTMLElement) => element as HTMLInputElement;

describe('OptionList', () => {
  it('is a radiogroup of native radios sharing a name', () => {
    const { getByRole, getByTestId } = render(OptionListHarness);
    const root = getByRole('radiogroup', { name: 'Bank' });
    expect(root).toBe(getByTestId('banks'));
    expect(root.className.endsWith('mt-2')).toBe(true);
    const first = input(getByTestId('banks-0'));
    expect(first.type).toBe('radio');
    expect(first.name).not.toBe('');
    expect(input(getByTestId('banks-1')).name).toBe(first.name);
  });

  it('a pick reports onChange, binds the option and moves the row look', async () => {
    const onChange = vi.fn();
    const { getByTestId } = render(OptionListHarness, { props: { onChange } });
    await fireEvent.click(getByTestId('banks-1'));
    expect(onChange).toHaveBeenCalledExactlyOnceWith({
      code: 'icici',
      name: 'ICICI Bank',
    });
    expect(getByTestId('bound').textContent).toBe('icici');
    expectClass(getByTestId('banks-1').parentElement, 'bg-interactive-gray-faded-highlighted');
    expectNoClass(getByTestId('banks-0').parentElement, 'bg-interactive-gray-faded-highlighted');
  });

  it('tells the item children the index, pick and disabled state', async () => {
    const { getByTestId, getByText } = render(OptionListHarness);
    expect(getByText('2:off:disabled')).toBeTruthy();
    await fireEvent.click(getByTestId('banks-0'));
    expect(getByText('0:on:enabled')).toBeTruthy();
    expect(getByText('1:off:enabled')).toBeTruthy();
  });

  it('matches rebuilt option objects through compare', () => {
    const { getByTestId } = render(OptionListHarness, {
      props: { value: { code: 'icici', name: 'copy' } },
    });
    expect(input(getByTestId('banks-1')).checked).toBe(true);
  });

  it('keeps the pick on a second click unless deselectable', async () => {
    const kept = render(OptionListHarness);
    await fireEvent.click(kept.getByTestId('banks-0'));
    await fireEvent.click(kept.getByTestId('banks-0'));
    expect(kept.getByTestId('bound').textContent).toBe('hdfc');
    kept.unmount();

    const { getByTestId } = render(OptionListHarness, {
      props: { isDeselectable: true },
    });
    await fireEvent.click(getByTestId('banks-0'));
    await fireEvent.click(getByTestId('banks-0'));
    expect(getByTestId('bound').textContent).toBe('none');
    expect(input(getByTestId('banks-0')).checked).toBe(false);
  });

  it('a disabled option refuses a synthetic pick and writes it back', async () => {
    const onChange = vi.fn();
    const { getByTestId } = render(OptionListHarness, { props: { onChange } });
    const down = input(getByTestId('banks-2'));
    expect(down.disabled).toBe(true);
    down.disabled = false;
    await fireEvent.click(down);
    expect(onChange).not.toHaveBeenCalled();
    expect(down.checked).toBe(false);
  });

  it('isMultiple is a group of checkboxes collecting an array', async () => {
    const { getByRole, getByTestId } = render(OptionListHarness, {
      props: { isMultiple: true },
    });
    expect(getByRole('group', { name: 'Bank' })).toBeTruthy();
    expect(input(getByTestId('banks-0')).type).toBe('checkbox');
    await fireEvent.click(getByTestId('banks-0'));
    await fireEvent.click(getByTestId('banks-1'));
    expect(getByTestId('bound').textContent).toBe('hdfc,icici');
    await fireEvent.click(getByTestId('banks-0'));
    expect(getByTestId('bound').textContent).toBe('icici');
  });

  it('the control is the indicator: hidden by default, shown at an edge', () => {
    const hidden = render(OptionListHarness);
    expectClass(hidden.getByTestId('banks-0'), 'sr-only');
    hidden.unmount();
    const { getByTestId } = render(OptionListHarness, {
      props: { indicator: 'trailing' },
    });
    expectClass(getByTestId('banks-0'), 'order-last');
    expectNoClass(getByTestId('banks-0'), 'sr-only');
  });

  it('filtering keeps the pick on the option, not on the position', async () => {
    const { getByTestId, rerender } = render(OptionListHarness);
    await fireEvent.click(getByTestId('banks-1'));
    await rerender({ banks: [{ code: 'icici', name: 'ICICI Bank' }] });
    expect(input(getByTestId('banks-0')).checked).toBe(true);
  });

  it('inside a Form a required list blocks submit, single and multiple', async () => {
    for (const isMultiple of [false, true]) {
      const onSubmit = vi.fn();
      const { getByTestId, getByText, queryByText, unmount } = render(
        OptionListHarness,
        { props: { inForm: true, name: 'bank', isMultiple, onSubmit } }
      );
      await fireEvent.click(getByTestId('continue'));
      await flush();
      expect(onSubmit).not.toHaveBeenCalled();
      expect(getByText('msg:required')).toBeTruthy();

      await fireEvent.click(getByTestId('banks-0'));
      await flush();
      expect(queryByText('msg:required')).toBeNull();
      await fireEvent.click(getByTestId('continue'));
      await flush();
      const hdfc = { code: 'hdfc', name: 'HDFC Bank' };
      expect(onSubmit.mock.calls[0][0]).toEqual({
        bank: isMultiple ? [hdfc] : hdfc,
      });
      unmount();
    }
  });
});

describe('OptionList keyboard', () => {
  const ring = 'shadow-focus-inset';
  const row = (element: HTMLElement) => element.parentElement as HTMLElement;

  it.each([false, true])(
    'arrows move focus and pick nothing; Enter and Space pick (multiple: %s)',
    async (isMultiple) => {
      const onChange = vi.fn();
      const { getByTestId } = render(OptionListHarness, {
        props: { isMultiple, onChange },
      });
      const first = getByTestId('banks-0');
      first.focus();
      await fireEvent.keyDown(first, { key: 'ArrowDown' });
      expect(document.activeElement).toBe(getByTestId('banks-1'));
      expect(onChange).not.toHaveBeenCalled();
      expect(input(getByTestId('banks-1')).checked).toBe(false);
      expect(row(getByTestId('banks-1')).className).toContain(ring);

      await fireEvent.keyDown(getByTestId('banks-1'), { key: 'Enter' });
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(input(getByTestId('banks-1')).checked).toBe(true);

      await fireEvent.keyDown(getByTestId('banks-1'), { key: 'Home' });
      const space = await fireEvent.keyDown(getByTestId('banks-0'), {
        key: ' ',
      });
      // Handled here, so the platform does not toggle a second time.
      expect(space).toBe(false);
      expect(input(getByTestId('banks-0')).checked).toBe(true);
      expect(input(getByTestId('banks-1')).checked).toBe(isMultiple);
    }
  );

  it('skips disabled options and stops at the ends', async () => {
    const { getByTestId } = render(OptionListHarness);
    getByTestId('banks-1').focus();
    await fireEvent.keyDown(getByTestId('banks-1'), { key: 'ArrowDown' });
    // banks-2 is disabled: there is nowhere further to go.
    expect(document.activeElement).toBe(getByTestId('banks-1'));
    await fireEvent.keyDown(getByTestId('banks-1'), { key: 'End' });
    expect(document.activeElement).toBe(getByTestId('banks-1'));
  });

  it('is one tab stop: the pick, else the first enabled row', async () => {
    const stops = (getByTestId: (id: string) => HTMLElement) =>
      [0, 1, 2].map((i) => input(getByTestId(`banks-${i}`)).tabIndex);
    const fresh = render(OptionListHarness, { props: { isMultiple: true } });
    expect(stops(fresh.getByTestId)).toEqual([0, -1, -1]);
    fresh.unmount();

    const { getByTestId } = render(OptionListHarness, {
      props: { value: { code: 'icici', name: 'ICICI Bank' } },
    });
    expect(stops(getByTestId)).toEqual([-1, 0, -1]);

    // The keyboard moving off the pick does not move the stop: the rows are
    // one radio group, which the browser tabs into at its checked member
    // only — a checked radio at tabindex -1 would make Tab skip the list.
    getByTestId('banks-1').focus();
    await fireEvent.keyDown(getByTestId('banks-1'), { key: 'ArrowUp' });
    expect(document.activeElement).toBe(getByTestId('banks-0'));
    await fireEvent.focusOut(getByTestId('banks-0'));
    expect(stops(getByTestId)).toEqual([-1, 0, -1]);
  });

  it('a multiple list has no checked-radio rule: the stop follows the keyboard', async () => {
    const { getByTestId } = render(OptionListHarness, {
      props: { isMultiple: true },
    });
    getByTestId('banks-0').focus();
    await fireEvent.keyDown(getByTestId('banks-0'), { key: 'ArrowDown' });
    expect(input(getByTestId('banks-1')).tabIndex).toBe(0);
    expect(input(getByTestId('banks-0')).tabIndex).toBe(-1);
  });

  it('draws the ring for the keyboard only, not for a pointer', async () => {
    const { getByTestId } = render(OptionListHarness);
    const second = getByTestId('banks-1');
    await fireEvent.pointerDown(second);
    second.focus();
    await fireEvent.click(second);
    expect(row(second).className).not.toContain(ring);

    await fireEvent.keyDown(second, { key: 'ArrowUp' });
    expect(row(getByTestId('banks-0')).className).toContain(ring);
    // Leaving the list takes the ring with it.
    await fireEvent.focusOut(getByTestId('banks-0'));
    expect(row(getByTestId('banks-0')).className).not.toContain(ring);
  });

  it('leaves Tab and Escape to the page', async () => {
    const { getByTestId } = render(OptionListHarness);
    getByTestId('banks-0').focus();
    expect(
      await fireEvent.keyDown(getByTestId('banks-0'), { key: 'Tab' })
    ).toBe(true);
    expect(
      await fireEvent.keyDown(getByTestId('banks-0'), { key: 'Escape' })
    ).toBe(true);
  });
});

describe('OptionList children', () => {
  it('leaves non-item children out of the options, the value and the keyboard', async () => {
    const { getByTestId, getByRole } = render(OptionListHarness, {
      props: { extras: true },
    });
    // The heading and the button sit between items; indices skip them.
    expect(getByTestId('banks-1')).toBeTruthy();
    const more = getByRole('button', { name: 'All options' });
    getByTestId('banks-0').focus();
    await fireEvent.keyDown(getByTestId('banks-0'), { key: 'ArrowDown' });
    expect(document.activeElement).toBe(getByTestId('banks-1'));
    // The button keeps its own Enter: the list does not take it as a pick.
    more.focus();
    expect(await fireEvent.keyDown(more, { key: 'Enter' })).toBe(true);
    expect(getByTestId('bound').textContent).toBe('none');
  });
});

describe('OptionRow.native', () => {
  it('is a pressable row carrying checked and disabled as attributes', async () => {
    const onToggle = vi.fn(() => true);
    const { container } = render(OptionRowNative, {
      props: {
        isSelected: true,
        isDisabled: false,
        classes: resolveOptionList({}),
        optionState: { checked: 'true' },
        onToggle,
        children: createRawSnippet(() => ({ render: () => '<b>HDFC</b>' })),
      },
    });
    const row = container.firstElementChild as HTMLElement;
    expect(row.tagName).toBe('DIV');
    expect(row.getAttribute('checked')).toBe('true');
    expectClass(row, 'bg-interactive-gray-faded-highlighted');
    await fireEvent.click(row);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
