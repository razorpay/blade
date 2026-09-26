import { describe, it, expect, vi } from 'vitest';
import { createDisclosure, type DisclosureModel } from './disclosure';
import { createLayerStack } from './layer-stack.svelte';

describe('createLayerStack', () => {
  it('pushes in order, closes one, pops through, and resolves removed layers', async () => {
    const stack = createLayerStack<string>();
    const a = stack.push('a');
    const b = stack.push('b');
    const c = stack.push('c');
    const settled = vi.fn();
    b.promise.then(() => settled('b')).catch(() => undefined);
    c.promise.then(() => settled('c')).catch(() => undefined);

    b.close();
    expect(stack.entries.map((l) => l.entry)).toEqual(['a', 'c']);
    a.popAfter();
    expect(stack.entries.map((l) => l.entry)).toEqual(['a']);
    await Promise.resolve();
    expect(settled.mock.calls.flat()).toEqual(['b', 'c']);
  });

  it('resolve hands the value to the promise then pops', async () => {
    const stack = createLayerStack<string>();
    const layer = stack.push('sheet');
    layer.resolve('picked');
    await expect(layer.promise).resolves.toBe('picked');
    expect(stack.size()).toBe(0);
  });

  it('back closes overlays before screens, lets the top own it, and confirms leaving', () => {
    const stack = createLayerStack<string>();
    stack.push('home', 'main');
    stack.push('card', 'main');
    const sheet = stack.push('sheet', 'overlay');

    expect(stack.back({ preferContainer: 'overlay', onTop: () => true })).toBe(
      true
    );
    expect(stack.top()).toBe(sheet);

    expect(stack.back({ preferContainer: 'overlay' })).toBe(true);
    expect(stack.top()?.entry).toBe('card');

    const confirmLeave = vi.fn().mockReturnValue(true);
    expect(stack.back({ confirmLeave })).toBe(true);
    expect(stack.top()?.entry).toBe('card');

    expect(stack.back()).toBe(true);
    const onEmpty = vi.fn();
    expect(stack.back({ onEmpty })).toBe(false);
    expect(onEmpty).toHaveBeenCalled();
    expect(stack.size('main')).toBe(1);
  });

  it('composes with a disclosure per the BackAnswer rule: the top dialog answers first', () => {
    const stack = createLayerStack<DisclosureModel>();
    stack.push(createDisclosure({ defaultOpen: true }), 'main');
    const dialog = createDisclosure({
      defaultOpen: true,
      dismissible: () => false,
    });
    stack.push(dialog, 'main');
    const onTop = (top: { entry: DisclosureModel }) => top.entry.back();

    // Open and non-dismissable: back is swallowed by the dialog, nothing pops.
    expect(stack.back({ onTop })).toBe(true);
    expect(stack.size()).toBe(2);

    // Closed: the dialog defers (undefined) and the stack pops the layer.
    dialog.close();
    expect(stack.back({ onTop })).toBe(true);
    expect(stack.size()).toBe(1);
  });
});
