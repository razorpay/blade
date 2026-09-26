import { describe, it, expect, vi, afterEach } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import BottomSheetHarness from './fixtures/BottomSheetHarness.svelte';

// Blade-owned: BottomSheet ships whole, over Modal with `bottomSheetLook`.
// The modal's behaviour (model, layers, focus, the drag) is tested in
// modal.test.ts; this covers the spelling — the fixed look, the props it
// forwards and the axes it keeps.
describe('BottomSheet (blade)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders nothing while closed and a bottom-anchored modal once open', async () => {
    const { queryByTestId, getByTestId, getByRole } =
      render(BottomSheetHarness);
    expect(queryByTestId('sheet')).toBeNull();

    await fireEvent.click(getByTestId('trigger'));

    const panel = getByRole('dialog', { name: 'Enter OTP' });
    expect(panel).toBe(getByTestId('sheet'));
    expect(panel.className).toContain('rounded-tl-small');
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
    expect(onDismiss).toHaveBeenCalledExactlyOnceWith('programmatic');
    expect(queryByTestId('sheet')).toBeNull();
    expect(getByTestId('bound').textContent).toBe('closed');
  });

  it('a drag past half its height dismisses it, as the look does', async () => {
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(400);
    const onDismiss = vi.fn();
    const { getByTestId } = render(BottomSheetHarness, {
      props: { isOpen: true, onDismiss },
    });
    const zone = getByTestId('sheet-drag-zone');
    const pointer = (type: string, clientY: number, timeStamp: number) => {
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
    expect(onDismiss).toHaveBeenCalledExactlyOnceWith('drag');
  });

  it('keeps the size and pace axes and appends the caller class last', () => {
    const { getByTestId } = render(BottomSheetHarness, {
      props: {
        isOpen: true,
        size: 'full',
        pace: 'snappy',
        className: '[z-index:70]',
      },
    });
    const panel = getByTestId('sheet');
    expect(panel.className).not.toMatch(/m:w-/);
    expect(panel.className).toContain(
      '[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]'
    );
    expect(panel.className.endsWith('[z-index:70]')).toBe(true);
  });

  it('a non-dismissible sheet ignores the backdrop but not the close button', async () => {
    const onDismiss = vi.fn();
    const { getByTestId, getByRole, queryByTestId } = render(
      BottomSheetHarness,
      { props: { isOpen: true, isDismissible: false, onDismiss } }
    );
    await fireEvent.click(getByTestId('host-backdrop'));
    expect(onDismiss).not.toHaveBeenCalled();
    expect(queryByTestId('sheet')).not.toBeNull();

    await fireEvent.click(getByRole('button', { name: 'Close' }));
    expect(onDismiss).toHaveBeenCalledExactlyOnceWith('cross');
  });
});

// `adaptive`: a sheet on phones, a centred modal on desktop. The look and
// the breakpoint are blade's; the core only asks the styles' media query.
describe('BottomSheet adaptive', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete (window as { matchMedia?: unknown }).matchMedia;
  });

  function pointer(type: string, clientY: number, timeStamp: number) {
    const event = new Event(type, { bubbles: true });
    Object.defineProperties(event, {
      clientY: { value: clientY },
      timeStamp: { value: timeStamp },
      pointerId: { value: 1 },
    });
    return event;
  }

  function adaptive(matches?: boolean, placement?: 'center' | 'bottom') {
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(400);
    if (matches !== undefined) {
      (window as { matchMedia?: unknown }).matchMedia = (query: string) => ({
        query,
        matches,
      });
    }
    const onDismiss = vi.fn();
    const queries = render(BottomSheetHarness, {
      props: { isOpen: true, adaptive: true, placement, onDismiss },
    });
    return { ...queries, onDismiss };
  }

  it('is the sheet look below the breakpoint and the centred modal above it', () => {
    const { getByTestId } = adaptive();
    const panel = getByTestId('sheet');
    const root = panel.parentElement as HTMLElement;
    expect(root.className).toContain('items-end');
    expect(root.className).toContain('m:items-center');
    expect(panel.className).toContain('rounded-tl-small');
    expect(panel.className).toContain(
      'group-data-[state=closed]:translate-y-full'
    );
    expect(panel.className).toContain(
      'm:group-data-[state=closed]:translate-y-0'
    );
    expect(panel.className).toContain('m:group-data-[state=closed]:scale-95');
    expect(panel.className).toContain('m:w-blade-400');
    const zone = getByTestId('sheet-drag-zone');
    expect(zone.className).toContain('m:cursor-auto');
    expect(zone.firstElementChild?.className).toContain('m:hidden');
  });

  it('drags to dismiss where the phone query matches', async () => {
    const { getByTestId, onDismiss } = adaptive(true);
    const zone = getByTestId('sheet-drag-zone');
    await fireEvent(zone, pointer('pointerdown', 100, 0));
    await fireEvent(zone, pointer('pointermove', 350, 2000));
    expect(getByTestId('sheet').style.transform).toBe('translateY(250px)');
    await fireEvent(zone, pointer('pointerup', 350, 2010));
    expect(onDismiss).toHaveBeenCalledExactlyOnceWith('drag');
  });

  it('takes no drag on desktop: the zone is plain content', async () => {
    const { getByTestId, onDismiss } = adaptive(false);
    const zone = getByTestId('sheet-drag-zone');
    await fireEvent(zone, pointer('pointerdown', 100, 0));
    await fireEvent(zone, pointer('pointermove', 350, 2000));
    expect(getByTestId('sheet').style.transform).toBe('');
    await fireEvent(zone, pointer('pointerup', 350, 2010));
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('placement bottom keeps the bottom edge on desktop, without handle or drag', async () => {
    const { getByTestId, onDismiss } = adaptive(false, 'bottom');
    const panel = getByTestId('sheet');
    const root = panel.parentElement as HTMLElement;
    expect(root.className).toContain('items-end');
    expect(root.className).toContain('m:justify-end');
    expect(root.className).not.toContain('m:items-center');
    expect(panel.className).toContain(
      'group-data-[state=closed]:translate-y-full'
    );
    expect(panel.className).not.toContain(
      'm:group-data-[state=closed]:scale-95'
    );
    const zone = getByTestId('sheet-drag-zone');
    expect(zone.className).toContain('m:cursor-auto');
    expect(zone.firstElementChild?.className).toContain('m:hidden');
    await fireEvent(zone, pointer('pointerdown', 100, 0));
    await fireEvent(zone, pointer('pointermove', 350, 2000));
    expect(panel.style.transform).toBe('');
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('reads placement only when adaptive: a plain sheet keeps its drag everywhere', () => {
    const { getByTestId } = render(BottomSheetHarness, {
      props: { isOpen: true, placement: 'bottom' },
    });
    const zone = getByTestId('sheet-drag-zone');
    expect(zone.className).not.toContain('m:cursor-auto');
    expect(zone.firstElementChild?.className).not.toContain('m:hidden');
  });
});
