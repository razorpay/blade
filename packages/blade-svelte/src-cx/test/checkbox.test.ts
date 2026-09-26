import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import CheckboxHarness from './fixtures/CheckboxHarness.svelte';
import { expectClass, expectMarkup, expectNoClass } from './classes';

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));
const indicator = (control: HTMLElement) =>
  control.nextElementSibling as HTMLElement;
const mark = (indicatorEl: HTMLElement) =>
  indicatorEl.firstElementChild as HTMLElement;

describe('Checkbox standalone', () => {
  it('renders recipe classes and is named by its children', () => {
    const { getByTestId, getByLabelText } = render(CheckboxHarness);

    const control = getByTestId('solo');
    // Classes come from the component's own styles.
    expectClass(control, 'sr-only');
    expect(getByLabelText('I agree')).toBe(control);
  });

  it('hides the input and draws the state on the indicator', async () => {
    const { getByTestId } = render(CheckboxHarness, {
      props: { isChecked: true },
    });
    const box = indicator(getByTestId('solo'));
    expect(box.getAttribute('aria-hidden')).toBe('true');
    expectClass(box, 'bg-interactive-primary-default');
    // Blade's checked border is the primary border token, not transparent.
    expectClass(box, 'border-interactive-primary-default');
    expectClass(mark(box), 'opacity-1300');
    expectMarkup(mark(box), '<svg');

    await fireEvent.click(getByTestId('solo'));
    expectNoClass(box, 'bg-interactive-primary-default');
    expectClass(box, 'border-interactive-gray-highlighted');
    expectClass(mark(box), 'opacity-0');
  });

  it('resolves the style classes and appends the caller class last', () => {
    const { getByTestId, container } = render(CheckboxHarness, {
      props: { className: 'mt-4' },
    });
    expectClass(indicator(getByTestId('solo')), 'w-4');
    const root = container.firstElementChild as HTMLElement;
    expect(root.className.endsWith('mt-4')).toBe(true);
  });

  it('accessibilityLabel names the control only without children', async () => {
    const { getByTestId, rerender } = render(CheckboxHarness, {
      props: { withLabel: false, accessibilityLabel: 'Agree' },
    });
    expect(getByTestId('solo').getAttribute('aria-label')).toBe('Agree');

    await rerender({ withLabel: true, accessibilityLabel: 'Agree' });
    expect(getByTestId('solo').getAttribute('aria-label')).toBeNull();
  });

  it('starts from isChecked and reports toggles through onChange', async () => {
    const onChange = vi.fn();
    const { getByTestId } = render(CheckboxHarness, {
      props: { isChecked: true, onChange },
    });
    const control = getByTestId('solo') as HTMLInputElement;
    expect(control.checked).toBe(true);

    await fireEvent.click(control);
    expect(control.checked).toBe(false);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('follows isChecked changes from the outside', async () => {
    const { getByTestId, rerender } = render(CheckboxHarness, {
      props: { isChecked: false },
    });
    const control = getByTestId('solo') as HTMLInputElement;
    expect(control.checked).toBe(false);

    await rerender({ isChecked: true });
    expect(control.checked).toBe(true);
  });

  it('isDisabled disables the control and refuses synthetic toggles', async () => {
    const onChange = vi.fn();
    const { getByTestId, container } = render(CheckboxHarness, {
      props: { isDisabled: true, onChange },
    });
    const control = getByTestId('solo') as HTMLInputElement;
    expect(control.disabled).toBe(true);
    expectClass(
      container.firstElementChild as HTMLElement,
      'pointer-events-none'
    );

    // Browsers suppress the toggle on a disabled control; synthetic
    // dispatch does not — the model's gate mirrors the platform.
    control.checked = true;
    await fireEvent.change(control);
    expect(control.checked).toBe(false);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('describes the control with the hint line for its validation state', async () => {
    const { getByTestId, getByText, rerender } = render(CheckboxHarness, {
      props: { helpText: 'Help' },
    });
    const control = getByTestId('solo');
    expect(control.getAttribute('aria-describedby')).toBe(getByText('Help').id);
    expect(control.getAttribute('aria-invalid')).toBeNull();

    await rerender({ errorText: 'Required', validationState: 'error' });
    const error = getByText('Required');
    expect(control.getAttribute('aria-describedby')).toBe(error.id);
    expect(control.getAttribute('aria-invalid')).toBe('true');
    expectClass(indicator(control), 'border-interactive-negative-default');
    expectClass(error, 'text-feedback-negative-intense');
  });
});

describe('Checkbox in a Form', () => {
  it('a required checkbox blocks submit and mirrors its form error', async () => {
    const onSubmit = vi.fn();
    const { getByTestId, getByText, queryByText } = render(CheckboxHarness, {
      props: { inForm: true, isRequired: true, onSubmit },
    });
    // Quiet until a submit attempt.
    expect(queryByText('required')).toBeNull();

    await fireEvent.click(getByTestId('go'));
    await flush();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(getByText('required')).toBeTruthy();
    expect(getByTestId('solo').getAttribute('aria-invalid')).toBe('true');

    await fireEvent.click(getByTestId('solo'));
    await flush();
    expect(queryByText('required')).toBeNull();
  });

  it('submits the parsed value under its name', async () => {
    const onSubmit = vi.fn();
    const { getByTestId } = render(CheckboxHarness, {
      props: { inForm: true, onSubmit, parse: Number },
    });

    await fireEvent.click(getByTestId('solo'));
    await fireEvent.click(getByTestId('go'));
    await flush();

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toEqual({ consent: 1 });
  });
});
