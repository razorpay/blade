import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi, afterEach } from 'vitest';
import ModalFocusTestHarness from './ModalFocusTestHarness.svelte';

/* Spy on the prototype so the focus call is captured regardless of when the
 * target element mounts (the modal portals + defers focus across two rAFs). */
function spyOnFocus(): ReturnType<typeof vi.spyOn> {
  return vi.spyOn(HTMLElement.prototype, 'focus');
}

/* Find the options arg of the focus() call made against a specific element. */
function focusOptionsFor(spy: ReturnType<typeof vi.spyOn>, el: Element): FocusOptions | undefined {
  const idx = spy.mock.contexts.indexOf(el);
  if (idx === -1) return undefined;
  return spy.mock.calls[idx][0] as FocusOptions | undefined;
}

afterEach(() => {
  vi.restoreAllMocks();
  document.body.querySelectorAll('[data-testid="outside"]').forEach((el) => el.remove());
});

/* jsdom has no layout engine — offsetParent is always null. The component's
 * focusable-elements filter treats offsetParent !== null as "visible", so
 * stub it for elements the trap needs to consider on-screen. */
function stubVisible(el: HTMLElement): void {
  Object.defineProperty(el, 'offsetParent', { get: () => document.body, configurable: true });
}

describe('<Modal /> focus management', () => {
  it('focuses the initial element with preventScroll on open', async () => {
    const focusSpy = spyOnFocus();
    render(ModalFocusTestHarness, { props: { isOpen: true } });

    const focusTarget = await screen.findByTestId('focus-target');

    await waitFor(() => expect(focusSpy.mock.contexts).toContain(focusTarget));
    expect(focusOptionsFor(focusSpy, focusTarget)).toEqual({ preventScroll: true });
  });

  it('returns focus to the trigger with preventScroll on dismiss via Escape', async () => {
    const onDismiss = vi.fn();
    const { rerender } = render(ModalFocusTestHarness, {
      props: { isOpen: false, onDismiss },
    });

    const trigger = screen.getByTestId('trigger');
    trigger.focus();

    const focusSpy = spyOnFocus();
    await rerender({ isOpen: true, onDismiss });

    const focusTarget = await screen.findByTestId('focus-target');
    await waitFor(() => expect(focusSpy.mock.contexts).toContain(focusTarget));

    await fireEvent.keyDown(window, { key: 'Escape' });

    await waitFor(() => expect(onDismiss).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(focusSpy.mock.contexts).toContain(trigger));
    expect(focusOptionsFor(focusSpy, trigger)).toEqual({ preventScroll: true });
  });

  it('returns focus to the trigger when isOpen is flipped to false directly (controlled)', async () => {
    const { rerender } = render(ModalFocusTestHarness, { props: { isOpen: false } });

    const trigger = screen.getByTestId('trigger');
    trigger.focus();

    const focusSpy = spyOnFocus();
    await rerender({ isOpen: true });

    const focusTarget = await screen.findByTestId('focus-target');
    await waitFor(() => expect(focusSpy.mock.contexts).toContain(focusTarget));

    /* Parent closes the modal directly, without going through onDismiss. */
    await rerender({ isOpen: false });

    await waitFor(() => expect(focusSpy.mock.contexts).toContain(trigger));
    expect(focusOptionsFor(focusSpy, trigger)).toEqual({ preventScroll: true });
  });

  it('does nothing on Escape when not dismissible', async () => {
    const onDismiss = vi.fn();
    render(ModalFocusTestHarness, {
      props: { isOpen: true, isDismissible: false, onDismiss },
    });

    await screen.findByTestId('focus-target');
    await fireEvent.keyDown(window, { key: 'Escape' });

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('wraps Tab from the last focusable back to the first', async () => {
    render(ModalFocusTestHarness, { props: { isOpen: true } });

    const focusTarget = await screen.findByTestId('focus-target');
    const second = screen.getByTestId('second-focusable');
    stubVisible(focusTarget);
    stubVisible(second);
    await waitFor(() => expect(document.activeElement).toBe(focusTarget));

    second.focus();

    await fireEvent.keyDown(window, { key: 'Tab' });
    expect(document.activeElement).toBe(focusTarget);
  });

  it('wraps Shift+Tab from the first focusable back to the last', async () => {
    render(ModalFocusTestHarness, { props: { isOpen: true } });

    const focusTarget = await screen.findByTestId('focus-target');
    const second = screen.getByTestId('second-focusable');
    stubVisible(focusTarget);
    stubVisible(second);
    await waitFor(() => expect(document.activeElement).toBe(focusTarget));

    await fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(second);
  });

  it('marks background elements inert (or aria-hidden) while open, and restores them on close', async () => {
    const outside = document.createElement('button');
    outside.setAttribute('data-testid', 'outside');
    document.body.appendChild(outside);

    const supportsInert = 'inert' in HTMLElement.prototype;

    const { rerender } = render(ModalFocusTestHarness, { props: { isOpen: true } });
    await screen.findByTestId('focus-target');

    await waitFor(() => {
      if (supportsInert) {
        expect((outside as HTMLElement & { inert: boolean }).inert).toBe(true);
      } else {
        expect(outside.getAttribute('aria-hidden')).toBe('true');
      }
    });

    await rerender({ isOpen: false });

    await waitFor(() => {
      if (supportsInert) {
        expect((outside as HTMLElement & { inert: boolean }).inert).toBe(false);
      } else {
        expect(outside.hasAttribute('aria-hidden')).toBe(false);
      }
    });
  });

  it('warns when accessibilityLabel is missing while open', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(ModalFocusTestHarness, { props: { isOpen: true, accessibilityLabel: '' } });

    await screen.findByTestId('focus-target');
    await waitFor(() =>
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('accessibilityLabel is required for Modal'),
      ),
    );
  });
});
