import { afterEach, describe, it, expect, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import ToastHarness from './fixtures/ToastHarness.svelte';
import { expectClass, expectGlyph, glyphsIn } from './classes';
import { BankIcon } from '../icons';
import { showToast } from '../components/toast/toasts';
import { createCancel } from '../runes/base/cancel';

// The page's queue: unmounting the container clears it between tests.
const toasts = { showToast };
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- RenderResult does not type a prop-less component
const setup = () => render(ToastHarness);

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  delete (window as { matchMedia?: unknown }).matchMedia;
});

/** A phone: the stack collapses past one toast and a tap holds it. */
/** A pointer event from a mouse: only a mouse holds the stack by hovering. */
function mouse(type: 'pointerenter' | 'pointerleave'): Event {
  const event = new Event(type);
  Object.defineProperty(event, 'pointerType', { value: 'mouse' });
  return event;
}

/** The pointerdown that begins a gesture: jsdom has no PointerEvent for it. */
function pointerDown(type: 'mouse' | 'touch'): Event {
  // Bubbling, as a real pointerdown does: Svelte delegates it to the root.
  const event = new Event('pointerdown', { bubbles: true });
  Object.defineProperty(event, 'pointerType', { value: type });
  return event;
}

const wrapper = (toast: HTMLElement): HTMLElement => toast.parentElement!;
const offsetOf = (toast: HTMLElement): string =>
  wrapper(toast).style.getPropertyValue('--toast-offset');

describe('showToast', () => {
  it("icon replaces the colour's glyph", async () => {
    const { getByTestId } = setup();
    void toasts.showToast({ content: 'Paid', duration: 0, leading: BankIcon, testID: 'paid' });
    await waitFor(() => getByTestId('paid'));
    expectGlyph(getByTestId('paid'), BankIcon);
  });

  it('an image leading puts an asset where the glyph goes', async () => {
    const { getByTestId } = setup();
    void toasts.showToast({
      content: 'Paid',
      duration: 0,
      leading: { image: '/hdfc.svg', alt: 'HDFC Bank' },
      testID: 'paid',
    });
    await waitFor(() => getByTestId('paid'));
    const toast = getByTestId('paid');
    const image = toast.firstElementChild?.querySelector('img');
    expect(image?.getAttribute('src')).toBe('/hdfc.svg');
    expect(image?.getAttribute('alt')).toBe('HDFC Bank');
    expect(glyphsIn(toast.firstElementChild)).toHaveLength(0);
  });

  it("spaces the row as Figma's Toast: the content 12px before the trailing controls", async () => {
    const { getByTestId } = setup();
    void toasts.showToast({ content: 'Saved', duration: 0, testID: 'saved' });
    await waitFor(() => getByTestId('saved'));
    const toast = getByTestId('saved');
    expectClass(toast, 'gap-2');
    expectClass(toast.lastElementChild as HTMLElement, 'pl-1');
  });

  it('shows a message in the host, as a status, without taking the page', () => {
    const { getByTestId } = setup();
    void toasts.showToast({ content: 'Card saved', duration: 0, testID: 'saved' });

    return waitFor(() => expect(getByTestId('saved')).toBeTruthy()).then(() => {
      const toast = getByTestId('saved');
      expect(toast.getAttribute('role')).toBe('status');
      // Glyphs are private-use characters, hidden from assistive tech.
      expect(toast.textContent?.replace(/[\uE000-\uF8FF]/g, '').trim()).toBe('Card saved');
      expectClass(toast, 'rounded-medium');
      expectClass(toast, 'shadow-toast-neutral');
      // Blade's glyph for the colour, and its dismiss button.
      expect(glyphsIn(toast)).not.toHaveLength(0);
      expect(toast.querySelector('button')?.getAttribute('aria-label')).toBe('Dismiss toast');
      expect(getByTestId('host-toasts').getAttribute('aria-label')).toBe('Notifications');
      expect(getByTestId('host').contains(toast)).toBe(true);
      expect(getByTestId('page').hasAttribute('inert')).toBe(false);
    });
  });

  it('opens: a toast the stack mounts leaves `closed`', () => {
    const { getByTestId } = setup();
    void toasts.showToast({ content: 'Hi', duration: 0, testID: 'hi' });
    return waitFor(() => expect(getByTestId('hi').dataset.state).toBe('open'));
  });

  it('times out, and says why it left', () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    setup();
    const dismissed = toasts.showToast({
      content: 'Copied',
      duration: 1000,
      onDismiss,
    });
    vi.advanceTimersByTime(1000);
    vi.useRealTimers();
    return dismissed.then((reason) => {
      expect(reason).toBe('timeout');
      expect(onDismiss).toHaveBeenCalledWith('timeout');
    });
  });

  it('a mouse over the stack holds the timers; leaving resumes them', () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    const { getByTestId } = setup();
    void toasts.showToast({ content: 'Copied', duration: 1000, onDismiss });
    const stack = getByTestId('host-toasts');

    return fireEvent(stack, mouse('pointerenter'))
      .then(() => {
        vi.advanceTimersByTime(5000);
        expect(onDismiss).not.toHaveBeenCalled();
        return fireEvent(stack, mouse('pointerleave'));
      })
      .then(() => {
        vi.advanceTimersByTime(1000);
        expect(onDismiss).toHaveBeenCalledWith('timeout');
      });
  });

  it('an action runs and leaves the toast up, as Blade', () => {
    const onClick = vi.fn();
    const { getByRole, getByTestId } = setup();
    void toasts.showToast({
      content: 'Card removed',
      duration: 0,
      action: { text: 'Undo', onClick },
      testID: 'removed',
    });
    return waitFor(() => expect(getByRole('button', { name: 'Undo' })))
      .then(() => fireEvent.click(getByRole('button', { name: 'Undo' })))
      .then(() => {
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(getByTestId('removed')).toBeTruthy();
      });
  });

  it("an action's promise holds it busy until it settles, and a rejection is reported", async () => {
    let settle: (value?: unknown) => void = () => undefined;
    let fail: (error: unknown) => void = () => undefined;
    const onClick = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            settle = resolve;
          }),
      )
      .mockImplementationOnce(
        () =>
          new Promise((_resolve, reject) => {
            fail = reject;
          }),
      );
    const { getByRole } = setup();
    void toasts.showToast({
      content: 'Card removed',
      duration: 0,
      action: { text: 'Undo', onClick },
    });
    const button = await waitFor(() => getByRole('button', { name: 'Undo' }));
    await fireEvent.click(button);
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect((button as HTMLButtonElement).disabled).toBe(true);
    // Busy: a second press does nothing.
    await fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    settle();
    await waitFor(() => expect(button.hasAttribute('aria-busy')).toBe(false));
    await fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(2);
    fail(new Error('offline'));
    await waitFor(() => expect(button.hasAttribute('aria-busy')).toBe(false));
  });

  it('its `cancelled` resolving dismisses it, once; one cancelled already goes at once', async () => {
    const { getByTestId, queryByTestId } = setup();
    const request = createCancel();
    const onDismiss = vi.fn();
    const dismissed = toasts.showToast(
      { content: 'Card removed', duration: 0, testID: 'removed', onDismiss },
      { cancelled: request.cancelled },
    );
    await waitFor(() => getByTestId('removed'));
    request.cancel();
    request.cancel();
    await expect(dismissed).resolves.toBe('dismiss');
    await waitFor(() => expect(queryByTestId('removed')).toBeNull());
    expect(onDismiss).toHaveBeenCalledTimes(1);

    await expect(
      toasts.showToast({ content: 'Late', testID: 'late' }, { cancelled: request.cancelled }),
    ).resolves.toBe('dismiss');
    expect(queryByTestId('late')).toBeNull();
  });

  it('a `cancelled` resolving after the toast left does nothing', async () => {
    const { getByRole } = setup();
    const request = createCancel();
    const onDismiss = vi.fn();
    const dismissed = toasts.showToast(
      { content: 'Saved', duration: 0, testID: 'saved', onDismiss },
      { cancelled: request.cancelled },
    );
    await fireEvent.click(await waitFor(() => getByRole('button', { name: 'Dismiss toast' })));
    await expect(dismissed).resolves.toBe('dismiss');
    request.cancel();
    await new Promise((resolve) => setTimeout(resolve));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('always has a dismiss button, which closes it and reports', () => {
    const onDismissButtonClick = vi.fn();
    const { getByRole, getByTestId } = setup();
    const dismissed = toasts.showToast({
      content: 'Card removed',
      duration: 0,
      onDismissButtonClick,
      testID: 'removed',
    });
    return waitFor(() => expect(getByRole('button', { name: 'Dismiss toast' })))
      .then(() => {
        const close = getByRole('button', { name: 'Dismiss toast' });
        expect(getByTestId('removed').lastElementChild?.lastElementChild).toBe(close);
        return fireEvent.click(close);
      })
      .then(() => dismissed)
      .then((reason) => {
        expect(onDismissButtonClick).toHaveBeenCalledTimes(1);
        expect(reason).toBe('dismiss');
      });
  });

  it('a newer toast evicts the oldest beyond the capacity', () => {
    setup();
    const first = toasts.showToast({ content: '1', duration: 0 });
    void toasts.showToast({ content: '2', duration: 0 });
    void toasts.showToast({ content: '3', duration: 0 });
    void toasts.showToast({ content: '4', duration: 0 });
    return first.then((reason) => expect(reason).toBe('evicted'));
  });

  it('a failure interrupts: negative is an alert', () => {
    const { getByTestId } = setup();
    void toasts.showToast({
      content: 'Payment failed',
      color: 'negative',
      duration: 0,
      testID: 'failed',
    });
    return waitFor(() => expect(getByTestId('failed')).toBeTruthy()).then(() => {
      expect(getByTestId('failed').getAttribute('role')).toBe('alert');
      expect(getByTestId('failed').className).toContain('bg-popup-negative-moderate');
    });
  });

  it("slides in from the stack's edge at Blade's pace and out at its exit pace", () => {
    const { getByTestId } = setup();
    void toasts.showToast({ content: 'Hi', duration: 0, testID: 'hi' });
    return waitFor(() => expect(getByTestId('hi').dataset.state).toBe('open')).then(() => {
      const toast = getByTestId('hi');
      expectClass(toast, 'data-[state=closed]:translate-y-full');
      expectClass(toast, 'data-[state=closed]:opacity-0');
      expectClass(toast, 'data-[state=open]:duration-gentle');
      expectClass(toast, 'data-[state=closed]:duration-moderate');
    });
  });

  it('a mouse over the stack expands it: the older toast sits a gutter above the newest', () => {
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(44);
    const { getByTestId } = setup();
    void toasts.showToast({ content: '1', duration: 0, testID: 'one' });
    void toasts.showToast({ content: '2', duration: 0, testID: 'two' });
    return waitFor(() => expect(offsetOf(getByTestId('one'))).toBe('12'))
      .then(() => fireEvent(getByTestId('host-toasts'), mouse('pointerenter')))
      .then(() => waitFor(() => expect(offsetOf(getByTestId('one'))).toBe('56')))
      .then(() => {
        expect(offsetOf(getByTestId('two'))).toBe('0');
        expectClass(wrapper(getByTestId('one')), 'duration-gentle');
        expect(wrapper(getByTestId('one')).style.getPropertyValue('--toast-scale')).toBe('1');
      });
  });

  it('the rest peek behind the front, smaller, until a tap expands them', () => {
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(44);
    const { getByTestId } = setup();
    void toasts.showToast({ content: '1', duration: 0, testID: 'one' });
    void toasts.showToast({ content: '2', duration: 0, testID: 'two' });
    return waitFor(() => expect(offsetOf(getByTestId('one'))).toBe('12'))
      .then(() => {
        const behind = wrapper(getByTestId('one'));
        expect(behind.style.getPropertyValue('--toast-scale')).toBe('0.95');
        expect(behind.style.getPropertyValue('--toast-height')).toBe('44px');
        return fireEvent.click(getByTestId('host-toasts'));
      })
      .then(() => waitFor(() => expect(offsetOf(getByTestId('one'))).toBe('56')))
      .then(() => {
        expect(wrapper(getByTestId('one')).style.getPropertyValue('--toast-scale')).toBe('1');
      });
  });

  it("a tap expands the stack where the click itself reads as a mouse's", () => {
    // WebKit reports a tap's click as a mouse pointer event, so the
    // pointerdown that began the gesture decides, as the tooltip's does.
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(44);
    const { getByTestId } = setup();
    void toasts.showToast({ content: '1', duration: 0, testID: 'one' });
    void toasts.showToast({ content: '2', duration: 0, testID: 'two' });
    return waitFor(() => expect(offsetOf(getByTestId('one'))).toBe('12'))
      .then(() => fireEvent(getByTestId('host-toasts'), pointerDown('touch')))
      .then(() => fireEvent.click(getByTestId('host-toasts')))
      .then(() => waitFor(() => expect(offsetOf(getByTestId('one'))).toBe('56')));
  });

  it('a mouse click leaves the stack as the hover holds it', () => {
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(44);
    const { getByTestId } = setup();
    void toasts.showToast({ content: '1', duration: 0, testID: 'one' });
    void toasts.showToast({ content: '2', duration: 0, testID: 'two' });
    return waitFor(() => expect(offsetOf(getByTestId('one'))).toBe('12'))
      .then(() => fireEvent(getByTestId('host-toasts'), mouse('pointerenter')))
      .then(() => waitFor(() => expect(offsetOf(getByTestId('one'))).toBe('56')))
      .then(() => fireEvent(getByTestId('host-toasts'), pointerDown('mouse')))
      .then(() => fireEvent.click(getByTestId('host-toasts')))
      .then(() => expect(offsetOf(getByTestId('one'))).toBe('56'));
  });

  it("a tap's compatibility mouse events do not leave the stack it expanded", async () => {
    // iOS Safari follows a tap with mouse events typed 'mouse': a hover that
    // ends when the tap does. The tap it began still holds the stack.
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(44);
    const { getByTestId } = setup();
    void toasts.showToast({ content: '1', duration: 0, testID: 'one' });
    void toasts.showToast({ content: '2', duration: 0, testID: 'two' });
    await waitFor(() => expect(offsetOf(getByTestId('one'))).toBe('12'));

    const stack = getByTestId('host-toasts');
    await fireEvent(stack, pointerDown('touch'));
    await fireEvent.click(stack);
    await fireEvent(stack, mouse('pointerenter'));
    await fireEvent(stack, mouse('pointerleave'));
    await waitFor(() => expect(offsetOf(getByTestId('one'))).toBe('56'));
  });
});

describe('the queue', () => {
  it('a toast shown before any stack mounts waits, its timer held, and shows once one does', async () => {
    const onDismiss = vi.fn();
    void showToast({ content: 'Early', duration: 50, onDismiss, testID: 'early' });
    await new Promise((resolve) => {
      setTimeout(resolve, 80);
    });
    expect(onDismiss).not.toHaveBeenCalled();
    const { findByTestId } = render(ToastHarness);
    expect(await findByTestId('early')).toBeTruthy();
    await waitFor(() => expect(onDismiss).toHaveBeenCalledWith('timeout'));
  });

  it('the page’s `showToast` takes `cancelled` too', () => {
    const request = createCancel();
    request.cancel();
    return expect(showToast('Saved', { cancelled: request.cancelled })).resolves.toBe('dismiss');
  });
});
