import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import SegmentedControlHarness from './fixtures/SegmentedControlHarness.svelte';

// Blade-owned: the preset ships SegmentedControl whole, over the segmented
// RadioGroup. The radios' behaviour is RadioGroup's and is tested there;
// this covers the spelling — names, the pill, the thumb and the size axis.
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));
const input = (element: HTMLElement) => element as HTMLInputElement;
/** The label around one segment's input. */
const segment = (control: HTMLElement) => control.parentElement as HTMLElement;
/** The pill the segments sit in. */
const pill = (control: HTMLElement) =>
  segment(control).parentElement as HTMLElement;

describe('SegmentedControl + SegmentedControlItem (blade)', () => {
  it('is a radiogroup named by its label, of radios named by theirs', () => {
    const { getByRole, getByLabelText, getByTestId, getAllByRole } = render(
      SegmentedControlHarness
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
    expect(onChange).toHaveBeenCalledExactlyOnceWith('card');
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
    expect(
      all.getAllByRole('radio').every((radio) => input(radio).disabled)
    ).toBe(true);
    // Blade fades nothing: each segment takes the disabled text colour.
    expect(segment(all.getByTestId('card')).className).toContain(
      'peer-disabled:text-interactive-gray-disabled'
    );
    all.unmount();

    const { getByTestId } = render(SegmentedControlHarness, {
      props: { disabledValue: 'card' },
    });
    expect(input(getByTestId('card')).disabled).toBe(true);
    expect(input(getByTestId('upi')).disabled).toBe(false);
    expect(segment(getByTestId('card')).className).toContain(
      'peer-disabled:text-interactive-gray-disabled'
    );
  });

  it('an icon sits before the label; alone, it names the segment', () => {
    const labelled = render(SegmentedControlHarness);
    const wallet = labelled.getByTestId('wallet');
    const icon = segment(wallet).querySelector('svg[data-glyph="wallet"]');
    expect(icon).not.toBeNull();
    expect(icon?.parentElement?.getAttribute('aria-hidden')).toBe('true');
    expect(labelled.getByRole('radio', { name: 'Wallet' })).toBe(wallet);
    labelled.unmount();

    const { getByRole, getByTestId } = render(SegmentedControlHarness, {
      props: { iconOnly: true },
    });
    expect(getByRole('radio', { name: 'Wallet' })).toBe(getByTestId('wallet'));
    expect(
      segment(getByTestId('wallet')).querySelector('[role="img"]')
    ).not.toBeNull();
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
    expect(
      pill(getByTestId('upi')).querySelector(':scope > [aria-hidden="true"]')
    ).toBeNull();
  });

  it('size: the pill, its segments and its thumb share one padding', () => {
    const small = render(SegmentedControlHarness, {
      props: { value: 'upi', size: 'small' },
    });
    const upi = small.getByTestId('upi');
    expect(pill(upi).className).toContain('p-0.5');
    expect(pill(upi).firstElementChild?.className).toContain('inset-y-0.5');
    expect(upi.nextElementSibling?.className).toContain('py-0.5');
    small.unmount();

    const { getByTestId } = render(SegmentedControlHarness, {
      props: { value: 'upi' },
    });
    expect(pill(getByTestId('upi')).className).toContain('p-1');
    expect(pill(getByTestId('upi')).firstElementChild?.className).toContain(
      'inset-y-1'
    );
    expect(getByTestId('upi').nextElementSibling?.className).toContain('py-1');
  });

  it('color: neutral tints the track gray; white draws it over a brand pane', () => {
    const neutral = render(SegmentedControlHarness, {
      props: { value: 'upi' },
    });
    const upi = neutral.getByTestId('upi');
    expect(pill(upi).className).toContain('bg-interactive-gray-faded');
    expect(segment(neutral.getByTestId('card')).className).toContain(
      'text-interactive-gray-muted'
    );
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
    expect(segment(getByTestId('card')).className).toContain('text-interactive-static-white-normal');
  });

  it('inside a Form a required control blocks submit, then submits the pick', async () => {
    const onSubmit = vi.fn();
    const { getByTestId, getByText, queryByText } = render(
      SegmentedControlHarness,
      {
        props: { inForm: true, name: 'flow', helpText: 'Choose one', onSubmit },
      }
    );

    await fireEvent.click(getByTestId('continue'));
    await flush();
    expect(onSubmit).not.toHaveBeenCalled();
    const line = getByText('msg:required');
    expect(queryByText('Choose one')).toBeNull();
    const group = getByTestId('group');
    expect(group.getAttribute('aria-invalid')).toBe('true');
    expect(group.getAttribute('aria-required')).toBe('true');
    expect(group.getAttribute('aria-describedby')).toBe(line.id);
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
});
