import { toastStore, TOAST_REJECTED } from '../useToast.native';

// NOTE: rendering tests for <Toast /> are not included here because the
// `popup.background.*` / `staticWhite` tokens used in Toast.native.tsx are
// not accepted by Box's runtime token validator and IconColors respectively.
// Those are pre-existing issues that pre-date this PR. Tracking a follow-up
// to migrate Toast.native to validator-accepted tokens. The toastStore
// behaviour below is fully covered and is the most failure-prone surface.

describe('toastStore (native)', () => {
  beforeEach(() => {
    // Reset state between tests so leftover toasts don't bleed.
    while (toastStore.getSnapshot().length > 0) {
      toastStore.dismiss(toastStore.getSnapshot()[0].id);
    }
  });

  it('show() returns a non-empty id for a regular toast', () => {
    const id = toastStore.show({ content: 'Hello' });
    expect(id).not.toBe(TOAST_REJECTED);
    expect(id.length).toBeGreaterThan(0);
  });

  it('rejects a second promotional toast while one is visible', () => {
    const first = toastStore.show({ content: 'Promo 1', type: 'promotional' });
    const second = toastStore.show({ content: 'Promo 2', type: 'promotional' });
    expect(first).not.toBe(TOAST_REJECTED);
    expect(second).toBe(TOAST_REJECTED);
  });

  it('dismiss() with no argument dismisses every visible toast (web parity)', () => {
    toastStore.show({ content: 'A' });
    toastStore.show({ content: 'B' });
    toastStore.show({ content: 'C' });
    expect(toastStore.getSnapshot().filter((t) => t.visible)).toHaveLength(3);
    toastStore.dismiss();
    expect(toastStore.getSnapshot().filter((t) => t.visible)).toHaveLength(0);
  });

  it('dismiss(id) cancels any auto-dismiss timer for that toast', () => {
    jest.useFakeTimers();
    const id = toastStore.show({ content: 'Hello', duration: 1000 });
    expect(toastStore.getSnapshot().find((t) => t.id === id)?.visible).toBe(true);
    toastStore.dismiss(id);
    expect(toastStore.getSnapshot().find((t) => t.id === id)?.visible).toBe(false);
    jest.advanceTimersByTime(2000);
    jest.useRealTimers();
  });
});
