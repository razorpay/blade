import { describe, it, expect, vi } from 'vitest';
import { createCardGroupRow } from './row.svelte';

function rowWithBlur(): { onBlur: ReturnType<typeof vi.fn>; input: HTMLInputElement } {
  const onBlur = vi.fn();
  const row = createCardGroupRow({
    isSelected: () => false,
    isActive: () => false,
    onToggle: () => false,
    onBlur,
  });
  const input = document.createElement('input');
  document.body.append(input);
  input.addEventListener('focusout', (event) => row.handleFocusOut(event));
  return { onBlur, input };
}

describe('createCardGroupRow focusout', () => {
  it('is a blur when focus moves to another element', () => {
    const { onBlur, input } = rowWithBlur();
    const next = document.createElement('button');
    input.dispatchEvent(new FocusEvent('focusout', { relatedTarget: next }));
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('is a blur when focus goes nowhere and the row stays in the page', async () => {
    const { onBlur, input } = rowWithBlur();
    input.dispatchEvent(new FocusEvent('focusout'));
    await Promise.resolve();
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('keeps the list focused when the row leaves the page (a virtual window scrolled it out)', async () => {
    const { onBlur, input } = rowWithBlur();
    input.dispatchEvent(new FocusEvent('focusout'));
    input.remove();
    await Promise.resolve();
    expect(onBlur).not.toHaveBeenCalled();
  });
});
