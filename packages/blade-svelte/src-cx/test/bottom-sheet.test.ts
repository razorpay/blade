import { describe, it, expect, vi, afterEach } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import BottomSheetHarness from './fixtures/BottomSheetHarness.svelte';
import type { RenderResult } from '@testing-library/svelte';
import type { Mock } from 'vitest';

// Blade-owned: BottomSheet ships whole, over Modal in its `sheet` variant.
// The modal's behaviour (model, layers, focus, the drag) is tested in
// modal.test.ts; this covers the spelling — the fixed variant, the props it
// forwards and the axes it keeps.
describe('BottomSheet (blade)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders nothing while closed and a bottom-anchored modal once open', async () => {
    const { queryByTestId, getByTestId, getByRole } = render(BottomSheetHarness);
    expect(queryByTestId('sheet')).toBeNull();

    await fireEvent.click(getByTestId('trigger'));

    const panel = getByRole('dialog', { name: 'Enter OTP' });
    expect(panel).toBe(getByTestId('sheet'));
    expect(panel.className).toContain('rounded-tl-large');
    expect(panel.parentElement?.className).toContain('items-end');
    expect(getByTestId('sheet-drag-zone').className).toContain('touch-none');
    expect(getByRole('button', { name: 'Close' })).toBeTruthy();
    expect(getByTestId('bound').textContent).toBe('open');
  });

  it('closes from its content and the binding follows', async () => {
    const onDismiss = vi.fn();
    const { getByTestId, queryByTestId } = render(BottomSheetHarness, {
      props: { isOpen: true, onDismiss },
    });
    await fireEvent.click(getByTestId('cancel'));
    expect(onDismiss).not.toHaveBeenCalled();
    expect(queryByTestId('sheet')).toBeNull();
    expect(getByTestId('bound').textContent).toBe('closed');
  });

  it('a drag past half its height dismisses it, as the sheet does', async () => {
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(400);
    const onDismiss = vi.fn();
    const { getByTestId } = render(BottomSheetHarness, {
      props: { isOpen: true, onDismiss },
    });
    const zone = getByTestId('sheet-drag-zone');
    const pointer = (type: string, clientY: number, timeStamp: number): Event => {
      const event = new Event(type, { bubbles: true });
      Object.defineProperties(event, {
        clientY: { value: clientY },
        timeStamp: { value: timeStamp },
        pointerId: { value: 1 },
      });
      return event;
    };
    await fireEvent(zone, pointer('pointerdown', 100, 0));
    await fireEvent(zone, pointer('pointermove', 350, 2000));
    await fireEvent(zone, pointer('pointerup', 350, 2010));
    expect(onDismiss).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ source: 'drag' }));
  });

  it('keeps the pace axis, is the small column from `m`, and appends the caller class last', () => {
    const { getByTestId } = render(BottomSheetHarness, {
      props: {
        isOpen: true,
        pace: 'snappy',
        className: '[z-index:70]',
      },
    });
    const panel = getByTestId('sheet');
    // Figma's Bottom Sheet has no sizes.
    expect(panel.className).toContain('d:w-[400px]');
    expect(panel.className).toContain('[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]');
    expect(panel.className.endsWith('[z-index:70]')).toBe(true);
  });

  it('a non-dismissible sheet reports the backdrop, stays open and has no close button', async () => {
    const onDismiss = vi.fn();
    const { getByTestId, queryByRole, queryByTestId } = render(BottomSheetHarness, {
      props: { isOpen: true, isDismissible: false, onDismiss },
    });
    await fireEvent.click(getByTestId('host-backdrop'));
    expect(onDismiss).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ source: 'blur' }));
    expect(queryByTestId('sheet')).not.toBeNull();
    expect(queryByRole('button', { name: 'Close' })).toBeNull();
  });
});

describe('BottomSheet isDraggable', () => {
  it("false: no handle, no drag zone, and the close button sits as a modal's", () => {
    const { getByTestId, queryByTestId, getByRole } = render(BottomSheetHarness, {
      props: { isOpen: true, isDraggable: false },
    });
    expect(queryByTestId('sheet-drag-zone')).toBeNull();
    expect(getByTestId('sheet-chrome').querySelector('div[aria-hidden="true"]')).toBeNull();
    const close = getByRole('button', { name: 'Close' });
    expect(close.className).toContain('top-5');
    expect(close.className).not.toContain('top-10');
    // Still a sheet: bottom edge, rounded top.
    expect(getByTestId('sheet').className).toContain('rounded-tl-large');
  });
});

// The variant is the app's: no breakpoint switches it.
describe('BottomSheet variant', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  function pointer(type: string, clientY: number, timeStamp: number): Event {
    const event = new Event(type, { bubbles: true });
    Object.defineProperties(event, {
      clientY: { value: clientY },
      timeStamp: { value: timeStamp },
      pointerId: { value: 1 },
    });
    return event;
  }

  function open(
    variant?: 'sheet' | 'modal',
  ): RenderResult<typeof BottomSheetHarness> & { onDismiss: Mock } {
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(400);
    const onDismiss = vi.fn();
    const queries = render(BottomSheetHarness, { props: { isOpen: true, variant, onDismiss } });
    return { ...queries, onDismiss };
  }

  it('sheet: bottom edge, handle, drag to dismiss', async () => {
    const { getByTestId, onDismiss } = open('sheet');
    const panel = getByTestId('sheet');
    expect(panel.parentElement!.className).toContain('items-end');
    expect(panel.className).toContain('rounded-tl-large');
    const zone = getByTestId('sheet-drag-zone');
    await fireEvent(zone, pointer('pointerdown', 100, 0));
    await fireEvent(zone, pointer('pointermove', 350, 2000));
    expect(panel.style.getPropertyValue('--blade-translate-y')).toBe('250px');
    await fireEvent(zone, pointer('pointerup', 350, 2010));
    expect(onDismiss).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ source: 'drag' }));
  });

  it('modal: centred, no handle, no drag', () => {
    const { getByTestId, queryByTestId } = open('modal');
    const panel = getByTestId('sheet');
    expect(panel.parentElement!.className).toContain('items-center');
    expect(panel.className).toContain('group-data-[state=closed]:scale-95');
    expect(queryByTestId('sheet-drag-zone')).toBeNull();
  });

  it('a BottomSheet with no variant is a sheet', () => {
    const { getByTestId } = open();
    expect(getByTestId('sheet-drag-zone')).toBeTruthy();
  });
});
