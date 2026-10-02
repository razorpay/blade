import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import PopoverHarness from './fixtures/PopoverHarness.svelte';
import { expectClass } from './classes';

describe('Popover', () => {
  it('the trigger snippet reads the open state and wires nothing', () => {
    const { getByTestId } = render(PopoverHarness);
    const trigger = getByTestId('fees');
    expect(trigger.dataset.open).toBe('false');
    return fireEvent
      .click(trigger)
      .then(() => waitFor(() => expect(getByTestId('panel')).toBeTruthy()))
      .then(() => expect(trigger.dataset.open).toBe('true'));
  });

  it('a press on the trigger opens a named panel in the host, focus inside', () => {
    const onOpenChange = vi.fn();
    const { getByRole, getByTestId } = render(PopoverHarness, {
      props: { onOpenChange },
    });
    const trigger = getByRole('button', { name: 'Fees' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    return fireEvent
      .click(trigger)
      .then(() => waitFor(() => expect(getByTestId('panel')).toBeTruthy()))
      .then(() => {
        const panel = getByTestId('panel');
        expect(panel.getAttribute('role')).toBe('dialog');
        expect(panel.getAttribute('aria-label')).toBe('Fee details');
        expectClass(panel, 'shadow-dropdown');
        expect(getByTestId('host').contains(panel)).toBe(true);
        expect(getByTestId('page').hasAttribute('inert')).toBe(false);
        expect(trigger.getAttribute('aria-expanded')).toBe('true');
        expect(trigger.getAttribute('aria-controls')).toBe(panel.id);
        // The first control, as Blade: the close button.
        expect(document.activeElement).toBe(
          getByRole('button', { name: 'Close' })
        );
        expect(onOpenChange).toHaveBeenLastCalledWith({ isOpen: true });
      });
  });

  it('closes from inside, on Escape and on a press outside; focus returns', () => {
    const { getByRole, getByTestId, queryByTestId } = render(PopoverHarness);
    const trigger = getByRole('button', { name: 'Fees' });
    const open = () =>
      fireEvent
        .click(trigger)
        .then(() => waitFor(() => expect(getByTestId('panel')).toBeTruthy()));
    const closed = () =>
      waitFor(() => expect(queryByTestId('panel')).toBeNull());

    trigger.focus();
    return open()
      .then(() => fireEvent.click(getByRole('button', { name: 'Got it' })))
      .then(closed)
      .then(() => {
        expect(document.activeElement).toBe(trigger);
        return open();
      })
      .then(() => fireEvent.keyDown(document, { key: 'Escape' }))
      .then(closed)
      .then(open)
      .then(() => fireEvent.pointerDown(getByTestId('elsewhere')))
      .then(closed);
  });
});

describe('Menu', () => {
  it('binds isOpen both ways and reports { isOpen }', async () => {
    const onMenuOpenChange = vi.fn();
    const { getByTestId, queryByTestId, rerender } = render(PopoverHarness, {
      props: { onMenuOpenChange },
    });
    await fireEvent.click(getByTestId('more'));
    await waitFor(() => getByTestId('menu'));
    expect(onMenuOpenChange).toHaveBeenLastCalledWith({ isOpen: true });
    expect(getByTestId('menu-bound').textContent).toBe('true');

    await fireEvent.keyDown(getByTestId('menu'), { key: 'Escape' });
    await waitFor(() => expect(queryByTestId('menu')).toBeNull());
    expect(onMenuOpenChange).toHaveBeenLastCalledWith({ isOpen: false });
    expect(getByTestId('menu-bound').textContent).toBe('false');

    // The host opens it.
    await rerender({ onMenuOpenChange, menuOpen: true });
    await waitFor(() => getByTestId('menu'));
  });

  it('the trigger snippet reads the open state', () => {
    const { getByTestId } = render(PopoverHarness);
    const trigger = getByTestId('more');
    expect(trigger.dataset.open).toBe('false');
    return fireEvent
      .click(trigger)
      .then(() => waitFor(() => expect(getByTestId('menu')).toBeTruthy()))
      .then(() => expect(trigger.dataset.open).toBe('true'));
  });

  it('opens on its first item; arrows rove, skipping a disabled item', () => {
    const { getByRole, getAllByRole, getByTestId } = render(PopoverHarness);
    const trigger = getByRole('button', { name: 'More' });
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');

    return fireEvent
      .click(trigger)
      .then(() => waitFor(() => expect(getByTestId('menu')).toBeTruthy()))
      .then(() => {
        const menu = getByTestId('menu');
        expect(menu.getAttribute('role')).toBe('menu');
        expect(menu.getAttribute('aria-label')).toBe('Card actions');
        const items = getAllByRole('menuitem');
        expect(items.map((item) => item.textContent?.trim())).toEqual([
          'Edit',
          'Archive',
          'Delete',
        ]);
        expect(items[1].getAttribute('aria-disabled')).toBe('true');
        expectClass(items[1], 'text-interactive-gray-disabled');
        return waitFor(() => expect(document.activeElement).toBe(items[0]));
      })
      .then(() => fireEvent.keyDown(getByTestId('menu'), { key: 'ArrowDown' }))
      .then(() =>
        waitFor(() =>
          expect(document.activeElement).toBe(getAllByRole('menuitem')[2])
        )
      );
  });

  it('a choice reports, closes, and hands focus back to the trigger', () => {
    const onSelect = vi.fn();
    const { getByRole, getByTestId, queryByTestId } = render(PopoverHarness, {
      props: { onSelect },
    });
    const trigger = getByRole('button', { name: 'More' });
    trigger.focus();

    return fireEvent
      .keyDown(trigger, { key: 'ArrowDown' })
      .then(() => waitFor(() => expect(getByTestId('menu')).toBeTruthy()))
      .then(() => fireEvent.keyDown(getByTestId('menu'), { key: 'End' }))
      .then(() => fireEvent.keyDown(getByTestId('menu'), { key: 'Enter' }))
      .then(() => waitFor(() => expect(queryByTestId('menu')).toBeNull()))
      .then(() => {
        expect(onSelect).toHaveBeenCalledWith('Delete');
        expect(document.activeElement).toBe(trigger);
      });
  });

  it('a disabled item does not choose', () => {
    const onSelect = vi.fn();
    const { getByRole, getByTestId } = render(PopoverHarness, {
      props: { onSelect },
    });
    return fireEvent
      .click(getByRole('button', { name: 'More' }))
      .then(() => waitFor(() => expect(getByTestId('menu')).toBeTruthy()))
      .then(() => fireEvent.click(getByRole('menuitem', { name: 'Archive' })))
      .then(() => {
        expect(onSelect).not.toHaveBeenCalled();
        expect(getByTestId('menu')).toBeTruthy();
      });
  });
});

describe('Popover, as Blade', () => {
  it('footer and titleLeading get close', async () => {
    const Harness = (await import('./fixtures/PopoverTitledHarness.svelte')).default;
    const { getByRole, getByTestId, queryByTestId } = render(Harness);
    await fireEvent.click(getByRole('button', { name: 'Settlement' }));
    await waitFor(() => getByTestId('panel'));
    await fireEvent.click(getByRole('button', { name: 'Settle' }));
    await waitFor(() => expect(queryByTestId('panel')).toBeNull());

    await fireEvent.click(getByRole('button', { name: 'Settlement' }));
    await waitFor(() => getByTestId('panel'));
    await fireEvent.click(getByTestId('leading'));
    await waitFor(() => expect(queryByTestId('panel')).toBeNull());
  });

  it('a title snippet names the panel and sits in the title box', async () => {
    const Harness = (await import('./fixtures/PopoverTitledHarness.svelte')).default;
    const { getByRole, getByTestId } = render(Harness, { props: { richTitle: true } });
    await fireEvent.click(getByRole('button', { name: 'Settlement' }));
    const panel = await waitFor(() => getByTestId('panel'));
    const title = getByTestId('rich-title').parentElement as HTMLElement;
    expect(panel.getAttribute('aria-labelledby')).toBe(title.id);
    expect(getByRole('dialog', { name: 'Settlement breakup' })).toBe(panel);
  });

  it('names the panel by its title, with a close button, a leading and a footer', async () => {
    const { getByRole, getByTestId, queryByTestId } = render(
      (await import('./fixtures/PopoverTitledHarness.svelte')).default
    );
    await fireEvent.click(getByRole('button', { name: 'Settlement' }));
    const panel = await waitFor(() => getByTestId('panel'));
    expect(panel.getAttribute('aria-labelledby')).toBe(
      getByRole('dialog').querySelector('p')?.id
    );
    expect(getByRole('dialog', { name: 'Settlement breakup' })).toBe(panel);
    expect(getByTestId('leading')).toBeTruthy();
    expect(getByRole('button', { name: 'Settle' })).toBeTruthy();
    await fireEvent.click(getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(queryByTestId('panel')).toBeNull());
  });

  it('opens on hover without a close button, and stays open over the panel', async () => {
    vi.useFakeTimers();
    (window as { matchMedia?: unknown }).matchMedia = (query: string) => ({
      matches: query === '(hover: hover)',
      addEventListener() {},
      removeEventListener() {},
    });
    try {
      const { getByRole, getByTestId, queryByRole, queryByTestId } = render(
        (await import('./fixtures/PopoverTitledHarness.svelte')).default,
        { props: { openInteraction: 'hover' } }
      );
      const root = getByRole('button', { name: 'Settlement' }).parentElement!;
      await fireEvent.pointerEnter(root);
      const panel = getByTestId('panel');
      expect(queryByRole('button', { name: 'Close' })).toBeNull();
      await fireEvent.pointerLeave(root);
      await fireEvent.pointerEnter(panel);
      vi.advanceTimersByTime(200);
      expect(queryByTestId('panel')).not.toBeNull();
      await fireEvent.pointerLeave(panel);
      vi.advanceTimersByTime(200);
      await vi.runAllTimersAsync();
      expect(getByRole('button', { name: 'Settlement' }).getAttribute('aria-expanded')).toBe('false');
    } finally {
      vi.useRealTimers();
      delete (window as { matchMedia?: unknown }).matchMedia;
    }
  });

  it('a hover grace still running when the popover goes never writes to it', async () => {
    vi.useFakeTimers();
    (window as { matchMedia?: unknown }).matchMedia = (query: string) => ({
      matches: query === '(hover: hover)',
      addEventListener() {},
      removeEventListener() {},
    });
    try {
      const onOpenChange = vi.fn();
      const { getByRole, unmount } = render(
        (await import('./fixtures/PopoverTitledHarness.svelte')).default,
        { props: { openInteraction: 'hover', onOpenChange } }
      );
      const root = getByRole('button', { name: 'Settlement' }).parentElement!;
      await fireEvent.pointerEnter(root);
      await fireEvent.pointerLeave(root);
      expect(onOpenChange).toHaveBeenLastCalledWith({ isOpen: true });
      unmount();
      vi.advanceTimersByTime(500);
      expect(onOpenChange).not.toHaveBeenCalledWith({ isOpen: false });
    } finally {
      vi.useRealTimers();
      delete (window as { matchMedia?: unknown }).matchMedia;
    }
  });

  it('where nothing can hover (touch, native), a hover popover opens on a tap, with a close button', async () => {
    const { getByRole, getByTestId } = render(
      (await import('./fixtures/PopoverTitledHarness.svelte')).default,
      { props: { openInteraction: 'hover' } }
    );
    const trigger = getByRole('button', { name: 'Settlement' });
    await fireEvent.pointerEnter(trigger.parentElement!);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    await fireEvent.click(trigger);
    await waitFor(() => expect(getByTestId('panel')).toBeTruthy());
    expect(getByRole('button', { name: 'Close' })).toBeTruthy();
  });

  it("draws Blade's panel: 16px round, the popup shadow, an arrow", async () => {
    const { resolvePopover } = await import('../components/popover/styles');
    const look = resolvePopover();
    expect(look.panel).toContain('rounded-large');
    expect(look.panel).toContain('m:max-w-[328px]');
    expect(look.arrowSide?.top).toContain('w-[22px]');
    expect(look.gap).toBe(16);
  });
});

describe('floating layers', () => {
  it('one Escape closes only the topmost: the tooltip inside a popover, then the popover', async () => {
    const Harness = (await import('./fixtures/NestedFloatingHarness.svelte')).default;
    const { getByRole, getByTestId, queryByTestId } = render(Harness);
    await fireEvent.click(getByRole('button', { name: 'Fees' }));
    await waitFor(() => getByTestId('panel'));
    await fireEvent.focusIn(getByTestId('tip-trigger'));
    await waitFor(() => getByTestId('tip'));

    await fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(queryByTestId('tip')).toBeNull());
    expect(queryByTestId('panel')).not.toBeNull();

    await fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(queryByTestId('panel')).toBeNull());
  });

  it("the menu's own Escape closes it once and hands focus back to the trigger", async () => {
    const onMenuOpenChange = vi.fn();
    const { getByRole, getByTestId, getAllByRole, queryByTestId } = render(PopoverHarness, {
      props: { onMenuOpenChange },
    });
    const trigger = getByRole('button', { name: 'More' });
    await fireEvent.click(trigger);
    await waitFor(() => expect(document.activeElement).toBe(getAllByRole('menuitem')[0]));
    // The open menu's trigger points at it.
    expect(trigger.getAttribute('aria-controls')).toBe(getByTestId('menu').id);
    onMenuOpenChange.mockClear();

    const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    getAllByRole('menuitem')[0].dispatchEvent(escape);
    await waitFor(() => expect(queryByTestId('menu')).toBeNull());
    expect(escape.defaultPrevented).toBe(true);
    expect(onMenuOpenChange).toHaveBeenCalledExactlyOnceWith({ isOpen: false });
    expect(document.activeElement).toBe(trigger);
    expect(trigger.hasAttribute('aria-controls')).toBe(false);
  });
});
