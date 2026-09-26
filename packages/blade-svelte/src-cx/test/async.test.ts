import { describe, it, expect, vi } from 'vitest';
import { render, waitFor } from '@testing-library/svelte';
import AsyncHarness from './fixtures/AsyncHarness.svelte';
import { expectClass, expectMarkup } from './classes';

function deferred() {
  let resolve: (value: string) => void = () => {};
  let reject: (error: unknown) => void = () => {};
  const promise = new Promise<string>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe('Async', () => {
  it('names the wait, then renders the value', () => {
    const { promise, resolve } = deferred();
    const { getByTestId, queryByTestId } = render(AsyncHarness, {
      props: { promise, pendingDelay: 0 },
    });
    const wait = getByTestId('wait');
    expect(wait.getAttribute('role')).toBe('status');
    expect(wait.getAttribute('aria-label')).toBe('Loading');
    expectClass(wait, 'flex-col');
    expectMarkup(wait, 'animate-skeleton');

    resolve('HDFC');
    return waitFor(() =>
      expect(getByTestId('value').textContent).toBe('HDFC')
    ).then(() => {
      expect(queryByTestId('wait')).toBeNull();
    });
  });

  it('a fast load never shows the pending state', () => {
    vi.useFakeTimers();
    const { promise, resolve } = deferred();
    const { queryByTestId } = render(AsyncHarness, {
      props: { promise, pendingDelay: 200 },
    });
    expect(queryByTestId('wait')).toBeNull();
    vi.advanceTimersByTime(199);
    expect(queryByTestId('wait')).toBeNull();
    resolve('SBI');
    vi.useRealTimers();
    return waitFor(() => expect(queryByTestId('value')).toBeTruthy()).then(
      () => {
        expect(queryByTestId('wait')).toBeNull();
      }
    );
  });

  it('a slow load shows the caller’s pending once the delay passes', () => {
    vi.useFakeTimers();
    const { promise } = deferred();
    const { queryByTestId, getByTestId } = render(AsyncHarness, {
      props: { promise, pendingDelay: 200, withPending: true },
    });
    vi.advanceTimersByTime(200);
    vi.useRealTimers();
    return waitFor(() => expect(queryByTestId('own')).toBeTruthy()).then(() => {
      expect(getByTestId('wait').contains(getByTestId('own'))).toBe(true);
    });
  });

  it('a failure renders `failed` and is reported', () => {
    const onError = vi.fn();
    const captureError = vi.fn();
    const { promise, reject } = deferred();
    const { getByTestId } = render(AsyncHarness, {
      props: { promise, pendingDelay: 0, onError, captureError },
    });
    const failure = new Error('chunk');
    reject(failure);
    return waitFor(() =>
      expect(getByTestId('failed').textContent).toBe('chunk')
    ).then(() => {
      expect(onError).toHaveBeenCalledWith(failure);
      expect(captureError).toHaveBeenCalledWith(failure);
    });
  });

  it('a new promise starts over; the old one can no longer land', () => {
    const first = deferred();
    const second = deferred();
    const { getByTestId, queryByTestId, rerender } = render(AsyncHarness, {
      props: { promise: first.promise, pendingDelay: 0 },
    });
    return rerender({ promise: second.promise, pendingDelay: 0 })
      .then(() => {
        first.resolve('stale');
        second.resolve('fresh');
        return waitFor(() =>
          expect(getByTestId('value').textContent).toBe('fresh')
        );
      })
      .then(() => {
        expect(queryByTestId('wait')).toBeNull();
      });
  });
});
