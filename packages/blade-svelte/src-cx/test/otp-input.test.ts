import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import OTPInputHarness from './fixtures/OTPInputHarness.svelte';
import { expectClass } from './classes';

const flush = (): Promise<unknown> => new Promise((resolve) => setTimeout(resolve, 0));

type Queries = { getByTestId: (id: string) => HTMLElement };

const cell = ({ getByTestId }: Queries, index: number): HTMLInputElement =>
  getByTestId(`otp-${index}`) as HTMLInputElement;

const values = (queries: Queries, length: number): string =>
  Array.from({ length }, (_, index) => cell(queries, index).value).join('|');

describe('OTPInput standalone', () => {
  it('renders one named cell per character with recipe classes', () => {
    const queries = render(OTPInputHarness, { props: { otpLength: 4 } });

    expect(queries.container.querySelectorAll('input')).toHaveLength(4);
    // Classes come from the component's own styles.
    expectClass(cell(queries, 0), 'rounded-small');
    expect(cell(queries, 2).getAttribute('aria-label')).toBe('Enter OTP 3');
    expect(queries.getByRole('group', { name: 'Enter OTP' })).toBeTruthy();
  });

  it('resolves the preset classes and appends the caller class last', () => {
    const queries = render(OTPInputHarness, {
      props: { className: 'mx-auto' },
    });
    expectClass(cell(queries, 0), 'h-9');
    const root = queries.container.firstElementChild as HTMLElement;
    expect(root.className.endsWith('mx-auto')).toBe(true);
  });

  it('typing advances focus, reports changes and fires onFilled once full', async () => {
    const onChange = vi.fn();
    const onFilled = vi.fn();
    const queries = render(OTPInputHarness, {
      props: { otpLength: 4, onChange, onFilled },
    });

    for (const [index, digit] of ['1', '2', '3', '4'].entries()) {
      cell(queries, index).focus();
      // eslint-disable-next-line no-await-in-loop -- a user types one digit at a time
      await fireEvent.keyDown(cell(queries, index), { key: digit });
      if (index < 3) {
        expect(document.activeElement).toBe(cell(queries, index + 1));
      }
    }

    expect(values(queries, 4)).toBe('1|2|3|4');
    expect(onChange).toHaveBeenLastCalledWith({ name: 'otp', value: '1234' });
    expect(onFilled).toHaveBeenCalledTimes(1);
    expect(onFilled).toHaveBeenCalledWith({ name: 'otp', value: '1234' });
    expectClass(cell(queries, 0), '');
  });

  it('wipes a rejected character the platform already painted', async () => {
    const onChange = vi.fn();
    const queries = render(OTPInputHarness, { props: { onChange } });

    cell(queries, 0).value = 'x';
    await fireEvent.input(cell(queries, 0));

    expect(cell(queries, 0).value).toBe('');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('an empty commit clears the cell — the only delete native can send', async () => {
    const onChange = vi.fn();
    const queries = render(OTPInputHarness, {
      props: { value: '12', onChange },
    });
    expect(cell(queries, 1).getAttribute('advance')).toBe('next');

    cell(queries, 1).value = '';
    await fireEvent.input(cell(queries, 1));

    expect(values(queries, 3)).toBe('1||');
    expect(onChange).toHaveBeenCalledWith({ name: 'otp', value: '1' });
  });

  it('backspace on an empty cell clears the previous one and retreats', async () => {
    const queries = render(OTPInputHarness, { props: { value: '12' } });

    cell(queries, 2).focus();
    await fireEvent.keyDown(cell(queries, 2), { key: 'Backspace' });

    expect(values(queries, 3)).toBe('1||');
    expect(document.activeElement).toBe(cell(queries, 1));
  });

  it('distributes a paste and tracks how the fill arrived', async () => {
    const track = vi.fn();
    const onFilled = vi.fn();
    const queries = render(OTPInputHarness, {
      props: { otpLength: 4, track, onFilled },
    });

    await fireEvent.paste(cell(queries, 0), {
      clipboardData: { getData: () => '12-34' },
    });

    expect(values(queries, 4)).toBe('1|2|3|4');
    expect(track).toHaveBeenCalledWith('otp_fill', {
      name: 'otp',
      method: 'paste',
    });
    expect(onFilled).toHaveBeenCalledWith({ name: 'otp', value: '1234' });
  });

  it('spreads an outside value without firing onChange or stealing focus', async () => {
    const onChange = vi.fn();
    const onFilled = vi.fn();
    const queries = render(OTPInputHarness, {
      props: { otpLength: 4, onChange, onFilled },
    });

    await queries.rerender({ otpLength: 4, onChange, onFilled, value: '9876' });

    expect(values(queries, 4)).toBe('9|8|7|6');
    expect(onChange).not.toHaveBeenCalled();
    // An auto-read still completes the code.
    expect(onFilled).toHaveBeenCalledWith({ name: 'otp', value: '9876' });
    expect(queries.container.contains(document.activeElement)).toBe(false);
  });

  it('Tab at the last cell leaves the group instead of trapping focus', async () => {
    const queries = render(OTPInputHarness, { props: { otpLength: 4 } });

    cell(queries, 1).focus();
    expect(await fireEvent.keyDown(cell(queries, 1), { key: 'Tab' })).toBe(false);
    expect(document.activeElement).toBe(cell(queries, 2));

    cell(queries, 3).focus();
    // Not cancelled: the browser moves focus out.
    expect(await fireEvent.keyDown(cell(queries, 3), { key: 'Tab' })).toBe(true);
  });

  it('isMasked hides the characters', () => {
    const queries = render(OTPInputHarness, { props: { isMasked: true } });
    expect(cell(queries, 0).type).toBe('password');
  });

  it('describes the group with the hint and marks cells invalid', async () => {
    const queries = render(OTPInputHarness, {
      props: { helpText: 'Sent by SMS' },
    });
    const group = queries.getByRole('group');
    expect(group.getAttribute('aria-describedby')).toBe(
      queries.getByText('Sent by SMS').closest('[id]')?.id,
    );

    await queries.rerender({
      errorText: 'Wrong OTP',
      validationState: 'error',
    });
    const error = queries.getByText('Wrong OTP');
    expect(group.getAttribute('aria-describedby')).toBe(error.closest('[id]')?.id);
    expect(cell(queries, 0).getAttribute('aria-invalid')).toBe('true');
    expectClass(cell(queries, 0), 'border-interactive-negative-default!');
    expectClass(error, 'text-feedback-negative-intense');
  });

  it('isDisabled disables every cell and applies the disabled part to the root', () => {
    const queries = render(OTPInputHarness, { props: { isDisabled: true } });
    expect(cell(queries, 0).disabled).toBe(true);
    expectClass(queries.container.firstElementChild as HTMLElement, 'pointer-events-none');
  });
});

describe('OTPInput in a Form', () => {
  it('blocks a partial code, then submits the full one under its name', async () => {
    const onSubmit = vi.fn();
    const queries = render(OTPInputHarness, {
      props: { inForm: true, otpLength: 4, isRequired: true, onSubmit },
    });

    await fireEvent.paste(cell(queries, 0), {
      clipboardData: { getData: () => '12' },
    });
    await fireEvent.click(queries.getByTestId('go'));
    await flush();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(queries.getByText('pattern')).toBeTruthy();

    await fireEvent.paste(cell(queries, 2), {
      clipboardData: { getData: () => '34' },
    });
    await flush();
    expect(queries.queryByText('pattern')).toBeNull();

    await fireEvent.click(queries.getByTestId('go'));
    await flush();
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toEqual({ otp: '1234' });
  });
});
