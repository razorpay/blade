import { describe, it, expect } from 'vitest';
import { flushSync } from 'svelte';
import { watch } from '../../test/watch.svelte';
import { createOverlayStack } from './overlays.svelte';

interface Content {
  name: string;
  amount?: number;
}

const names = (stack: ReturnType<typeof createOverlayStack<Content>>) =>
  stack.entries.map((entry) => `${entry.content.name}:${entry.phase}`);

describe('createOverlayStack', () => {
  it('keeps entries in the order they were opened', () => {
    const stack = createOverlayStack<Content>();
    stack.open({ name: 'offers' });
    stack.open({ name: 'otp' });
    expect(names(stack)).toEqual(['offers:open', 'otp:open']);
    expect(stack.count()).toBe(2);
  });

  it('close settles the result once and waits for the view to remove it', () => {
    const stack = createOverlayStack<Content>();
    const handle = stack.open<boolean>({ name: 'confirm' });
    const id = stack.entries[0]?.id as number;

    handle.close(true);
    handle.close(false);
    return handle.result.then((result) => {
      expect(result).toBe(true);
      expect(names(stack)).toEqual(['confirm:closing']);

      stack.closed(id);
      expect(names(stack)).toEqual([]);
    });
  });

  it('a dismiss settles with undefined', () => {
    const stack = createOverlayStack<Content>();
    const handle = stack.open<boolean>({ name: 'confirm' });
    stack.dismiss(stack.entries[0]?.id as number);
    return handle.result.then((result) => {
      expect(result).toBeUndefined();
      expect(names(stack)).toEqual(['confirm:closing']);
    });
  });

  it('ignores a closed report for an entry that is still open', () => {
    const stack = createOverlayStack<Content>();
    stack.open({ name: 'otp' });
    stack.closed(stack.entries[0]?.id as number);
    expect(names(stack)).toEqual(['otp:open']);
  });

  it('updates the content of an open entry only', () => {
    const stack = createOverlayStack<Content>();
    const handle = stack.open({ name: 'fee', amount: 10 });
    handle.update({ amount: 25 });
    expect(stack.entries[0]?.content).toEqual({
      name: 'fee',
      amount: 25,
    });
    handle.close();
    handle.update({ amount: 99 });
    expect(stack.entries[0]?.content.amount).toBe(25);
  });

  it('every change reaches whatever reads the entries', () => {
    const stack = createOverlayStack<Content>();
    const seen = watch(() => stack.entries.map((entry) => entry.phase));
    const handle = stack.open({ name: 'otp' });
    flushSync();
    handle.close();
    flushSync();
    stack.closed(stack.entries[0]?.id as number);
    flushSync();
    seen.stop();
    expect(seen.seen).toEqual([[], ['open'], ['closing'], []]);
  });
});
