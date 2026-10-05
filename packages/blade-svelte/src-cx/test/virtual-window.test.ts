import { afterEach, describe, it, expect, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { tick } from 'svelte';
import OptionListHarness from './fixtures/OptionListHarness.svelte';

const banks = Array.from({ length: 200 }, (_, i) => ({
  code: `b${i}`,
  name: `Bank ${i}`,
}));

// jsdom has no layout: rows are 40px, except every fifth which is 80px, and
// the viewport is 200px tall.
function stubLayout(): void {
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(200);
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function boundingRect(
    this: HTMLElement,
  ) {
    const id = this.querySelector('input')?.getAttribute('data-testid');
    const index = Number(id?.split('-')[1] ?? 0);
    const height = index % 5 === 0 ? 80 : 40;
    return { height, width: 300, top: 0, left: 0 } as DOMRect;
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const mounted = (container: HTMLElement): number[] =>
  Array.from(container.querySelectorAll('input[data-testid^="banks-"]')).map((input) =>
    Number(input.getAttribute('data-testid')?.split('-')[1]),
  );

describe('OptionList virtualize', () => {
  it('mounts only the rows in view and pads for the predicted rest', async () => {
    stubLayout();
    const { container, getByTestId } = render(OptionListHarness, {
      props: { banks, virtualize: true },
    });
    await waitFor(() => expect(mounted(container).length).toBeGreaterThan(0));
    const rows = mounted(container);
    expect(rows[0]).toBe(0);
    expect(rows.length).toBeLessThan(20);

    // The rest of the list is predicted from the rows measured so far.
    const content = getByTestId('banks-0').closest('label')!.parentElement!;
    await waitFor(() => expect(parseFloat(content.style.paddingBottom)).toBeGreaterThan(7000));
    expect(content.style.paddingTop).toBe('0px');
  });

  it('scrolling moves the slice and keeps global indexes', async () => {
    stubLayout();
    const { container } = render(OptionListHarness, {
      props: { banks, virtualize: true },
    });
    await waitFor(() => expect(mounted(container).length).toBeGreaterThan(0));
    const viewport = container.querySelector('[style*="overflow-anchor"]')!;

    viewport.scrollTop = 4800;
    await fireEvent.scroll(viewport);
    await waitFor(() => expect(mounted(container)[0]).toBeGreaterThan(50));
    const rows = mounted(container);
    expect(rows).toEqual(rows.map((_, i) => rows[0] + i));
  });

  it('opens scrolled to the pick, not the top', async () => {
    stubLayout();
    const { container } = render(OptionListHarness, {
      props: { banks, virtualize: true, value: banks[150] },
    });
    await waitFor(() => expect(mounted(container)).toContain(150));
    const viewport = container.querySelector('[style*="overflow-anchor"]')!;
    expect(viewport.scrollTop).toBeGreaterThan(0);
    // The pick is the tab stop, mounted where it is.
    expect(container.querySelector<HTMLElement>('input[tabindex="0"]')!.dataset.testid).toBe(
      'banks-150',
    );
  });

  it('keeps its one tab stop mounted: a pick beyond the slice hands it to the first row in view', async () => {
    stubLayout();
    const { container, getByTestId } = render(OptionListHarness, {
      props: { banks, virtualize: true, value: banks[150] },
    });
    await waitFor(() => expect(mounted(container)).toContain(150));
    const viewport = container.querySelector('[style*="overflow-anchor"]')!;
    viewport.scrollTop = 0;
    await fireEvent.scroll(viewport);
    await waitFor(() => expect(mounted(container)).not.toContain(150));
    const stops = Array.from(container.querySelectorAll<HTMLInputElement>('input[tabindex="0"]'));
    expect(stops).toEqual([getByTestId('banks-0')]);
    // Reached, the row becomes where the keyboard continues from.
    getByTestId('banks-0').focus();
    await fireEvent.keyDown(getByTestId('banks-0'), { key: 'ArrowDown' });
    expect(document.activeElement).toBe(getByTestId('banks-1'));
  });

  it('a pick survives its row unmounting and coming back', async () => {
    stubLayout();
    const { container, getByTestId } = render(OptionListHarness, {
      props: { banks, virtualize: true },
    });
    await waitFor(() => expect(mounted(container).length).toBeGreaterThan(0));
    await fireEvent.click(getByTestId('banks-1'));
    const viewport = container.querySelector('[style*="overflow-anchor"]')!;

    viewport.scrollTop = 4800;
    await fireEvent.scroll(viewport);
    await waitFor(() => expect(mounted(container)).not.toContain(1));
    expect(getByTestId('bound').textContent).toBe('b1');

    viewport.scrollTop = 0;
    await fireEvent.scroll(viewport);
    await waitFor(() => expect(mounted(container)).toContain(1));
    expect((getByTestId('banks-1') as HTMLInputElement).checked).toBe(true);
  });

  it('corrects the scroll position when rows above are re-measured', async () => {
    stubLayout();
    const { container } = render(OptionListHarness, {
      props: { banks, virtualize: true },
    });
    await waitFor(() => expect(mounted(container).length).toBeGreaterThan(0));
    const viewport = container.querySelector('[style*="overflow-anchor"]')!;

    // Jump far down: everything above is predicted, then the first real
    // rows there shift the estimate — the view must be moved with it.
    viewport.scrollTop = 4800;
    await fireEvent.scroll(viewport);
    await waitFor(() => expect(viewport.scrollTop).not.toBe(4800));
  });

  it('End reaches the true last row: the window scrolls to mount it', async () => {
    stubLayout();
    const { container, getByTestId } = render(OptionListHarness, {
      props: { banks, virtualize: true },
    });
    await waitFor(() => expect(mounted(container).length).toBeGreaterThan(0));
    getByTestId('banks-0').focus();
    await fireEvent.focusIn(getByTestId('banks-0'));
    await fireEvent.keyDown(getByTestId('banks-0'), { key: 'End' });
    await waitFor(() => expect(mounted(container)).toContain(199));
    await waitFor(() => expect(document.activeElement).toBe(getByTestId('banks-199')));
  });

  it('a resize notification measures on the next frame, not in the callback', async () => {
    stubLayout();
    // jsdom has neither: a ResizeObserver the test fires, and frames it runs.
    const observers: Array<() => void> = [];
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          observers.push(callback);
        }
        observe(): void {
          // noop
        }
        disconnect(): void {
          // noop
        }
      },
    );
    const frames: FrameRequestCallback[] = [];
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.push(callback);
      return frames.length;
    });
    vi.stubGlobal('cancelAnimationFrame', () => {
      // noop
    });

    const { container } = render(OptionListHarness, {
      props: { banks, virtualize: true },
    });
    await waitFor(() => expect(mounted(container).length).toBeGreaterThan(0));
    const content = container.querySelector<HTMLElement>('[style*="overflow-anchor"] > div')!;
    const before = content.style.paddingBottom;
    expect(before).not.toBe('');

    // Every row grows to 120px, and the observer says so.
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      height: 120,
      width: 300,
      top: 0,
      left: 0,
    } as DOMRect);
    frames.length = 0;
    observers.at(-1)?.();
    await tick();
    // Nothing moved yet: the measure waits for the frame.
    expect(content.style.paddingBottom).toBe(before);
    expect(frames).toHaveLength(1);

    frames[0](0);
    await waitFor(() => expect(content.style.paddingBottom).not.toBe(before));
  });
});
