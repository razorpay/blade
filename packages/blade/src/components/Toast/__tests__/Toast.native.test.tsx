import React from 'react';
import { Toast } from '../Toast.native';
import { ToastContainer } from '../ToastContainer.native';
import { toastStore, TOAST_REJECTED } from '../useToast.native';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<Toast /> (native)', () => {
  it('renders a positive informational toast', () => {
    const { toJSON } = renderWithTheme(<Toast content="Saved successfully" color="positive" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders a promotional toast', () => {
    const { toJSON } = renderWithTheme(
      <Toast content="New feature available" type="promotional" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});

describe('<ToastContainer /> (native)', () => {
  beforeEach(() => {
    // Reset state between tests.
    while (toastStore.getSnapshot().length > 0) {
      toastStore.dismiss(toastStore.getSnapshot()[0].id);
    }
  });

  it('renders nothing when there are no toasts', () => {
    const { toJSON } = renderWithTheme(<ToastContainer />);
    expect(toJSON()).toBeNull();
  });
});

describe('toastStore (native)', () => {
  beforeEach(() => {
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

  it('dismiss(id) cancels the auto-dismiss timer for that toast', () => {
    jest.useFakeTimers();
    const id = toastStore.show({ content: 'Hello', duration: 1000 });
    expect(toastStore.getSnapshot().find((t) => t.id === id)?.visible).toBe(true);
    toastStore.dismiss(id);
    expect(toastStore.getSnapshot().find((t) => t.id === id)?.visible).toBe(false);
    jest.advanceTimersByTime(2000);
    jest.useRealTimers();
  });
});
