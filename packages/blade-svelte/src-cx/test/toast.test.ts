import { afterEach, describe, it, expect, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import type { Toasts } from '../components/toast/toasts';
import ToastHarness from './fixtures/ToastHarness.svelte';
import { expectClass } from './classes';

function setup() {
  let toasts: Toasts | undefined;
  const view = render(ToastHarness, {
    props: {
      onReady: (ready: Toasts) => {
        toasts = ready;
      },
    },
  });
  return { ...view, toasts: toasts as Toasts };
}

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  delete (window as { matchMedia?: unknown }).matchMedia;
});

/** A phone: the stack collapses past one toast and a tap holds it. */
function phone(matches: boolean) {
  (window as { matchMedia?: unknown }).matchMedia = (query: string) => ({
    query,
    matches,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  });
}

const wrapper = (toast: HTMLElement) => toast.parentElement as HTMLElement;
const offsetOf = (toast: HTMLElement) =>
  wrapper(toast).style.getPropertyValue('--toast-offset');

describe('showToast', () => {
  it('shows a message in the host, as a status, without taking the page', () => {
    const { toasts, getByTestId } = setup();
    toasts.showToast({ message: 'Card saved', duration: 0, testID: 'saved' });

    return waitFor(() => expect(getByTestId('saved')).toBeTruthy()).then(() => {
      const toast = getByTestId('saved');
      expect(toast.getAttribute('role')).toBe('status');
      expect(toast.textContent?.trim()).toBe('Card saved');
      expectClass(toast, 'rounded-small');
      // No dismiss button without a name for it.
      expect(toast.querySelector('button')).toBeNull();
      expect(getByTestId('toasts').getAttribute('aria-label')).toBe(
        'Notifications'
      );
      expect(getByTestId('host').contains(toast)).toBe(true);
      expect(getByTestId('page').hasAttribute('inert')).toBe(false);
    });
  });

  it('opens: a toast the stack mounts leaves `closed`', () => {
    const { toasts, getByTestId } = setup();
    toasts.showToast({ message: 'Hi', duration: 0, testID: 'hi' });
    return waitFor(() => expect(getByTestId('hi').dataset.state).toBe('open'));
  });

  it('times out, and says why it left', () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    const { toasts } = setup();
    const handle = toasts.showToast({
      message: 'Copied',
      duration: 1000,
      onDismiss,
    });
    vi.advanceTimersByTime(1000);
    vi.useRealTimers();
    return handle.dismissed.then((reason) => {
      expect(reason).toBe('timeout');
      expect(onDismiss).toHaveBeenCalledWith('timeout');
    });
  });

  it('hover holds the timers; leaving resumes them', () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    const { toasts, getByTestId } = setup();
    toasts.showToast({ message: 'Copied', duration: 1000, onDismiss });
    const stack = getByTestId('toasts');

    return fireEvent
      .pointerEnter(stack)
      .then(() => {
        vi.advanceTimersByTime(5000);
        expect(onDismiss).not.toHaveBeenCalled();
        return fireEvent.pointerLeave(stack);
      })
      .then(() => {
        vi.advanceTimersByTime(1000);
        expect(onDismiss).toHaveBeenCalledWith('timeout');
      });
  });

  it('an action runs and dismisses', () => {
    const onPress = vi.fn();
    const { toasts, getByRole } = setup();
    const handle = toasts.showToast({
      message: 'Card removed',
      duration: 0,
      action: { label: 'Undo', onPress },
    });
    return waitFor(() => expect(getByRole('button', { name: 'Undo' })))
      .then(() => fireEvent.click(getByRole('button', { name: 'Undo' })))
      .then(() => handle.dismissed)
      .then((reason) => {
        expect(onPress).toHaveBeenCalledTimes(1);
        expect(reason).toBe('dismiss');
      });
  });

  it('a named dismiss button closes it, after a hairline', () => {
    const { toasts, getByRole, getByTestId } = setup();
    const handle = toasts.showToast({
      message: 'Card removed',
      duration: 0,
      closeLabel: 'Dismiss',
      testID: 'removed',
    });
    return waitFor(() => expect(getByRole('button', { name: 'Dismiss' })))
      .then(() => {
        const close = getByRole('button', { name: 'Dismiss' });
        expectClass(close.previousElementSibling, 'w-px');
        expectClass(close, 'w-4');
        expect(getByTestId('removed').lastElementChild).toBe(close);
        return fireEvent.click(close);
      })
      .then(() => handle.dismissed)
      .then((reason) => expect(reason).toBe('dismiss'));
  });

  it('a newer toast evicts the oldest beyond the capacity', () => {
    const { toasts } = setup();
    const first = toasts.showToast({ message: '1', duration: 0 });
    toasts.showToast({ message: '2', duration: 0 });
    toasts.showToast({ message: '3', duration: 0 });
    toasts.showToast({ message: '4', duration: 0 });
    return first.dismissed.then((reason) => expect(reason).toBe('evicted'));
  });

  it('a failure interrupts: negative is an alert', () => {
    const { toasts, getByTestId } = setup();
    toasts.showToast({
      message: 'Payment failed',
      color: 'negative',
      duration: 0,
      testID: 'failed',
    });
    return waitFor(() => expect(getByTestId('failed')).toBeTruthy()).then(
      () => {
        expect(getByTestId('failed').getAttribute('role')).toBe('alert');
        expect(getByTestId('failed').className).toContain('bg-popup-negative-moderate');
      }
    );
  });

  it("slides in from the stack's edge at Blade's pace and out at its exit pace", () => {
    const { toasts, getByTestId } = setup();
    toasts.showToast({ message: 'Hi', duration: 0, testID: 'hi' });
    return waitFor(() =>
      expect(getByTestId('hi').dataset.state).toBe('open')
    ).then(() => {
      const toast = getByTestId('hi');
      expectClass(toast, 'data-[state=closed]:translate-y-full');
      expectClass(toast, 'data-[state=closed]:opacity-0');
      expectClass(toast, 'data-[state=open]:duration-gentle');
      expectClass(toast, 'data-[state=closed]:duration-moderate');
    });
  });

  it('on desktop a short stack is expanded: the older toast sits a gutter above the newest', () => {
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(44);
    const { toasts, getByTestId } = setup();
    toasts.showToast({ message: '1', duration: 0, testID: 'one' });
    toasts.showToast({ message: '2', duration: 0, testID: 'two' });
    return waitFor(() => expect(offsetOf(getByTestId('one'))).toBe('56')).then(
      () => {
        expect(offsetOf(getByTestId('two'))).toBe('0');
        expectClass(wrapper(getByTestId('one')), 'duration-gentle');
        expect(
          wrapper(getByTestId('one')).style.getPropertyValue('--toast-scale')
        ).toBe('1');
      }
    );
  });

  it('on a phone the rest peek behind the front, smaller, until a tap expands them', () => {
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(44);
    phone(true);
    const { toasts, getByTestId } = setup();
    toasts.showToast({ message: '1', duration: 0, testID: 'one' });
    toasts.showToast({ message: '2', duration: 0, testID: 'two' });
    return waitFor(() => expect(offsetOf(getByTestId('one'))).toBe('12'))
      .then(() => {
        const behind = wrapper(getByTestId('one'));
        expect(behind.style.getPropertyValue('--toast-scale')).toBe('0.95');
        expect(behind.style.getPropertyValue('--toast-height')).toBe('44px');
        return fireEvent.click(getByTestId('toasts'));
      })
      .then(() =>
        waitFor(() => expect(offsetOf(getByTestId('one'))).toBe('56'))
      )
      .then(() => {
        expect(
          wrapper(getByTestId('one')).style.getPropertyValue('--toast-scale')
        ).toBe('1');
      });
  });
});
