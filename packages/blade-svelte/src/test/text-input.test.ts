import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, within } from '@testing-library/svelte';
import { InfoIcon } from '../icons';
import TextInputHarness from './fixtures/TextInputHarness.svelte';
import { expectClass, expectNoClass } from './classes';

const digits = (v: unknown): string => String(v ?? '').replace(/\D/g, '');
const grouped = (v: unknown): string => digits(v).replace(/(\d{4})(?=\d)/g, '$1 ');
const cardTransform = { parse: digits, format: grouped };

describe('TextInput standalone', () => {
  it('renders recipe classes and associates the label with the control', () => {
    const { getByTestId, getByLabelText } = render(TextInputHarness, {
      props: { label: 'Card number' },
    });

    const control = getByTestId('solo');
    // Classes come from the component's own styles.
    // The box is the drawn field; the control inside it has no frame.
    expectClass(control.parentElement, 'rounded-small');
    expectNoClass(control, 'rounded-small');
    expect(getByLabelText('Card number')).toBe(control);
  });

  it('resolves the style classes and appends the caller class last', () => {
    const { getByTestId, container } = render(TextInputHarness, {
      props: { className: 'mt-4' },
    });
    expectClass(getByTestId('solo').parentElement, 'min-h-9');
    const root = container.firstElementChild as HTMLElement;
    expect(root.className.endsWith('mt-4')).toBe(true);
  });

  it('accessibilityLabel names the control only without a visible label', () => {
    const { getByTestId, rerender } = render(TextInputHarness, {
      props: { accessibilityLabel: 'Card number' },
    });
    expect(getByTestId('solo').getAttribute('aria-label')).toBe('Card number');

    return rerender({ label: 'Card', accessibilityLabel: 'Card number' }).then(() => {
      expect(getByTestId('solo').getAttribute('aria-label')).toBeNull();
    });
  });

  it('paints the formatted value first and follows outside value changes', async () => {
    const { getByTestId, rerender } = render(TextInputHarness, {
      props: { value: '41112222', transform: cardTransform },
    });
    const control = getByTestId('solo') as HTMLInputElement;
    expect(control.value).toBe('4111 2222');

    await rerender({ value: '411122223', transform: cardTransform });
    expect(control.value).toBe('4111 2222 3');
  });

  it('reports the parsed value through onChange', async () => {
    const onChange = vi.fn();
    const { getByTestId } = render(TextInputHarness, {
      props: { onChange, transform: cardTransform },
    });
    const control = getByTestId('solo') as HTMLInputElement;

    control.value = '41112';
    await fireEvent.input(control);

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ value: '41112' }));
    expect(control.value).toBe('4111 2');
  });

  it("format is Blade's `#` pattern: the formatted value and the raw one", async () => {
    const onChange = vi.fn();
    const { getByTestId, container, rerender } = render(TextInputHarness, {
      props: { format: '#### #### #### ####', onChange, maxCharacters: 40 },
    });
    const control = getByTestId('solo') as HTMLInputElement;
    // The pattern caps the length and hides the counter.
    expect(control.maxLength).toBe(19);
    expect(container.textContent).not.toContain('/40');

    control.value = '41112';
    await fireEvent.input(control);
    expect(control.value).toBe('4111 2');
    expect(onChange).toHaveBeenLastCalledWith({
      name: undefined,
      value: '4111 2',
      rawValue: '41112',
    });

    // An outside value is laid into the pattern too.
    await rerender({ format: '#### #### #### ####', value: '4111222233334444' });
    expect(control.value).toBe('4111 2222 3333 4444');
  });

  it('caps the characters with maxlength', () => {
    const { getByTestId } = render(TextInputHarness, { props: { maxCharacters: 9 } });
    expect((getByTestId('solo') as HTMLInputElement).maxLength).toBe(9);
  });

  it('prefix and the trailing snippet sit inside the box label', () => {
    const { getByText, getByTestId, getByLabelText } = render(TextInputHarness, {
      props: { label: 'Amount', prefix: '₹', withTrailingSnippet: true },
    });
    expectClass(getByText('₹'), 'items-center');
    expectClass(getByTestId('clear').parentElement, 'items-center');
    // The box is a label, so a click on an affix lands in the control…
    const control = getByTestId('solo') as HTMLInputElement;
    expect(getByText('₹').closest('label')?.control).toBe(control);
    // …while the accessible name stays the visible label alone.
    expect(getByLabelText('Amount')).toBe(control);
    expect(control.getAttribute('aria-labelledby')).toBe(getByText('Amount').closest('[id]')?.id);
  });

  it('takes the HTML keyboard attributes, over the defaults its type brings', async () => {
    const { getByTestId, rerender } = render(TextInputHarness, {
      props: { type: 'tel', accessibilityLabel: 'Phone' },
    });
    const control = getByTestId('solo');
    expect(control.getAttribute('type')).toBe('tel');
    expect(control.getAttribute('inputmode')).toBeNull();
    expect(control.getAttribute('enterkeyhint')).toBe('done');
    expect(control.getAttribute('autocomplete')).toBe('tel');

    await rerender({ type: 'email' });
    expect(control.getAttribute('autocomplete')).toBe('email');
    expect(control.getAttribute('autocapitalize')).toBe('none');

    await rerender({ type: 'url', autoComplete: undefined });
    expect(control.getAttribute('enterkeyhint')).toBe('go');
    expect(control.getAttribute('autocomplete')).toBeNull();

    // A plain text field adds nothing; what the caller gives wins.
    await rerender({
      type: 'text',
      inputMode: 'numeric',
      enterKeyHint: 'next',
      autoComplete: 'cc-number',
    });
    expect(control.getAttribute('inputmode')).toBe('numeric');
    expect(control.getAttribute('enterkeyhint')).toBe('next');
    expect(control.getAttribute('autocomplete')).toBe('cc-number');
    expect(control.getAttribute('autocapitalize')).toBeNull();
  });

  it("renders a type outside the union as text and says so once: Blade 0.x's telephone", async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { getByTestId, rerender } = render(TextInputHarness, {
      props: { type: 'telephone' as 'tel', accessibilityLabel: 'Phone' },
    });
    const control = getByTestId('solo');
    expect(control.getAttribute('type')).toBe('text');
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain('type="telephone"');
    expect(warn.mock.calls[0][0]).toContain('"tel"');
    await rerender({ type: 'telephone' as 'tel', autoComplete: 'off' });
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it('renders number as text with the decimal keypad, as Blade', () => {
    const { getByTestId } = render(TextInputHarness, {
      props: { type: 'number', accessibilityLabel: 'Amount' },
    });
    const control = getByTestId('solo');
    expect(control.getAttribute('type')).toBe('text');
    expect(control.getAttribute('inputmode')).toBe('decimal');
    expect(control.getAttribute('enterkeyhint')).toBe('done');
  });

  it('shows focus on the box, which holds the affixes', async () => {
    const { getByTestId, getByText } = render(TextInputHarness, {
      props: { prefix: '₹' },
    });
    const control = getByTestId('solo');
    const box = control.parentElement;
    expect(getByText('₹').closest('label')).toBe(box);
    expectNoClass(box, 'outline-surface-primary-muted');

    await fireEvent.focus(control);
    expectClass(box, 'outline-surface-primary-muted');
    await fireEvent.blur(control);
    expectNoClass(box, 'outline-surface-primary-muted');
  });

  it('describes the control with the line for its validation state', async () => {
    const texts = { helpText: 'Help', errorText: 'Bad', successText: 'Good' };
    const { getByTestId, getByText, queryByText, rerender } = render(TextInputHarness, {
      props: texts,
    });
    const control = getByTestId('solo');

    expect(control.getAttribute('aria-describedby')).toBe(getByText('Help').closest('[id]')?.id);
    expect(control.getAttribute('aria-invalid')).toBeNull();
    expect(queryByText('Bad')).toBeNull();

    await rerender({ ...texts, validationState: 'error' });
    const error = getByText('Bad');
    expect(queryByText('Help')).toBeNull();
    expect(control.getAttribute('aria-describedby')).toBe(error.closest('[id]')?.id);
    expect(control.getAttribute('aria-invalid')).toBe('true');
    expectClass(control.parentElement, 'border-interactive-negative-default!');
    expectClass(error, 'text-feedback-negative-intense');

    await rerender({ ...texts, validationState: 'success' });
    expectClass(getByText('Good'), 'text-feedback-positive-intense');
    // Blade keeps the gray border on success: only the hint turns positive.
    expectClass(control.parentElement, 'border-interactive-gray-default');
    expectNoClass(control.parentElement, 'border-interactive-positive-default!');
    expect(control.getAttribute('aria-invalid')).toBeNull();
  });

  it('the help text stands in for a state with no text of its own', async () => {
    const { getByText, rerender } = render(TextInputHarness, {
      props: { helpText: 'Help', validationState: 'error' },
    });
    expectClass(getByText('Help'), 'text-feedback-negative-intense');
    await rerender({ helpText: 'Help', validationState: 'success' });
    expectClass(getByText('Help'), 'text-feedback-positive-intense');
  });

  it('isDisabled disables the control and applies the disabled part to the root', () => {
    const { getByTestId, container } = render(TextInputHarness, {
      props: { isDisabled: true },
    });
    expect((getByTestId('solo') as HTMLInputElement).disabled).toBe(true);
    expectClass(container.firstElementChild as HTMLElement, 'pointer-events-none');
    expectClass(getByTestId('solo').parentElement, 'bg-surface-gray-moderate!');
  });

  it.each([
    // height, box padding, text inset, leading gap, icon/prefix inset, trailing gap, trailing inset, glyph
    {
      size: 'small',
      height: 'min-h-8',
      pad: 'px-1',
      textInset: 'pl-1',
      leadingGap: 'gap-0.5',
      iconInset: 'pl-1',
      trailingGap: 'ms-0.5',
      trailingInset: 'pr-1',
      glyph: 'w-3 h-3',
    },
    {
      size: 'medium',
      height: 'min-h-9',
      pad: 'px-1',
      textInset: 'pl-2',
      leadingGap: 'gap-2',
      iconInset: 'pl-2',
      trailingGap: 'ms-2',
      trailingInset: 'pr-2',
      glyph: 'w-4 h-4',
    },
    {
      size: 'large',
      height: 'min-h-12',
      pad: 'px-1',
      textInset: 'pl-2',
      leadingGap: 'gap-2',
      iconInset: 'pl-2',
      trailingGap: 'ms-2',
      trailingInset: 'pr-2',
      glyph: 'w-5 h-5',
    },
  ] as const)(
    "$size: Figma's slots — glyphs and text 8/12px in, a selector on the 4px padding",
    ({
      size,
      height,
      pad,
      textInset,
      leadingGap,
      iconInset,
      trailingGap,
      trailingInset,
      glyph,
    }) => {
      // `leading` and `trailing` as icons: the glyph comes first, before
      // `prefix`, and last, after `suffix`.
      const glyphs = render(TextInputHarness, {
        props: {
          size,
          accessibilityLabel: 'Amount',
          leadingIcon: InfoIcon,
          prefix: '₹',
          suffix: '.00',
          trailingIcon: InfoIcon,
        },
      });
      const control = within(glyphs.container).getByTestId('solo');
      const box = control.parentElement!;
      expectClass(box, height);
      expectClass(box, pad);
      expectClass(box, 'whitespace-nowrap');
      expectClass(control, textInset);
      const [leadingGroup, , trailingGroup] = [...box.children] as HTMLElement[];
      expectClass(leadingGroup, leadingGap);
      const [icon, prefix] = [...leadingGroup.children] as HTMLElement[];
      expectClass(icon, iconInset);
      expectClass(icon.firstElementChild as HTMLElement, glyph);
      expect(prefix).toBe(within(glyphs.container).getByText('₹'));
      expectClass(prefix, iconInset === 'pl-1' ? 'pl-0.5' : 'pl-2');
      expectClass(trailingGroup, trailingGap);
      for (const item of trailingGroup.children) expectClass(item as HTMLElement, trailingInset);
      expect(within(glyphs.container).getByText('.00').parentElement).toBe(trailingGroup);

      // As snippets: the selector slot comes after `prefix`.
      const slots = render(TextInputHarness, {
        props: {
          size,
          accessibilityLabel: 'Amount',
          prefix: '₹',
          withLeadingSnippet: true,
          withTrailingSnippet: true,
        },
      });
      const scope = within(slots.container);
      const slotGroup = scope.getByTestId('solo').parentElement!.firstElementChild as HTMLElement;
      const [slotPrefix, slot] = [...slotGroup.children] as HTMLElement[];
      expect(slotPrefix).toBe(scope.getByText('₹'));
      // The selector slot carries no inset of its own.
      expect(slot.className).not.toMatch(/\bpl-/);
      expect(slot.contains(scope.getByTestId('picker'))).toBe(true);
    },
  );

  it('removes xsmall, which Figma does not draw', async () => {
    const { TEXT_INPUT_AXES } = await import('../components/text-input/styles');
    expect(TEXT_INPUT_AXES.size).toEqual(['small', 'medium', 'large']);
  });
});
