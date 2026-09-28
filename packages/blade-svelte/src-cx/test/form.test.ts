import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import FieldOrderHarness from './fixtures/FieldOrderHarness.svelte';
import FormHarness from './fixtures/FormHarness.svelte';
import { expectClass, expectMarkup } from './classes';

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('Form + TextInput + Button', () => {
  it('blocks an invalid submit: error text, shake, onValidationFailed, no onSubmit', async () => {
    const onSubmit = vi.fn();
    const onValidationFailed = vi.fn();
    const { getByTestId, getByText } = render(FormHarness, {
      props: {
        onSubmit,
        onValidationFailed,
        formatConstraintError: (code: string) => `msg:${code}`,
      },
    });

    await fireEvent.click(getByTestId('pay'));
    await flush();

    expect(onSubmit).not.toHaveBeenCalled();
    expect(onValidationFailed).toHaveBeenCalledWith({
      'card.number': 'msg:required',
    });
    expect(getByText('msg:required')).toBeTruthy();
    await waitFor(() => {
      expectClass(getByTestId('pay'), 'animate-shake');
    });
  });

  it('follows a swapped formatConstraintError and labels the form', async () => {
    const { getByTestId, getByText, getByRole, rerender } = render(
      FormHarness,
      {
        props: {
          accessibilityLabel: 'Card details',
          formatConstraintError: (code: string) => `en:${code}`,
        },
      }
    );
    expect(getByRole('form', { name: 'Card details' })).toBeTruthy();

    await rerender({
      accessibilityLabel: 'Card details',
      formatConstraintError: (code: string) => `hi:${code}`,
    });
    await fireEvent.click(getByTestId('pay'));
    await flush();

    expect(getByText('hi:required')).toBeTruthy();
  });

  it('submits valid data exactly once with nested names', async () => {
    const onSubmit = vi.fn();
    const { container, getByTestId } = render(FormHarness, {
      props: { onSubmit },
    });

    const input = container.querySelector('input')!;
    input.value = '4111';
    input.selectionStart = input.selectionEnd = 4;
    await fireEvent.input(input);

    await fireEvent.click(getByTestId('pay'));
    await flush();

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toEqual({ card: { number: '4111' } });
  });

  it('submit button mirrors form submission busy state automatically', async () => {
    let resolveSubmit!: () => void;
    const onSubmit = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve;
        })
    );
    const { container, getByTestId } = render(FormHarness, {
      props: { onSubmit },
    });

    const input = container.querySelector('input')!;
    input.value = '4111';
    await fireEvent.input(input);

    const button = getByTestId('pay') as HTMLButtonElement;
    await fireEvent.click(button);

    // No isLoading wiring in the harness: the button derives busy from the
    // form model's `submitting` while onSubmit's promise is pending.
    await waitFor(() => {
      expect(button.getAttribute('aria-busy')).toBe('true');
    });
    expectMarkup(button, 'animate-dot');

    resolveSubmit();
    await waitFor(() => {
      expect(button.getAttribute('aria-busy')).toBeNull();
    });
  });

  it('an invalid Enter submit reports to the same Form handler', async () => {
    const onSubmit = vi.fn();
    const onValidationFailed = vi.fn();
    const { container } = render(FormHarness, {
      props: { onSubmit, onValidationFailed },
    });

    await fireEvent.submit(container.querySelector('form')!);
    await flush();

    expect(onSubmit).not.toHaveBeenCalled();
    expect(onValidationFailed).toHaveBeenCalledWith({
      'card.number': 'required',
    });
  });

  it('Enter in a field submits through the model, not the browser', async () => {
    const onSubmit = vi.fn();
    const { container } = render(FormHarness, { props: { onSubmit } });

    const input = container.querySelector('input')!;
    input.value = '4111';
    await fireEvent.input(input);
    await fireEvent.submit(container.querySelector('form')!);
    await flush();

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('formats the control and restores the caret on a mid-string edit', async () => {
    const parse = (v: unknown) => String(v ?? '').replace(/\D/g, '');
    const format = (v: unknown) => parse(v).replace(/(\d{4})(?=\d)/g, '$1 ');
    const { container } = render(FormHarness, {
      props: { format: { parse, format } },
    });

    const input = container.querySelector('input')!;
    input.value = '4111 2222';
    input.selectionStart = input.selectionEnd = 9;
    await fireEvent.input(input);

    input.value = '4111 52222';
    input.selectionStart = input.selectionEnd = 6;
    await fireEvent.input(input);

    expect(input.value).toBe('4111 5222 2');
    expect(input.selectionStart).toBe(6);
  });

  it('a field that mounts late is revealed by its place in the document, not by when it registered', async () => {
    const onReveal = vi.fn();
    const { container, rerender } = render(FieldOrderHarness, {
      props: { onReveal },
    });
    // `email` mounts after `phone` registered, but sits before it.
    await rerender({ onReveal, showFirst: true });
    await fireEvent.submit(container.querySelector('form')!);
    await waitFor(() => expect(onReveal).toHaveBeenCalled());
    expect(onReveal.mock.calls[0]?.[0]).toBe('email');
  });
});
