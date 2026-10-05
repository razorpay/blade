import { describe, it, expect } from 'vitest';
import { flushSync } from 'svelte';
import { run } from '../../test/run';
import type { FieldRecord } from '../form/types';
import { createInputGroup } from './group.svelte';

describe('createInputGroup', () => {
  it('places members in document order, not mount order (B4)', () => {
    const { value: group, unmount } = run(() =>
      createInputGroup({
        id: 'g',
        validationState: () => undefined,
        hint: () => undefined,
      }),
    );
    const box = document.body.appendChild(document.createElement('div'));
    const top = document.createElement('input');
    const bottom = document.createElement('input');
    box.append(top, bottom);
    // Members register at init, before their controls mount.
    let mounted = false;
    const record = (element: HTMLElement): FieldRecord => ({
      value: '',
      getHandle: () => (mounted ? (element as never) : undefined),
    });
    const later = record(bottom);
    const conditional = record(top);
    // The conditional member registers last but sits on the first row.
    group.register(later, () => 'full');
    group.register(conditional, () => 'full');
    mounted = true;
    group.reorder();
    flushSync();
    expect(group.cornersOf(conditional)).toMatchObject({ tl: true, tr: true });
    expect(group.cornersOf(later)).toMatchObject({ bl: true, br: true });
    box.remove();
    unmount();
  });
});
