import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import TextAreaControlNative from '../components/text-area-input/TextAreaControl.native.svelte';
import TextAreaInputHarness from './fixtures/TextAreaInputHarness.svelte';
import { expectClass } from './classes';

describe('TextAreaInput', () => {
  it('renders a labelled textarea with recipe classes and its rows', () => {
    const { getByTestId, getByLabelText } = render(TextAreaInputHarness, {
      props: { numberOfLines: 4, maxCharacters: 120 },
    });
    const control = getByTestId('solo') as HTMLTextAreaElement;

    expect(control.tagName).toBe('TEXTAREA');
    expect(getByLabelText('Delivery notes')).toBe(control);
    // Classes come from the component's own styles.
    expectClass(control, 'rounded-small');
    expectClass(control, 'resize-none');
    expect(control.rows).toBe(4);
    expect(control.maxLength).toBe(120);
  });

  it('resolves the preset classes and appends the caller class last', () => {
    const { getByTestId, container } = render(TextAreaInputHarness, {
      props: { className: 'mt-4' },
    });
    expectClass(getByTestId('solo'), 'min-h-9');
    const root = container.firstElementChild as HTMLElement;
    expect(root.className.endsWith('mt-4')).toBe(true);
  });

  it('paints the value, reports edits and follows outside changes', async () => {
    const onChange = vi.fn();
    const { getByTestId, rerender } = render(TextAreaInputHarness, {
      props: { value: 'Ring twice', onChange },
    });
    const control = getByTestId('solo') as HTMLTextAreaElement;
    expect(control.value).toBe('Ring twice');

    control.value = 'Leave at the door';
    await fireEvent.input(control);
    expect(onChange).toHaveBeenCalledWith('Leave at the door');

    await rerender({ value: 'Call on arrival', onChange });
    expect(control.value).toBe('Call on arrival');
  });

  it('describes the control with the hint line for its validation state', async () => {
    const { getByTestId, getByText, rerender } = render(TextAreaInputHarness, {
      props: { helpText: 'Optional' },
    });
    const control = getByTestId('solo');
    expect(control.getAttribute('aria-describedby')).toBe(
      getByText('Optional').id
    );

    await rerender({ errorText: 'Too long', validationState: 'error' });
    expect(control.getAttribute('aria-describedby')).toBe(
      getByText('Too long').id
    );
    expect(control.getAttribute('aria-invalid')).toBe('true');
    expectClass(control, '!border-interactive-negative-default');
  });

  it('isDisabled disables the control and applies the disabled part to the root', () => {
    const { getByTestId, container } = render(TextAreaInputHarness, {
      props: { isDisabled: true },
    });
    expect((getByTestId('solo') as HTMLTextAreaElement).disabled).toBe(true);
    expectClass(
      container.firstElementChild as HTMLElement,
      'pointer-events-none'
    );
  });
});

// Native maps only `input` to a text view, so the twin degrades the text
// area to a single-line field; everything else is the shared anatomy.
describe('TextAreaControl.native', () => {
  it('renders an input carrying the same wiring', async () => {
    const oninput = vi.fn();
    const { getByTestId } = render(TextAreaControlNative, {
      props: {
        id: 'notes',
        class: 'control',
        value: 'Ring twice',
        numberOfLines: 4,
        isRequired: false,
        isDisabled: false,
        isReadOnly: false,
        maxCharacters: 120,
        isInvalid: false,
        testID: 'native',
        attach: () => {},
        oninput,
        onblur: () => {},
        onfocus: () => {},
      },
    });
    const control = getByTestId('native') as HTMLInputElement;

    expect(control.tagName).toBe('INPUT');
    expect(control.value).toBe('Ring twice');
    expect(control.maxLength).toBe(120);
    await fireEvent.input(control);
    expect(oninput).toHaveBeenCalledTimes(1);
  });
});
