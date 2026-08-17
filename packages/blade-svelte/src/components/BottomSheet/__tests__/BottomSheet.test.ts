import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi, afterEach } from 'vitest';
import BottomSheetFocusTestHarness from './BottomSheetFocusTestHarness.svelte';

/* Spy on the prototype so the focus call is captured regardless of when the
 * target element mounts (the sheet portals + defers focus across two rAFs). */
function spyOnFocus(): ReturnType<typeof vi.spyOn> {
  return vi.spyOn(HTMLElement.prototype, 'focus');
}

/* Find the options arg of the focus() call made against a specific element. */
function focusOptionsFor(
  spy: ReturnType<typeof vi.spyOn>,
  el: Element,
): FocusOptions | undefined {
  const idx = spy.mock.contexts.indexOf(el);
  if (idx === -1) return undefined;
  return spy.mock.calls[idx][0] as FocusOptions | undefined;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('<BottomSheet /> focus management', () => {
  it('focuses the initial element with preventScroll on open', async () => {
    const focusSpy = spyOnFocus();
    render(BottomSheetFocusTestHarness, { props: { isOpen: true } });

    const focusTarget = await screen.findByTestId('focus-target');

    await waitFor(() => expect(focusSpy.mock.contexts).toContain(focusTarget));
    expect(focusOptionsFor(focusSpy, focusTarget)).toEqual({ preventScroll: true });
  });

  it('returns focus to the trigger with preventScroll on dismiss', async () => {
    const onDismiss = vi.fn();
    const { rerender } = render(BottomSheetFocusTestHarness, {
      props: { isOpen: false, onDismiss },
    });

    /* Trigger becomes the "original" focus element captured on open. */
    const trigger = screen.getByTestId('trigger');
    trigger.focus();

    const focusSpy = spyOnFocus();
    await rerender({ isOpen: true, onDismiss });

    /* Wait until the open sequence has moved focus into the sheet — this
     * guarantees `originalFocusEl` (the trigger) was captured before we
     * dismiss, otherwise Escape races the deferred focus capture. */
    const focusTarget = await screen.findByTestId('focus-target');
    await waitFor(() => expect(focusSpy.mock.contexts).toContain(focusTarget));

    /* Escape dismisses the top-most dismissible sheet → close() → returnFocus(). */
    await fireEvent.keyDown(window, { key: 'Escape' });

    await waitFor(() => expect(onDismiss).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(focusSpy.mock.contexts).toContain(trigger));
    expect(focusOptionsFor(focusSpy, trigger)).toEqual({ preventScroll: true });
  });
});
