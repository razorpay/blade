import { describe, it, expect } from 'vitest';
import { createRawSnippet } from 'svelte';
import { render } from '@testing-library/svelte';
import Modal from '../components/modal/Modal.svelte';
import BottomSheet from '../components/bottom-sheet/BottomSheet.svelte';
import { applyModalClasses, resolveModal } from '../components/modal/styles';
import { resolveBottomSheet } from '../components/bottom-sheet/styles';
import { expectClass, expectNoClass } from './classes';

const children = createRawSnippet(() => ({ render: () => '<p>Content</p>' }));

describe('Modal classes', () => {
  it('root replaces where the panel sits, over the positioned layer', () => {
    const base = resolveModal({});
    const placed = applyModalClasses(base, { root: 'items-start justify-end p-6' });
    expect(placed.root).toContain('absolute inset-0');
    expect(placed.root).toContain('items-start justify-end p-6');
    expect(placed.root).not.toContain('items-center');
    // The panel keeps the layout's look and size.
    expect(placed.panel).toBe(base.panel);
  });

  it('panel replaces the look and size, over the pointer-taking column', () => {
    const base = resolveBottomSheet({ pace: 'snappy' });
    const panel = applyModalClasses(base, { panel: 'w-[320px] rounded-large' }, 'snappy').panel;
    expect(panel).toContain('pointer-events-auto relative flex');
    expect(panel).toContain('w-[320px] rounded-large');
    expect(panel).not.toContain('rounded-t-');
  });

  it('a function rewrites every class', () => {
    const base = resolveModal({});
    expect(applyModalClasses(base, (c) => ({ ...c, close: 'hidden' })).close).toBe('hidden');
  });

  it('a Modal sits top right; a BottomSheet takes its own panel', () => {
    const { getByTestId } = render(Modal, {
      props: {
        isOpen: true,
        testID: 'modal',
        classes: { root: 'items-start justify-end p-6' },
        children,
      },
    });
    const root = getByTestId('modal').parentElement as HTMLElement;
    expectClass(root, 'items-start');
    expectClass(root, 'justify-end');
    expectNoClass(root, 'items-center');

    const sheet = render(BottomSheet, {
      props: {
        isOpen: true,
        testID: 'sheet',
        classes: { panel: 'w-[320px] translate-y-0' },
        children,
      },
    });
    expectClass(sheet.getByTestId('sheet'), 'w-[320px]');
  });
});
