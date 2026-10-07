import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import type { FormatRule } from '../runes/text-input/format';
import { InfoIcon } from '../icons';
import TextInputHarness from './fixtures/TextInputHarness.svelte';
import { expectClass, expectNoClass } from './classes';

const digits = (v: unknown): string => String(v ?? '').replace(/\D/g, '');
const grouped = (v: unknown): string => digits(v).replace(/(\d{4})(?=\d)/g, '$1 ');
const cardFormat = { parse: digits, format: grouped };

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
      props: { value: '41112222', format: cardFormat },
    });
    const control = getByTestId('solo') as HTMLInputElement;
    expect(control.value).toBe('4111 2222');

    await rerender({ value: '411122223', format: cardFormat });
    expect(control.value).toBe('4111 2222 3');
  });

  it('reports the parsed value through onChange', async () => {
    const onChange = vi.fn();
    const { getByTestId } = render(TextInputHarness, {
      props: { onChange, format: cardFormat },
    });
    const control = getByTestId('solo') as HTMLInputElement;

    control.value = '41112';
    await fireEvent.input(control);

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ value: '41112' }));
    expect(control.value).toBe('4111 2');
  });

  it('declarative rules format like functions and ride along for native', async () => {
    const parse: FormatRule[] = [['\\D', 'g', '']];
    const format: FormatRule[] = [
      ['\\D', 'g', ''],
      ['(\\d{4})(?=\\d)', 'g', '$1 '],
    ];
    const onChange = vi.fn();
    const { getByTestId } = render(TextInputHarness, {
      props: { format: { parse, format }, onChange, maxCharacters: 19 },
    });
    const control = getByTestId('solo') as HTMLInputElement;

    control.value = '41112';
    await fireEvent.input(control);
    expect(control.value).toBe('4111 2');
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ value: '41112' }));

    // Native reads the serialized spec; web ignores it.
    expect(JSON.parse(control.getAttribute('format') ?? '')).toEqual({
      p: parse,
      f: format,
    });
    expect(control.maxLength).toBe(19);
  });

  it('writes the cap as camelCase maxLength, the spelling native reads', () => {
    const written = vi.spyOn(Element.prototype, 'setAttribute');
    const { getByTestId } = render(TextInputHarness, {
      props: { maxCharacters: 9 },
    });
    // Svelte lowercases attribute names on HTML elements, which native
    // drops; on web both spellings are the same attribute.
    expect(written.mock.calls.map(([name]) => name)).toContain('maxLength');
    expect((getByTestId('solo') as HTMLInputElement).maxLength).toBe(9);
    written.mockRestore();
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

  it('function formatters send no spec', () => {
    const { getByTestId } = render(TextInputHarness, {
      props: { format: cardFormat },
    });
    expect(getByTestId('solo').hasAttribute('format')).toBe(false);
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
    expectClass(control.parentElement, '!border-interactive-negative-default');
    expectClass(error, 'text-feedback-negative-intense');

    await rerender({ ...texts, validationState: 'success' });
    expectClass(getByText('Good'), 'text-feedback-positive-intense');
    // Blade keeps the gray border on success: only the hint turns positive.
    expectClass(control.parentElement, 'border-interactive-gray-default');
    expectNoClass(control.parentElement, '!border-interactive-positive-default');
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
    expectClass(getByTestId('solo').parentElement, '!bg-surface-gray-moderate');
  });

  it.each([
    // size, height, box padding, text inset, leading gap, icon/prefix inset, trailing gap, trailing inset, glyph
    ['small', 'min-h-8', 'px-1', 'pl-1', 'gap-0.5', 'pl-1', 'ms-0.5', 'pr-1', 'w-3 h-3'],
    ['medium', 'min-h-9', 'px-1', 'pl-2', 'gap-2', 'pl-2', 'ms-2', 'pr-2', 'w-4 h-4'],
    ['large', 'min-h-12', 'px-1', 'pl-2', 'gap-2', 'pl-2', 'ms-2', 'pr-2', 'w-5 h-5'],
  ] as const)(
    "%s: Figma's slots — glyphs and text 8/12px in, a selector on the 4px padding",
    (size, height, pad, textInset, leadingGap, iconInset, trailingGap, trailingInset, glyph) => {
      const { getByTestId, getByText } = render(TextInputHarness, {
        props: {
          size,
          accessibilityLabel: 'Amount',
          leadingIcon: InfoIcon,
          prefix: '₹',
          withLeadingSnippet: true,
          suffix: '.00',
          trailingIcon: InfoIcon,
          withTrailingSnippet: true,
        },
      });
      const control = getByTestId('solo');
      const box = control.parentElement!;
      expectClass(box, height);
      expectClass(box, pad);
      expectClass(box, 'whitespace-nowrap');
      expectClass(control, textInset);
      const [leadingGroup, , trailingGroup] = [...box.children] as HTMLElement[];
      expectClass(leadingGroup, leadingGap);
      const [icon, prefix, slot] = [...leadingGroup.children] as HTMLElement[];
      expectClass(icon, iconInset);
      expectClass(icon.firstElementChild as HTMLElement, glyph);
      expect(prefix).toBe(getByText('₹'));
      expectClass(prefix, iconInset === 'pl-1' ? 'pl-0.5' : 'pl-2');
      // The selector slot carries no inset of its own.
      expect(slot.className).not.toMatch(/\bpl-/);
      expect(slot.contains(getByTestId('picker'))).toBe(true);
      expectClass(trailingGroup, trailingGap);
      for (const item of trailingGroup.children) expectClass(item as HTMLElement, trailingInset);
      expect(getByText('.00').parentElement).toBe(trailingGroup);
    },
  );

  it('removes xsmall, which Figma does not draw', async () => {
    const { TEXT_INPUT_AXES } = await import('../components/text-input/styles');
    expect(TEXT_INPUT_AXES.size).toEqual(['small', 'medium', 'large']);
  });
});
