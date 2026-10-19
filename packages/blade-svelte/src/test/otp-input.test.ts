import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import OTPInputHarness from './fixtures/OTPInputHarness.svelte';
import { expectClass } from './classes';

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
    expect(onChange).toHaveBeenLastCalledWith({ name: 'otp', value: '1234', method: 'typed' });
    expect(onFilled).toHaveBeenCalledTimes(1);
    expect(onFilled).toHaveBeenCalledWith({ name: 'otp', value: '1234', method: 'typed' });
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

  it('an empty commit clears the cell', async () => {
    const onChange = vi.fn();
    const queries = render(OTPInputHarness, {
      props: { value: '12', onChange },
    });
    cell(queries, 1).value = '';
    await fireEvent.input(cell(queries, 1));

    expect(values(queries, 3)).toBe('1||');
    expect(onChange).toHaveBeenCalledWith({ name: 'otp', value: '1', method: 'typed' });
  });

  it('backspace on an empty cell clears the previous one and retreats', async () => {
    const onChange = vi.fn();
    const queries = render(OTPInputHarness, { props: { value: '12', onChange } });

    cell(queries, 2).focus();
    await fireEvent.keyDown(cell(queries, 2), { key: 'Backspace' });

    expect(values(queries, 3)).toBe('1||');
    expect(document.activeElement).toBe(cell(queries, 1));
    expect(onChange).toHaveBeenCalledWith({ name: 'otp', value: '1', method: 'typed' });
  });

  it('reports a platform autofill commit as autofill', async () => {
    const onChange = vi.fn();
    const onFilled = vi.fn();
    const queries = render(OTPInputHarness, {
      props: { otpLength: 4, onChange, onFilled },
    });

    cell(queries, 0).value = '4321';
    await fireEvent.input(cell(queries, 0));

    expect(values(queries, 4)).toBe('4|3|2|1');
    expect(onChange).toHaveBeenCalledWith({ name: 'otp', value: '4321', method: 'autofill' });
    expect(onFilled).toHaveBeenCalledWith({ name: 'otp', value: '4321', method: 'autofill' });
  });

  it('distributes a paste and tracks how the fill arrived', async () => {
    const track = vi.fn();
    const onChange = vi.fn();
    const onFilled = vi.fn();
    const queries = render(OTPInputHarness, {
      props: { otpLength: 4, track, onChange, onFilled },
    });

    await fireEvent.paste(cell(queries, 0), {
      clipboardData: { getData: () => '12-34' },
    });

    expect(values(queries, 4)).toBe('1|2|3|4');
    expect(track).toHaveBeenCalledWith('otp_fill', {
      name: 'otp',
      method: 'paste',
    });
    expect(onChange).toHaveBeenCalledWith({ name: 'otp', value: '1234', method: 'paste' });
    expect(onFilled).toHaveBeenCalledWith({ name: 'otp', value: '1234', method: 'paste' });
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
    // An app's own write still completes the code.
    expect(onFilled).toHaveBeenCalledWith({ name: 'otp', value: '9876', method: 'value' });
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

  describe('adapters.readOTP', () => {
    type Request = { length: number; cancelled: Promise<void> };
    const deferred = (): {
      promise: Promise<string | undefined>;
      resolve: (code: string | undefined) => void;
      reject: (error: unknown) => void;
    } => {
      let resolve!: (code: string | undefined) => void, reject!: (error: unknown) => void;
      const promise = new Promise<string | undefined>((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return { promise, resolve, reject };
    };
    const flush = (): Promise<unknown> => new Promise((resolve) => setTimeout(resolve));
    // Whether a request's `cancelled` has resolved, as of the last flush.
    const watch = (request: Request): { cancelled: boolean } => {
      const seen = { cancelled: false };
      void request.cancelled.then(() => {
        seen.cancelled = true;
      });
      return seen;
    };

    it('fills the cells as a paste does, and tracks the fill without the code', async () => {
      const read = deferred();
      const readOTP = vi.fn((_request: Request) => read.promise);
      const onChange = vi.fn();
      const onFilled = vi.fn();
      const track = vi.fn();
      const queries = render(OTPInputHarness, {
        props: { otpLength: 4, readOTP, onChange, onFilled, track },
      });
      expect(readOTP).toHaveBeenCalledTimes(1);
      expect(readOTP.mock.calls[0][0].length).toBe(4);

      read.resolve('12-345');
      await flush();

      expect(values(queries, 4)).toBe('1|2|3|4');
      expect(onChange).toHaveBeenLastCalledWith({ name: 'otp', value: '1234', method: 'adapter' });
      expect(onFilled).toHaveBeenCalledWith({ name: 'otp', value: '1234', method: 'adapter' });
      expect(track).toHaveBeenCalledWith('otp_fill', { name: 'otp', method: 'adapter' });
      expect(JSON.stringify(track.mock.calls)).not.toContain('1234');
      expect(queries.container.contains(document.activeElement)).toBe(false);
    });

    it('cancels on unmount, and ignores the late result', async () => {
      const read = deferred();
      const readOTP = vi.fn((_request: Request) => read.promise);
      const onChange = vi.fn();
      const queries = render(OTPInputHarness, { props: { readOTP, onChange } });
      const request = watch(readOTP.mock.calls[0][0]);

      queries.unmount();
      await flush();
      expect(request.cancelled).toBe(true);
      read.resolve('123456');
      await flush();
      expect(onChange).not.toHaveBeenCalled();
    });

    it('ignores a rejection after the cancel', async () => {
      const read = deferred();
      const reportError = vi.fn();
      const queries = render(OTPInputHarness, {
        props: { readOTP: () => read.promise, reportError },
      });
      queries.unmount();
      read.reject(new Error('AbortError'));
      await flush();
      expect(reportError).not.toHaveBeenCalled();
    });

    it('waits while disabled, and cancels when the field is disabled', async () => {
      const readOTP = vi.fn((_request: Request) => new Promise<undefined>(() => undefined));
      const queries = render(OTPInputHarness, { props: { readOTP, isDisabled: true } });
      expect(readOTP).not.toHaveBeenCalled();

      await queries.rerender({ isDisabled: false });
      expect(readOTP).toHaveBeenCalledTimes(1);
      const request = watch(readOTP.mock.calls[0][0]);
      await queries.rerender({ isDisabled: true });
      await flush();
      expect(request.cancelled).toBe(true);
    });

    it('cancels once the user edits the cells, and ignores a late code', async () => {
      const read = deferred();
      const readOTP = vi.fn((_request: Request) => read.promise);
      const queries = render(OTPInputHarness, { props: { otpLength: 4, readOTP } });
      const request = watch(readOTP.mock.calls[0][0]);

      // A move between cells is not an edit.
      await fireEvent.keyDown(cell(queries, 0), { key: 'ArrowRight' });
      await flush();
      expect(request.cancelled).toBe(false);
      await fireEvent.keyDown(cell(queries, 0), { key: '7' });
      await flush();
      expect(request.cancelled).toBe(true);

      read.resolve('1234');
      await flush();
      expect(values(queries, 4)).toBe('7|||');
    });

    it('asks again when the owner resets the value to empty', async () => {
      const reads = [deferred(), deferred()];
      const readOTP = vi.fn((_request: Request) => reads[readOTP.mock.calls.length - 1].promise);
      const onChange = vi.fn();
      const queries = render(OTPInputHarness, { props: { otpLength: 4, readOTP, onChange } });

      reads[0].resolve('1234');
      await flush();
      expect(readOTP).toHaveBeenCalledTimes(1);

      // A resend: the owner clears the field for the next code.
      await queries.rerender({ value: '' });
      expect(values(queries, 4)).toBe('|||');
      expect(readOTP).toHaveBeenCalledTimes(2);

      reads[1].resolve('5678');
      await flush();
      expect(values(queries, 4)).toBe('5|6|7|8');
      expect(onChange).toHaveBeenLastCalledWith({ name: 'otp', value: '5678', method: 'adapter' });
    });

    it('asks again on a reset after the user took over, once the field is enabled', async () => {
      const readOTP = vi.fn((_request: Request) => new Promise<undefined>(() => undefined));
      const queries = render(OTPInputHarness, { props: { otpLength: 4, readOTP } });
      await fireEvent.keyDown(cell(queries, 0), { key: '7' });

      await queries.rerender({ isDisabled: true });
      await queries.rerender({ value: '' });
      expect(readOTP).toHaveBeenCalledTimes(1);
      await queries.rerender({ isDisabled: false });
      expect(readOTP).toHaveBeenCalledTimes(2);
    });

    it('does not ask again when the user clears the cells by hand', async () => {
      const readOTP = vi.fn((_request: Request) => new Promise<undefined>(() => undefined));
      const onChange = vi.fn();
      const queries = render(OTPInputHarness, { props: { otpLength: 4, readOTP, onChange } });

      await fireEvent.keyDown(cell(queries, 0), { key: '7' });
      await fireEvent.keyDown(cell(queries, 0), { key: 'Backspace' });
      expect(onChange).toHaveBeenLastCalledWith({ name: 'otp', value: '', method: 'typed' });
      // The owner mirroring that change back is not a reset.
      await queries.rerender({ value: '' });
      await flush();
      expect(readOTP).toHaveBeenCalledTimes(1);
    });

    it('keeps a pending request through a reset instead of asking twice', async () => {
      const read = deferred();
      const readOTP = vi.fn((_request: Request) => read.promise);
      const queries = render(OTPInputHarness, { props: { otpLength: 4, readOTP } });
      const request = watch(readOTP.mock.calls[0][0]);

      // Owner writes, not user edits: the request stays live.
      await queries.rerender({ value: '12' });
      await queries.rerender({ value: '' });
      await flush();
      expect(readOTP).toHaveBeenCalledTimes(1);
      expect(request.cancelled).toBe(false);

      read.resolve('9999');
      await flush();
      expect(values(queries, 4)).toBe('9|9|9|9');
    });

    it('ignores an undefined result', async () => {
      const onChange = vi.fn();
      const track = vi.fn();
      const queries = render(OTPInputHarness, {
        props: { readOTP: () => Promise.resolve(undefined), onChange, track },
      });
      await flush();
      expect(values(queries, 6)).toBe('|||||');
      expect(onChange).not.toHaveBeenCalled();
      expect(track).not.toHaveBeenCalledWith('otp_fill', expect.anything());
    });

    it('sends a rejection to reportError', async () => {
      const error = new Error('no SMS');
      const reportError = vi.fn();
      render(OTPInputHarness, {
        props: { readOTP: () => Promise.reject(error), reportError },
      });
      await flush();
      expect(reportError).toHaveBeenCalledWith(error);
    });
  });
});
