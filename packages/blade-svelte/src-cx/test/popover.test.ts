import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import PopoverHarness from './fixtures/PopoverHarness.svelte';
import { expectClass } from './classes';

describe('Popover', () => {
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
        expectClass(panel, 'shadow-midRaised');
        expect(getByTestId('host').contains(panel)).toBe(true);
        expect(getByTestId('page').hasAttribute('inert')).toBe(false);
        expect(trigger.getAttribute('aria-expanded')).toBe('true');
        expect(trigger.getAttribute('aria-controls')).toBe(panel.id);
        expect(document.activeElement).toBe(
          getByRole('button', { name: 'Got it' })
        );
        expect(onOpenChange).toHaveBeenLastCalledWith(true);
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
