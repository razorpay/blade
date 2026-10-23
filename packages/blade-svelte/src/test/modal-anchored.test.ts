import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import Harness from './fixtures/AnchoredModalHarness.svelte';
import { expectClass, expectGlyph } from './classes';
import { InfoIcon } from '../icons';

// Modal's popover and menu variants: Blade's Popover and Menu as one
// component with a trigger, and an ActionList for the menu's rows.

describe('Modal variant="popover"', () => {
  it('the trigger snippet reads the open state and wires nothing', async () => {
    const { getByTestId } = render(Harness);
    const trigger = getByTestId('fees');
    expect(trigger.dataset.open).toBe('false');
    await fireEvent.click(trigger);
    await waitFor(() => expect(getByTestId('panel')).toBeTruthy());
    expect(trigger.dataset.open).toBe('true');
  });

  it('a press opens a named, non-modal dialog in the host, focus inside', async () => {
    const { getByRole, getByTestId } = render(Harness);
    const trigger = getByRole('button', { name: 'Fees' });
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    await fireEvent.click(trigger);
    await waitFor(() => expect(getByTestId('panel')).toBeTruthy());
    const panel = getByTestId('panel');
    expect(panel.getAttribute('role')).toBe('dialog');
    expect(panel.getAttribute('aria-label')).toBe('Fee details');
    expect(panel.hasAttribute('aria-modal')).toBe(false);
    expectClass(panel, 'shadow-dropdown');
    expect(getByTestId('host').contains(panel)).toBe(true);
    // The page stays live and unscrimmed: no scrim, nothing inert.
    expect(getByTestId('page').hasAttribute('inert')).toBe(false);
    expect(getByTestId('host-backdrop').dataset.state).toBe('closed');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.getAttribute('aria-controls')).toBe(panel.id);
    // The first control, as Blade: the close button.
    expect(document.activeElement).toBe(getByRole('button', { name: 'Close' }));
  });

  it('closes from inside, on Escape and on a press outside, reporting each; focus returns', async () => {
    const onDismiss = vi.fn();
    const { getByRole, getByTestId, queryByTestId } = render(Harness, { props: { onDismiss } });
    const trigger = getByRole('button', { name: 'Fees' });
    const open = async (): Promise<void> => {
      await fireEvent.click(trigger);
      await waitFor(() => expect(getByTestId('panel')).toBeTruthy());
    };
    const closed = (): Promise<void> => waitFor(() => expect(queryByTestId('panel')).toBeNull());

    trigger.focus();
    await open();
    await fireEvent.click(getByRole('button', { name: 'Got it' }));
    await closed();
    expect(onDismiss).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(trigger);

    await open();
    await fireEvent.keyDown(document, { key: 'Escape' });
    await closed();
    expect(onDismiss).toHaveBeenLastCalledWith(expect.objectContaining({ source: 'escape' }));
    expect(document.activeElement).toBe(trigger);

    await open();
    await fireEvent.pointerDown(getByTestId('elsewhere'));
    await closed();
    expect(onDismiss).toHaveBeenLastCalledWith(expect.objectContaining({ source: 'blur' }));

    await open();
    await fireEvent.click(getByRole('button', { name: 'Close' }));
    await closed();
    expect(onDismiss).toHaveBeenLastCalledWith(expect.objectContaining({ source: 'cross' }));
  });

  it('a press on the open trigger closes it', async () => {
    const { getByTestId, queryByTestId } = render(Harness);
    await fireEvent.click(getByTestId('fees'));
    await waitFor(() => expect(getByTestId('panel')).toBeTruthy());
    await fireEvent.click(getByTestId('fees'));
    await waitFor(() => expect(queryByTestId('panel')).toBeNull());
  });

  it('nothing opens on hover: a click only, as there is no hover on touch', async () => {
    const { getByTestId, queryByTestId } = render(Harness);
    const root = getByTestId('fees').parentElement!;
    await fireEvent.pointerEnter(root);
    await fireEvent.pointerEnter(getByTestId('fees'));
    expect(queryByTestId('panel')).toBeNull();
  });

  it('isDisabled: the trigger does not open it', async () => {
    const { getByTestId, queryByTestId } = render(Harness, { props: { isDisabled: true } });
    await fireEvent.click(getByTestId('fees'));
    expect(queryByTestId('panel')).toBeNull();
  });

  it('a title names the panel (a string or a snippet) and a leading icon draws before it', async () => {
    const view = render(Harness, { props: { title: 'Settlement breakup', withLeading: true } });
    await fireEvent.click(view.getByTestId('fees'));
    const panel = await waitFor(() => view.getByTestId('panel'));
    expect(view.getByRole('dialog', { name: 'Settlement breakup' })).toBe(panel);
    const title = panel.querySelector('p')!;
    expect(panel.getAttribute('aria-labelledby')).toBe(title.id);
    expectClass(title, 'font-sans font-semibold text-200 leading-200');
    expectGlyph(title.closest('[class*="flex"]')!.parentElement, InfoIcon);
    view.unmount();

    const rich = render(Harness, { props: { richTitle: true } });
    await fireEvent.click(rich.getByTestId('fees'));
    const richPanel = await waitFor(() => rich.getByTestId('panel'));
    expect(rich.getByRole('dialog', { name: 'Settlement breakup' })).toBe(richPanel);
    expect(richPanel.getAttribute('aria-labelledby')).toBe(
      rich.getByTestId('rich-title').parentElement!.id,
    );
  });

  it('header receives the drawn title and subtitle and places them; they still name and describe it', async () => {
    const { getByTestId, getByText, queryByTestId } = render(Harness, {
      props: { title: 'Remove card', withHeader: true },
    });
    await fireEvent.click(getByTestId('fees'));
    await waitFor(() => expect(getByTestId('panel')).toBeTruthy());
    const panel = getByTestId('panel');
    const row = getByTestId('title-row');
    const title = getByText('Remove card');
    expect(title.parentElement).toBe(row);
    expect(title.previousElementSibling).toBe(getByTestId('header-back'));
    expect(title.nextElementSibling).toBe(getByTestId('badge-beside'));
    expect(panel.getAttribute('aria-labelledby')).toBe(title.id);
    expect(panel.getAttribute('aria-describedby')).toBe(getByText('Visa').id);
    // The header's close closes it without a dismissal.
    await fireEvent.click(getByTestId('header-back'));
    await waitFor(() => expect(queryByTestId('panel')).toBeNull());
  });

  it('one Escape closes only the topmost layer: the tooltip inside, then the popover', async () => {
    const { getByTestId, queryByTestId } = render(Harness, { props: { withTooltip: true } });
    await fireEvent.click(getByTestId('fees'));
    await waitFor(() => getByTestId('panel'));
    await fireEvent.focusIn(getByTestId('tip-trigger'));
    await waitFor(() => getByTestId('tip'));

    await fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(queryByTestId('tip')).toBeNull());
    expect(queryByTestId('panel')).not.toBeNull();

    await fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(queryByTestId('panel')).toBeNull());
  });
});

describe('Modal variant="menu"', () => {
  it('binds isOpen both ways', async () => {
    const { getByTestId, queryByTestId, rerender } = render(Harness);
    await fireEvent.click(getByTestId('more'));
    await waitFor(() => getByTestId('menu'));
    expect(getByTestId('menu-bound').textContent).toBe('true');

    await fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(queryByTestId('menu')).toBeNull());
    expect(getByTestId('menu-bound').textContent).toBe('false');

    // The host opens it.
    await rerender({ menuOpen: true });
    await waitFor(() => getByTestId('menu'));
  });

  it('opens a dialog holding the list, focus on its first row; arrows rove, skipping a disabled row', async () => {
    const { getByRole, getAllByRole, getByTestId } = render(Harness);
    const trigger = getByRole('button', { name: 'More' });
    // The menu holds what the app puts in it: a dialog, not role="menu".
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');

    await fireEvent.click(trigger);
    await waitFor(() => expect(getByTestId('menu')).toBeTruthy());
    const menu = getByTestId('menu');
    expect(menu.getAttribute('role')).toBe('dialog');
    expect(menu.getAttribute('aria-label')).toBe('Card actions');
    expect(trigger.getAttribute('aria-controls')).toBe(menu.id);
    // No close button: the rows are the way out.
    expect(menu.querySelector('[aria-label="Close"]')).toBeNull();
    const items = getAllByRole('radio');
    expect(items.map((item) => item.closest('label')?.textContent?.trim())).toEqual([
      'Edit',
      'Archive',
      'Delete',
    ]);
    expect((items[1] as HTMLInputElement).disabled).toBe(true);
    await waitFor(() => expect(document.activeElement).toBe(items[0]));

    await fireEvent.keyDown(items[0], { key: 'ArrowDown' });
    await waitFor(() => expect(document.activeElement).toBe(items[2]));
    await fireEvent.keyDown(items[2], { key: 'ArrowUp' });
    await waitFor(() => expect(document.activeElement).toBe(items[0]));
  });

  it('ArrowDown on the closed trigger opens it', async () => {
    const { getByRole, getByTestId } = render(Harness);
    const trigger = getByRole('button', { name: 'More' });
    trigger.focus();
    await fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    await waitFor(() => expect(getByTestId('menu')).toBeTruthy());
  });

  it("a pick reports through the list's onPick, which closes it; focus goes back to the trigger", async () => {
    const onSelect = vi.fn();
    const { getByRole, getByTestId, queryByTestId } = render(Harness, { props: { onSelect } });
    const trigger = getByRole('button', { name: 'More' });
    trigger.focus();
    await fireEvent.click(trigger);
    await waitFor(() => expect(getByTestId('menu')).toBeTruthy());
    await fireEvent.click(getByTestId('delete'));
    await waitFor(() => expect(queryByTestId('menu')).toBeNull());
    expect(onSelect).toHaveBeenCalledWith('Delete');
    expect(document.activeElement).toBe(trigger);
  });

  it('a link row navigates; its onClick closes the menu', async () => {
    const { getByRole, getByTestId, queryByTestId } = render(Harness, {
      props: { withLink: true },
    });
    await fireEvent.click(getByTestId('more'));
    await waitFor(() => expect(getByTestId('menu')).toBeTruthy());
    const link = getByRole('link', { name: 'Help' });
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('#help');
    await fireEvent.click(link);
    await waitFor(() => expect(queryByTestId('menu')).toBeNull());
  });
});
