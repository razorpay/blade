import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import SegmentedControlHarness from './fixtures/SegmentedControlHarness.svelte';
import { glyphsIn } from './classes';
import { WalletIcon } from '../icons';
import { createRawSnippet } from 'svelte';
import SegmentedControlItem from '../components/segmented-control/SegmentedControlItem.svelte';

// Blade-owned: the preset ships SegmentedControl whole, over the segmented
// RadioGroup. The radios' behaviour is RadioGroup's and is tested there;
// this covers the spelling — names, the pill, the thumb and the size axis.
const flush = (): Promise<unknown> => new Promise((resolve) => setTimeout(resolve, 0));
const input = (element: HTMLElement): HTMLInputElement => element as HTMLInputElement;
/** The label around one segment's input. */
const segment = (control: HTMLElement): HTMLElement => control.parentElement!;
/** The pill the segments sit in. */
const pill = (control: HTMLElement): HTMLElement => segment(control).parentElement!;

describe('SegmentedControl + SegmentedControlItem (blade)', () => {
  it('is a radiogroup named by its label, of radios named by theirs', () => {
    const { getByRole, getByLabelText, getByTestId, getAllByRole } = render(
      SegmentedControlHarness,
    );
    const group = getByRole('radiogroup', { name: 'Pay via' });
    expect(group).toBe(getByTestId('group'));
    expect(group.className.endsWith('mt-2')).toBe(true);
    expect(getAllByRole('radio')).toHaveLength(3);
    expect(getByLabelText('UPI')).toBe(getByTestId('upi'));
    const name = input(getByTestId('upi')).name;
    expect(name).not.toBe('');
    expect(input(getByTestId('wallet')).name).toBe(name);
  });

  it('a click picks: onChange and the bound value follow', async () => {
    const onChange = vi.fn();
    const { getByTestId } = render(SegmentedControlHarness, {
      props: { onChange },
    });
    await fireEvent.click(getByTestId('card'));
    expect(onChange).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ value: 'card' }));
    expect(getByTestId('bound').textContent).toBe('card');
    expect(input(getByTestId('card')).checked).toBe(true);
    expect(input(getByTestId('upi')).checked).toBe(false);
  });

  it('follows a value the host drives', async () => {
    const { getByTestId, rerender } = render(SegmentedControlHarness, {
      props: { value: 'upi' },
    });
    expect(input(getByTestId('upi')).checked).toBe(true);
    await rerender({ value: 'wallet' });
    expect(input(getByTestId('wallet')).checked).toBe(true);
    expect(input(getByTestId('upi')).checked).toBe(false);
  });

  it('a disabled control disables every segment; one can be disabled alone', () => {
    const all = render(SegmentedControlHarness, {
      props: { isDisabled: true },
    });
    expect(all.getAllByRole('radio').every((radio) => input(radio).disabled)).toBe(true);
    // Blade fades nothing: each segment takes the disabled text colour.
    expect(segment(all.getByTestId('card')).className).toContain(
      'peer-disabled:text-interactive-gray-disabled',
    );
    all.unmount();

    const { getByTestId } = render(SegmentedControlHarness, {
      props: { disabledValue: 'card' },
    });
    expect(input(getByTestId('card')).disabled).toBe(true);
    expect(input(getByTestId('upi')).disabled).toBe(false);
    expect(segment(getByTestId('card')).className).toContain(
      'peer-disabled:text-interactive-gray-disabled',
    );
  });

  it('an icon sits before the label; alone, it names the segment', () => {
    const labelled = render(SegmentedControlHarness);
    const wallet = labelled.getByTestId('wallet');
    const [icon] = glyphsIn(segment(wallet), WalletIcon);
    expect(icon).toBeTruthy();
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(labelled.getByRole('radio', { name: 'Wallet' })).toBe(wallet);
    labelled.unmount();

    const { getByRole, getByTestId } = render(SegmentedControlHarness, {
      props: { iconOnly: true },
    });
    expect(getByRole('radio', { name: 'Wallet' })).toBe(getByTestId('wallet'));
    expect(segment(getByTestId('wallet')).querySelector('[role="img"]')).not.toBeNull();
  });

  it('the pick is a thumb, not a segment style', async () => {
    const { getByTestId } = render(SegmentedControlHarness, {
      props: { value: 'upi' },
    });
    const upi = getByTestId('upi');
    const card = getByTestId('card');
    const thumb = pill(upi).firstElementChild as HTMLElement;
    expect(thumb).not.toBe(segment(upi));
    expect(thumb.getAttribute('aria-hidden')).toBe('true');
    expect(thumb.style.getPropertyValue('--segment-index')).toBe('0');
    expect(thumb.style.getPropertyValue('--segment-count')).toBe('3');
    expect(thumb.className).toContain('bg-surface-gray-intense');
    expect(segment(upi).className).not.toContain('bg-surface-gray-intense');
    expect(segment(upi).className).not.toContain('hover:bg-interactive-gray-default');
    expect(segment(card).className).toContain('hover:bg-interactive-gray-default');

    await fireEvent.click(card);
    expect(pill(upi).firstElementChild).toBe(thumb);
    expect(thumb.style.getPropertyValue('--segment-index')).toBe('1');
    expect(segment(card).className).not.toContain('hover:bg-interactive-gray-default');
  });

  it('draws no thumb while nothing is picked', () => {
    const { getByTestId } = render(SegmentedControlHarness);
    expect(pill(getByTestId('upi')).querySelector(':scope > [aria-hidden="true"]')).toBeNull();
  });

  it("size: Figma's track, segment height, radius and type", () => {
    for (const [size, height, text, radius, inset, thumb] of [
      ['small', 'h-6', 'text-100', 'rounded-xsmall', 'p-0.5', 'inset-y-0.5'],
      ['medium', 'h-7', 'text-100', 'rounded-xsmall', 'p-1', 'inset-y-1'],
      ['large', 'h-10', 'text-200', 'rounded-small', 'p-1', 'inset-y-1'],
    ] as const) {
      const view = render(SegmentedControlHarness, { props: { value: 'upi', size } });
      const upi = view.getByTestId('upi');
      // The track 2px in at small, 4px otherwise; the thumb on the same inset.
      expect(pill(upi).className).toContain(inset);
      expect(pill(upi).firstElementChild?.className).toContain(thumb);
      const label = upi.nextElementSibling!.className;
      expect(label).toContain(height);
      expect(label).toContain(text);
      expect(label).toContain(radius);
      view.unmount();
    }
  });

  it('color: neutral tints the track gray; white draws it over a brand pane', () => {
    const neutral = render(SegmentedControlHarness, {
      props: { value: 'upi' },
    });
    const upi = neutral.getByTestId('upi');
    expect(pill(upi).className).toContain('bg-interactive-gray-faded');
    expect(segment(neutral.getByTestId('card')).className).toContain('text-interactive-gray-muted');
    neutral.unmount();

    const { getByTestId } = render(SegmentedControlHarness, {
      props: { value: 'upi', color: 'white' },
    });
    const track = pill(getByTestId('upi'));
    expect(track.className).toContain('bg-interactive-static-white-faded');
    expect(track.className).not.toContain('bg-interactive-gray-faded');
    // The thumb stays white, and the pick on it dark; the rest goes white.
    expect(track.firstElementChild?.className).toContain('bg-surface-gray-intense');
    expect(segment(getByTestId('upi')).className).toContain('text-interactive-gray-normal');
    expect(segment(getByTestId('card')).className).toContain(
      'text-interactive-static-white-normal',
    );
  });

  it('inside a Form a required control blocks submit, then submits the pick', async () => {
    const onSubmit = vi.fn();
    const { getByTestId, getByText, queryByText } = render(SegmentedControlHarness, {
      props: { inForm: true, name: 'flow', helpText: 'Choose one', onSubmit },
    });

    await fireEvent.click(getByTestId('continue'));
    await flush();
    expect(onSubmit).not.toHaveBeenCalled();
    const line = getByText('msg:required');
    expect(queryByText('Choose one')).toBeNull();
    const group = getByTestId('group');
    expect(group.getAttribute('aria-invalid')).toBe('true');
    expect(group.getAttribute('aria-required')).toBe('true');
    expect(group.getAttribute('aria-describedby')).toBe(line.closest('[id]')?.id);
    expect(line.className).toContain('text-feedback-negative-intense');

    await fireEvent.click(getByTestId('card'));
    await flush();
    expect(queryByText('msg:required')).toBeNull();
    expect(getByText('Choose one')).toBeTruthy();

    await fireEvent.click(getByTestId('continue'));
    await flush();
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toEqual({ flow: 'card' });
  });

  it('a segment is one row: leading asset, label, trailing item', () => {
    const leading = createRawSnippet(() => ({ render: () => '<img data-testid="logo" alt="" />' }));
    const children = createRawSnippet(() => ({ render: () => '<span data-testid="text">UPI</span>' }));
    const trailing = createRawSnippet(() => ({ render: () => '<span data-testid="count">3</span>' }));
    const { getByTestId } = render(SegmentedControlItem, {
      props: { value: 'upi', leading, children, trailing },
    });
    const logo = getByTestId('logo');
    expect(logo.parentElement!.className).toContain('w-4 h-4');
    const row = logo.parentElement!.parentElement!;
    expect(row.contains(getByTestId('text'))).toBe(true);
    expect(row.lastElementChild).toBe(getByTestId('count'));
  });
});
