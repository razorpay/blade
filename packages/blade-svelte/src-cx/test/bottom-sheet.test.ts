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
    expect(panel.className).toContain('m:w-[400px]');
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

// The variant per breakpoint: `{ base: 'sheet', m: 'modal' }` is a sheet on
// phones and a modal from `m` up, resolved from the viewport in JS — so the
// drag, the handle and the parking all switch with it.
describe('BottomSheet variant per breakpoint', () => {
  let width = 390;
  let listeners: Array<() => void> = [];

  function stubViewport(initial: number): void {
    width = initial;
    listeners = [];
    (window as { matchMedia?: unknown }).matchMedia = (query: string) => ({
      query,
      get matches() {
        return width >= Number(/(\d+)px/.exec(query)?.[1] ?? 0);
      },
      addEventListener: (_: string, listener: () => void) => listeners.push(listener),
      removeEventListener: (_: string, listener: () => void) => {
        listeners = listeners.filter((l) => l !== listener);
      },
    });
  }

  afterEach(() => {
    vi.restoreAllMocks();
    delete (window as { matchMedia?: unknown }).matchMedia;
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

  function open(): RenderResult<typeof BottomSheetHarness> & { onDismiss: Mock } {
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(400);
    const onDismiss = vi.fn();
    const queries = render(BottomSheetHarness, {
      props: { isOpen: true, variant: { base: 'sheet', m: 'modal' }, onDismiss },
    });
    return { ...queries, onDismiss };
  }

  it('is a sheet on a phone: bottom edge, handle, drag to dismiss', async () => {
    stubViewport(390);
    const { getByTestId, onDismiss } = open();
    const panel = getByTestId('sheet');
    expect(panel.parentElement!.className).toContain('items-end');
    expect(panel.className).toContain('rounded-tl-large');
    const zone = getByTestId('sheet-drag-zone');
    await fireEvent(zone, pointer('pointerdown', 100, 0));
    await fireEvent(zone, pointer('pointermove', 350, 2000));
    expect(panel.style.transform).toBe('translateY(250px)');
    await fireEvent(zone, pointer('pointerup', 350, 2010));
    expect(onDismiss).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ source: 'drag' }));
  });

  it('is a centred modal on desktop: no handle, no drag', () => {
    stubViewport(1200);
    const { getByTestId, queryByTestId } = open();
    const panel = getByTestId('sheet');
    expect(panel.parentElement!.className).toContain('items-center');
    expect(panel.className).toContain('rounded-large');
    expect(panel.className).toContain('group-data-[state=closed]:scale-95');
    expect(queryByTestId('sheet-drag-zone')).toBeNull();
  });

  it('switches while open when the viewport crosses the breakpoint', async () => {
    stubViewport(1200);
    const { getByTestId, queryByTestId } = open();
    expect(queryByTestId('sheet-drag-zone')).toBeNull();
    width = 390;
    listeners.forEach((listener) => listener());
    await Promise.resolve();
    expect(getByTestId('sheet-drag-zone')).toBeTruthy();
  });

  it('renders the base variant where nothing can measure (no matchMedia)', () => {
    const { getByTestId } = open();
    expect(getByTestId('sheet-drag-zone')).toBeTruthy();
  });

  it('a BottomSheet with no variant is a sheet at every width', () => {
    stubViewport(1200);
    const { getByTestId } = render(BottomSheetHarness, { props: { isOpen: true } });
    expect(getByTestId('sheet-drag-zone')).toBeTruthy();
  });
});
