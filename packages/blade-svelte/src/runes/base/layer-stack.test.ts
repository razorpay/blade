import { describe, it, expect, vi } from 'vitest';
import { createLayerStack } from './layer-stack.svelte';

describe('createLayerStack', () => {
  it('pushes in order, closes one, clears the rest, and resolves removed layers', async () => {
    const stack = createLayerStack<string>();
    stack.push('a');
    const b = stack.push('b');
    const c = stack.push('c');
    const settled = vi.fn();
    b.promise.then(() => settled('b')).catch(() => undefined);
    c.promise.then(() => settled('c')).catch(() => undefined);

    b.close();
    expect(stack.entries.map((l) => l.entry)).toEqual(['a', 'c']);
    expect(stack.top()?.entry).toBe('c');
    stack.clear();
    expect(stack.size()).toBe(0);
    await Promise.resolve();
    expect(settled.mock.calls.flat()).toEqual(['b', 'c']);
  });

  it('settle resolves the promise and leaves the layer in place', async () => {
    const stack = createLayerStack<string>();
    const layer = stack.push('sheet');
    layer.settle('done');
    await expect(layer.promise).resolves.toBe('done');
    expect(stack.size()).toBe(1);
    layer.close();
    expect(stack.size()).toBe(0);
  });

  it('update replaces a layer’s entry and ignores a stranger', () => {
    const stack = createLayerStack<string>();
    const layer = stack.push('a');
    stack.update(layer, 'b');
    expect(stack.entries.map((l) => l.entry)).toEqual(['b']);
    const other = createLayerStack<string>().push('x');
    stack.update(other, 'y');
    expect(stack.entries.map((l) => l.entry)).toEqual(['b']);
  });
});
