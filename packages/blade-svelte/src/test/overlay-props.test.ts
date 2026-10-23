import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import Harness from './fixtures/OverlayPropsHarness.svelte';
import { expectClass } from './classes';

// What every overlay takes as Blade's do: initialFocusRef, the analytics
// attributes, onOpenChange. Modal, BottomSheet and Drawer have no trigger.

const SURFACES = ['modal', 'sheet', 'drawer'] as const;
const ALL = [...SURFACES, 'popover', 'menu'] as const;

describe.each(['modal', 'sheet', 'drawer', 'popover'] as const)('%s initialFocusRef', (kind) => {
  it('takes focus when it opens, in place of the default', async () => {
    const { getByTestId } = render(Harness, { props: { kind, withFocusTarget: true } });
    await fireEvent.click(getByTestId('open'));
    await waitFor(() => expect(document.activeElement).toBe(getByTestId('target')));
  });

  it('without it, focus goes where it always did', async () => {
    const { getByTestId } = render(Harness, { props: { kind } });
    await fireEvent.click(getByTestId('open'));
    const panel = getByTestId('overlay');
    await waitFor(() => expect(panel.contains(document.activeElement)).toBe(true));
    expect(document.activeElement).not.toBe(getByTestId('target'));
  });
});

describe.each(ALL)('%s analytics', (kind) => {
  it('lands on the panel, the dialog element', async () => {
    const { getByTestId } = render(Harness, { props: { kind, isOpen: true } });
    await waitFor(() => expect(getByTestId('overlay')).toBeTruthy());
    expect(getByTestId('overlay').getAttribute('data-analytics-section')).toBe('fees');
  });
});

describe.each(['popover', 'menu'] as const)('%s onOpenChange', (kind) => {
  it('reports every open and close it makes', async () => {
    const onOpenChange = vi.fn();
    const { getByTestId, queryByTestId } = render(Harness, { props: { kind, onOpenChange } });
    await fireEvent.click(getByTestId('open'));
    await waitFor(() => expect(getByTestId('overlay')).toBeTruthy());
    expect(onOpenChange).toHaveBeenLastCalledWith({ isOpen: true });

    await fireEvent.click(getByTestId('done'));
    await waitFor(() => expect(queryByTestId('overlay')).toBeNull());
    expect(onOpenChange).toHaveBeenLastCalledWith({ isOpen: false });

    await fireEvent.click(getByTestId('open'));
    await waitFor(() => expect(getByTestId('overlay')).toBeTruthy());
    await fireEvent.pointerDown(getByTestId('elsewhere'));
    await waitFor(() => expect(queryByTestId('overlay')).toBeNull());
    expect(onOpenChange).toHaveBeenCalledTimes(4);
  });
});

describe.each(SURFACES)('%s onOpenChange', (kind) => {
  it('reports the closes it makes, not the open the owner made', async () => {
    const onOpenChange = vi.fn();
    const { getByTestId } = render(Harness, { props: { kind, onOpenChange } });
    await fireEvent.click(getByTestId('open'));
    await waitFor(() => expect(getByTestId('overlay')).toBeTruthy());
    expect(onOpenChange).not.toHaveBeenCalled();

    await fireEvent.click(getByTestId('done'));
    await waitFor(() => expect(getByTestId('bound').textContent).toBe('false'));
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith({ isOpen: false });
  });

  it('returns focus to what had it when it opened', async () => {
    const { getByTestId, queryByTestId } = render(Harness, { props: { kind } });
    const open = getByTestId('open');
    open.focus();
    await fireEvent.click(open);
    await waitFor(() => expect(getByTestId('overlay')).toBeTruthy());
    await fireEvent.click(getByTestId('done'));
    await waitFor(() => expect(queryByTestId('overlay')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(open));
  });
});

describe.each(ALL)('%s onOpenChange', (kind) => {
  it('not for a change the owner makes itself', async () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(Harness, { props: { kind, onOpenChange } });
    await rerender({ kind, onOpenChange, isOpen: true });
    await rerender({ kind, onOpenChange, isOpen: false });
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});

describe('DrawerBody padding', () => {
  it("is Blade's drawerPadding by default, and none with spacing.0", () => {
    const padded = render(Harness, { props: { kind: 'drawer', isOpen: true } });
    expectClass(padded.getByTestId('drawer-body'), 'overflow-auto p-5');
    padded.unmount();

    const flush = render(Harness, {
      props: { kind: 'drawer', isOpen: true, bodyPadding: 'spacing.0' },
    });
    const body = flush.getByTestId('drawer-body');
    expectClass(body, 'flex min-h-0 flex-auto flex-col');
    expect(body.className.split(' ').some((token) => /^p-\d/.test(token))).toBe(false);
  });
});
