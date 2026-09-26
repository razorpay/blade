import { describe, it, expect, vi } from 'vitest';
import { flushSync } from 'svelte';
import { box } from '../../test/box.svelte';
import { run } from '../../test/run';
import { createTooltip, createTooltipModel } from './tooltip.svelte';

function fakeSchedule() {
  const pending: Array<{ fn: () => void; ms: number }> = [];
  return {
    pending,
    schedule: (fn: () => void, ms: number) => {
      const entry = { fn, ms };
      pending.push(entry);
      return () => {
        pending.splice(pending.indexOf(entry), 1);
      };
    },
    run() {
      pending.splice(0).forEach((entry) => entry.fn());
    },
  };
}

describe('createTooltipModel', () => {
  it('opens on hover only after the open delay', () => {
    const clock = fakeSchedule();
    const onOpenChange = vi.fn();
    const tooltip = createTooltipModel({
      schedule: clock.schedule,
      onOpenChange,
      openDelay: 200,
    });
    tooltip.pointerEnter();
    expect(tooltip.isOpen()).toBe(false);
    expect(clock.pending[0].ms).toBe(200);
    clock.run();
    expect(tooltip.isOpen()).toBe(true);
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
  });

  it('a pointer that leaves before the delay never opens it', () => {
    const clock = fakeSchedule();
    const tooltip = createTooltipModel({ schedule: clock.schedule });
    tooltip.pointerEnter();
    tooltip.pointerLeave();
    clock.run();
    expect(tooltip.isOpen()).toBe(false);
  });

  it('stays open while the pointer travels from the trigger to the tooltip', () => {
    const clock = fakeSchedule();
    const tooltip = createTooltipModel({ schedule: clock.schedule });
    tooltip.focus();
    tooltip.pointerLeave();
    expect(tooltip.isOpen()).toBe(true);
    tooltip.pointerEnter();
    expect(clock.pending).toHaveLength(0);
    clock.run();
    expect(tooltip.isOpen()).toBe(true);
    tooltip.pointerLeave();
    clock.run();
    expect(tooltip.isOpen()).toBe(false);
  });

  it('focus and blur act at once; a tap toggles', () => {
    const tooltip = createTooltipModel({ schedule: fakeSchedule().schedule });
    tooltip.focus();
    expect(tooltip.isOpen()).toBe(true);
    tooltip.blur();
    expect(tooltip.isOpen()).toBe(false);
    tooltip.press();
    expect(tooltip.isOpen()).toBe(true);
    tooltip.press();
    expect(tooltip.isOpen()).toBe(false);
  });

  it('Escape closes and cancels a pending open', () => {
    const clock = fakeSchedule();
    const tooltip = createTooltipModel({ schedule: clock.schedule });
    tooltip.focus();
    expect(tooltip.dismiss()).toBe(true);
    expect(tooltip.dismiss()).toBe(false);
    tooltip.pointerEnter();
    tooltip.dismiss();
    expect(clock.pending).toHaveLength(0);
  });

  it('refuses while disabled and closes when disabled while open', () => {
    let disabled = false;
    const tooltip = createTooltipModel({
      schedule: fakeSchedule().schedule,
      disabled: () => disabled,
    });
    tooltip.focus();
    disabled = true;
    tooltip.refresh();
    expect(tooltip.isOpen()).toBe(false);
    tooltip.focus();
    tooltip.press();
    expect(tooltip.isOpen()).toBe(false);
  });
});

describe('createTooltip', () => {
  it('follows the model and closes when disabled while open', () => {
    const clock = fakeSchedule();
    const isDisabled = box(false);
    const onOpenChange = vi.fn();
    const { value: tooltip, unmount } = run(() =>
      createTooltip({
        isDisabled: () => isDisabled.value,
        onOpenChange,
        schedule: clock.schedule,
      })
    );
    tooltip.handleFocusIn();
    flushSync();
    expect(tooltip.isOpen).toBe(true);
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);

    isDisabled.value = true;
    flushSync();
    expect(tooltip.isOpen).toBe(false);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    unmount();
  });

  it('a mouse hovers with intent; a touch pointer taps', () => {
    const clock = fakeSchedule();
    const { value: tooltip, unmount } = run(() =>
      createTooltip({ isDisabled: () => false, schedule: clock.schedule })
    );
    tooltip.handlePointerEnter({ pointerType: 'mouse' } as PointerEvent);
    expect(clock.pending).toHaveLength(1);
    clock.run();
    flushSync();
    expect(tooltip.isOpen).toBe(true);
    tooltip.handlePointerLeave({ pointerType: 'mouse' } as PointerEvent);
    clock.run();
    flushSync();
    expect(tooltip.isOpen).toBe(false);

    tooltip.handlePointerDown({ pointerType: 'touch' } as PointerEvent);
    tooltip.handleClick({ detail: 1 } as MouseEvent);
    flushSync();
    expect(tooltip.isOpen).toBe(true);
    unmount();
  });
});
