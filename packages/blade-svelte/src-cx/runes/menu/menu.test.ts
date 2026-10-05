import { describe, it, expect, vi } from 'vitest';
import { flushSync, tick } from 'svelte';
import { run } from '../../test/run';
import type { MenuEntry } from './context';
import { createMenu, createMenuModel } from './menu.svelte';

const key = (name: string): KeyboardEvent =>
  new KeyboardEvent('keydown', { key: name, cancelable: true });

function entries(labels: string[], onSelect: (label: string) => void): MenuEntry[] {
  const box = document.createElement('div');
  return labels.map((label) => {
    const node = box.appendChild(document.createElement('button'));
    const entry: MenuEntry = {
      isDisabled: () => false,
      text: () => label,
      select: () => onSelect(label),
      getElement: () => node,
    };
    return entry;
  });
}

describe('createMenu', () => {
  it('opens on ArrowDown at the first item, once the items registered, and picks with Enter', async () => {
    const onSelect = vi.fn();
    const { value: menu, unmount } = run(() => createMenu({ id: 'm', shared: () => undefined }));
    expect(menu.isOpen).toBe(false);

    const open = key('ArrowDown');
    menu.handleKey(open);
    flushSync();
    expect(open.defaultPrevented).toBe(true);
    expect(menu.isOpen).toBe(true);
    // The items mount with the open menu, then register.
    entries(['Edit', 'Delete'], onSelect).forEach((entry) => menu.register(entry));
    await tick();
    flushSync();
    expect(menu.activeIndex).toBe(0);

    menu.handleKey(key('ArrowDown'));
    flushSync();
    expect(menu.activeIndex).toBe(1);

    menu.handleKey(key('Enter'));
    flushSync();
    expect(onSelect).toHaveBeenCalledExactlyOnceWith('Delete');
    expect(menu.isOpen).toBe(false);
    unmount();
  });

  it('a click on the trigger opens at the first item; Escape closes', async () => {
    const { value: menu, unmount } = run(() => createMenu({ id: 'm', shared: () => undefined }));
    const trigger = document.createElement('button');
    menu.handleTriggerClick(({ target: trigger } as unknown) as MouseEvent);
    flushSync();
    expect(menu.isOpen).toBe(true);
    entries(['Edit', 'Delete'], () => undefined).forEach((entry) => menu.register(entry));
    await tick();
    flushSync();
    expect(menu.activeIndex).toBe(0);

    menu.handleKey(key('Escape'));
    flushSync();
    expect(menu.isOpen).toBe(false);
    unmount();
  });
});

const items = ['Profile', 'Orders', 'Logout'];

describe('createMenuModel', () => {
  it('opens from the keyboard onto the first or last item and acts on Enter', () => {
    const onSelect = vi.fn();
    const menu = createMenuModel({ items: () => items, onSelect });
    expect(menu.handleKey('Enter')).toBe('open');
    expect(menu.isOpen()).toBe(true);
    expect(menu.active()).toBe('Profile');
    menu.handleKey('ArrowDown');
    expect(menu.handleKey('Enter')).toBe('select');
    expect(onSelect).toHaveBeenCalledWith('Orders');
    expect(menu.isOpen()).toBe(false);

    menu.handleKey('ArrowUp');
    expect(menu.active()).toBe('Logout');
  });

  it('every choice emits, even the same item twice, and Escape closes', () => {
    const onSelect = vi.fn();
    const menu = createMenuModel({
      items: () => items,
      onSelect,
      closeOnSelect: false,
    });
    menu.open();
    menu.select('Orders');
    menu.select('Orders');
    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(menu.isOpen()).toBe(true);
    expect(menu.handleKey('Escape')).toBe('close');
    expect(menu.isOpen()).toBe(false);
    expect(menu.handleKey('x')).toBeNull();
  });

  it('close clears the active item', () => {
    const menu = createMenuModel({ items: () => items });
    menu.open();
    menu.move('first');
    menu.close();
    expect(menu.activeIndex()).toBe(-1);
    expect(menu.disclosure.isOpen()).toBe(false);
  });

  it('closing through close-on-select also clears the active item', () => {
    const menu = createMenuModel({ items: () => items });
    menu.handleKey('Enter');
    expect(menu.activeIndex()).toBe(0);
    menu.handleKey('Enter');
    expect(menu.isOpen()).toBe(false);
    expect(menu.activeIndex()).toBe(-1);
  });

  it('modified keys neither open nor select: the modifier policy is the list table', () => {
    const onSelect = vi.fn();
    const menu = createMenuModel({ items: () => items, onSelect });
    expect(menu.handleKey('Enter', { ctrl: true })).toBeNull();
    expect(menu.isOpen()).toBe(false);
    expect(menu.handleKey('ArrowDown', { alt: true })).toBe('open');

    expect(menu.handleKey('Enter', { meta: true })).toBeNull();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('Tab closes an open menu: focus is leaving the control', () => {
    const menu = createMenuModel({ items: () => items });
    menu.open();
    expect(menu.handleKey('Tab')).toBeNull();
    expect(menu.isOpen()).toBe(false);
  });
});
