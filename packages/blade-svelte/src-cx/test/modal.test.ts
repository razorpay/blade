import { describe, it, expect, vi, afterEach } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import { globalLayers } from '../runes/layer/layers';
import ModalHarness from './fixtures/ModalHarness.svelte';
import { bottomSheetLook } from '../components/bottom-sheet';
import { expectClass } from './classes';

const escape = () => fireEvent.keyDown(document, { key: 'Escape' });

describe('Modal', () => {
  it('renders nothing while closed and a named modal dialog once open', async () => {
    const { queryByTestId, getByTestId, getByRole } = render(ModalHarness);
    expect(queryByTestId('modal')).toBeNull();

    await fireEvent.click(getByTestId('trigger'));

    const modal = getByRole('dialog', { name: 'Remove card' });
    expect(modal).toBe(getByTestId('modal'));
    expect(modal.getAttribute('aria-modal')).toBe('true');
    // Classes come from the component's own styles.
    expectClass(modal, 'bg-popup-gray-subtle');
    expect(getByRole('button', { name: 'Close' })).toBeTruthy();
  });

  it('accessibilityLabel names the modal when there is no title', () => {
    const { getByRole } = render(ModalHarness, {
      props: { isOpen: true, title: '', accessibilityLabel: 'Confirm' },
    });
    expect(getByRole('dialog', { name: 'Confirm' })).toBeTruthy();
  });

  it('title takes a snippet and still names the modal', () => {
    const { getByRole } = render(ModalHarness, {
      props: { isOpen: true, withTitleSnippet: true },
    });
    expect(getByRole('dialog', { name: 'Remove this card' })).toBeTruthy();
  });

  it('header content sits under the title, which still names the modal', () => {
    const { getByRole, getByTestId } = render(ModalHarness, {
      props: { isOpen: true, withHeader: true },
    });
    const modal = getByRole('dialog', { name: 'Remove card' });
    const subtitle = getByTestId('subtitle');
    expect(modal.contains(subtitle)).toBe(true);
    // The title over the header snippet, in Blade's BaseHeader box.
    const title = subtitle.previousElementSibling as HTMLElement;
    expect(title.textContent).toBe('Remove card');
    expectClass(title, 'text-200');
    expectClass(title.closest('.border-b-thin') as HTMLElement, 'p-4');
  });

  it('body gets the padded container; children render raw and win over body', () => {
    const asBody = render(ModalHarness, {
      props: { isOpen: true, content: 'body' },
    });
    const wrapped = asBody.getByTestId('body-first').parentElement;
    expect(wrapped).not.toBe(asBody.getByTestId('modal'));
    expectClass(wrapped as HTMLElement, 'p-5');
    asBody.unmount();

    const both = render(ModalHarness, {
      props: { isOpen: true, content: 'both' },
    });
    expect(both.getByTestId('first').parentElement).toBe(
      both.getByTestId('modal')
    );
    expect(both.queryByTestId('body-first')).toBeNull();
  });

  it('the close button exists only when it has a name', () => {
    const { queryByRole } = render(ModalHarness, {
      props: { isOpen: true, closeLabel: '' },
    });
    expect(queryByRole('button', { name: 'Close' })).toBeNull();
  });

  it('resolves style props and appends the caller class last', () => {
    const { getByTestId } = render(ModalHarness, {
      props: { isOpen: true, placement: 'bottom', className: '[z-index:70]' },
    });
    const panel = getByTestId('modal');
    expectClass(panel.parentElement as HTMLElement, 'items-end');
    expect(panel.className.endsWith('[z-index:70]')).toBe(true);
  });

  it('a right drawer parks off its edge, at the pace asked for', () => {
    const { getByTestId } = render(ModalHarness, {
      props: { isOpen: true, placement: 'right', pace: 'snappy' },
    });
    const panel = getByTestId('modal');
    expect(panel.parentElement?.className).toContain('justify-end');
    expect(panel.className).toContain(
      'group-data-[state=closed]:translate-x-full'
    );
    expect(panel.className).toContain(
      '[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]'
    );
    expect(panel.className).not.toContain('ease-entrance');
  });

  it('size: a fixed desktop column by default, the host width as full', async () => {
    const { getByTestId, rerender } = render(ModalHarness, {
      props: { isOpen: true, placement: 'bottom' },
    });
    expect(getByTestId('modal').className).toContain('m:w-blade-400');

    await rerender({ isOpen: true, placement: 'bottom', size: 'full' });
    const panel = getByTestId('modal');
    expect(panel.className).toContain('w-full');
    expect(panel.className).not.toMatch(/m:w-/);
  });

  it.each([
    ['the close button', 'cross'],
    ['the backdrop', 'blur'],
    ['Escape', 'escape'],
    ['the content', 'programmatic'],
  ])('%s closes it and reports %s', async (_via, source) => {
    const onDismiss = vi.fn();
    const { getByTestId, getByRole, queryByTestId } = render(ModalHarness, {
      props: { withHost: true, onDismiss },
    });
    await fireEvent.click(getByTestId('trigger'));

    if (source === 'cross') {
      await fireEvent.click(getByRole('button', { name: 'Close' }));
    } else if (source === 'blur') {
      // The scrim is the host's, one under every open modal.
      await fireEvent.click(getByTestId('host-backdrop'));
    } else if (source === 'escape') {
      await escape();
    } else {
      await fireEvent.click(getByTestId('cancel'));
    }

    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledWith(source);
    expect(queryByTestId('modal')).toBeNull();
  });

  it('a non-dismissible modal ignores backdrop and Escape, and has no close button', async () => {
    const onDismiss = vi.fn();
    const { getByTestId, queryByRole, queryByTestId } = render(ModalHarness, {
      props: { withHost: true, isDismissible: false, onDismiss },
    });
    await fireEvent.click(getByTestId('trigger'));

    await fireEvent.click(getByTestId('host-backdrop'));
    await escape();
    expect(onDismiss).not.toHaveBeenCalled();
    expect(queryByTestId('modal')).not.toBeNull();
    // Blade: the close button shows only while it may dismiss.
    expect(
      queryByRole('button', { name: 'Close', hidden: false })
    ).toBeNull();
  });

  it('a close made by the host does not report a dismiss', async () => {
    const onDismiss = vi.fn();
    const { queryByTestId, rerender } = render(ModalHarness, {
      props: { isOpen: true, onDismiss },
    });

    await rerender({ isOpen: false, onDismiss });

    expect(queryByTestId('modal')).toBeNull();
    expect(onDismiss).not.toHaveBeenCalled();
    // The layer is gone too: Escape and back find nothing.
    expect(globalLayers.back()).toBe(false);
  });

  it('moves focus in, wraps Tab at both ends and returns focus on close', async () => {
    const { getByTestId, getByRole } = render(ModalHarness);
    const trigger = getByTestId('trigger');
    trigger.focus();
    await fireEvent.click(trigger);

    const modal = getByTestId('modal');
    expect(document.activeElement).toBe(modal);

    const close = getByRole('button', { name: 'Close' });
    const last = getByTestId('last');
    last.focus();
    await fireEvent.keyDown(last, { key: 'Tab' });
    expect(document.activeElement).toBe(close);

    await fireEvent.keyDown(close, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(last);

    await escape();
    expect(document.activeElement).toBe(trigger);
  });
});

describe('Modal presence', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete (Element.prototype as { animate?: unknown }).animate;
  });

  it('stays mounted with data-state=closed until the style transition ends', async () => {
    // jsdom computes no transitions and has no WAAPI: report the styles'
    // 300ms and hand Svelte a controllable animation clock.
    const real = window.getComputedStyle.bind(window);
    vi.spyOn(window, 'getComputedStyle').mockImplementation((element) =>
      Object.assign(Object.create(real(element)), {
        transitionDuration: '0.3s',
        transitionDelay: '0s',
      })
    );
    const running: Array<{ onfinish: () => void }> = [];
    (Element.prototype as { animate?: unknown }).animate = () => {
      const animation = {
        onfinish: () => {},
        cancel: () => {},
        currentTime: 0,
      };
      running.push(animation);
      return animation;
    };
    const finish = async () => {
      while (running.length) {
        running.shift()?.onfinish();
        await Promise.resolve();
      }
    };

    const { getByTestId, queryByTestId } = render(ModalHarness);
    await fireEvent.click(getByTestId('trigger'));
    const root = getByTestId('modal').parentElement as HTMLElement;
    expect(root.dataset.state).toBe('closed');
    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect(root.dataset.state).toBe('open');
    await finish();

    await escape();
    // Closed for the model and the host, but still in the DOM, animating.
    expect(queryByTestId('modal')).not.toBeNull();
    expect(root.dataset.state).toBe('closed');

    await finish();
    expect(queryByTestId('modal')).toBeNull();
  });
});

// The look, and the drag it switches on, are blade's.
describe('Modal look={bottomSheetLook}', () => {
  // jsdom has no PointerEvent: a plain event carrying what the handler reads.
  function pointer(type: string, clientY: number, timeStamp: number) {
    const event = new Event(type, { bubbles: true });
    Object.defineProperties(event, {
      clientY: { value: clientY },
      timeStamp: { value: timeStamp },
      pointerId: { value: 1 },
    });
    return event;
  }

  function sheet(props: Record<string, unknown> = {}) {
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(400);
    const onDismiss = vi.fn();
    const queries = render(ModalHarness, {
      props: { isOpen: true, look: bottomSheetLook, onDismiss, ...props },
    });
    return { ...queries, onDismiss };
  }

  it('sits at the bottom with a handle; the default look has none', () => {
    const { getByTestId, unmount } = sheet({ placement: 'center' });
    expectClass(getByTestId('modal'), 'rounded-tl-large');
    expectClass(getByTestId('modal-drag-zone'), 'touch-none');
    unmount();
    vi.restoreAllMocks();

    const plain = render(ModalHarness, { props: { isOpen: true } });
    expect(plain.queryByTestId('modal-drag-zone')).toBeNull();
  });

  it('follows the finger, then dismisses with source drag past half its height', async () => {
    const { getByTestId, onDismiss } = sheet();
    const handle = getByTestId('modal-drag-zone');
    const panel = getByTestId('modal');

    await fireEvent(handle, pointer('pointerdown', 100, 0));
    await fireEvent(handle, pointer('pointermove', 350, 2000));
    expect(panel.style.transform).toBe('translateY(250px)');
    expect(panel.style.transition).toBe('none');

    await fireEvent(handle, pointer('pointerup', 350, 2010));
    expect(onDismiss).toHaveBeenCalledExactlyOnceWith('drag');
    // Inline styles are gone: the component's own transition carries it out.
    expect(panel.style.transform).toBe('');
    vi.restoreAllMocks();
  });

  it('a press on the close button in the drag zone is a click, not a drag', async () => {
    const { getByTestId, getByLabelText, onDismiss } = sheet();
    const close = getByLabelText('Close');
    expect(getByTestId('modal-drag-zone').contains(close)).toBe(true);
    await fireEvent(close, pointer('pointerdown', 100, 0));
    expect(getByTestId('modal').style.transform).toBe('');
    await fireEvent(close, pointer('pointerup', 100, 0));
    await fireEvent.click(close);
    expect(onDismiss).toHaveBeenCalledExactlyOnceWith('cross');
    vi.restoreAllMocks();
  });

  it('the header is part of the drag zone', async () => {
    const { getByTestId, getByText, onDismiss } = sheet();
    const zone = getByTestId('modal-drag-zone');
    const title = getByText('Remove card');
    expect(zone.contains(title)).toBe(true);

    await fireEvent(title, pointer('pointerdown', 100, 0));
    await fireEvent(title, pointer('pointermove', 350, 2000));
    expect(getByTestId('modal').style.transform).toBe('translateY(250px)');
    await fireEvent(title, pointer('pointerup', 350, 2010));
    expect(onDismiss).toHaveBeenCalledExactlyOnceWith('drag');
    vi.restoreAllMocks();
  });

  it('a short drag settles back and dismisses nothing', async () => {
    const { getByTestId, onDismiss } = sheet();
    const handle = getByTestId('modal-drag-zone');
    await fireEvent(handle, pointer('pointerdown', 100, 0));
    await fireEvent(handle, pointer('pointermove', 160, 2000));
    await fireEvent(handle, pointer('pointerup', 160, 2010));
    expect(onDismiss).not.toHaveBeenCalled();
    expect(getByTestId('modal').style.transform).toBe('');
    vi.restoreAllMocks();
  });

  it('thins the host scrim as it follows the finger, and hands it back on release', async () => {
    const { getByTestId } = sheet({ withHost: true });
    const zone = getByTestId('modal-drag-zone');
    const scrim = getByTestId('host-backdrop');
    await fireEvent(zone, pointer('pointerdown', 100, 0));
    await fireEvent(zone, pointer('pointermove', 200, 2000));
    expect(scrim.style.opacity).toBe('0.75');
    expect(scrim.style.transition).toBe('none');
    await fireEvent(zone, pointer('pointerup', 200, 2010));
    expect(scrim.style.opacity).toBe('');
    expect(scrim.style.transition).toBe('');
    vi.restoreAllMocks();
  });

  it('resists and stays open when it is not dismissible', async () => {
    const { getByTestId, onDismiss } = sheet({ isDismissible: false });
    const handle = getByTestId('modal-drag-zone');
    await fireEvent(handle, pointer('pointerdown', 100, 0));
    await fireEvent(handle, pointer('pointermove', 500, 2000));
    expect(getByTestId('modal').style.transform).toBe('translateY(100px)');
    await fireEvent(handle, pointer('pointerup', 500, 2010));
    expect(onDismiss).not.toHaveBeenCalled();
    vi.restoreAllMocks();
  });
});

describe('Modal layers', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('Escape reaches only the top modal, and the lower one goes inert', async () => {
    const onDismiss = vi.fn();
    const onNestedDismiss = vi.fn();
    const { getByTestId, queryByTestId } = render(ModalHarness, {
      props: { isOpen: true, nestedOpen: true, onDismiss, onNestedDismiss },
    });
    const lower = getByTestId('modal').parentElement as HTMLElement;
    expect(lower.inert).toBe(true);

    await escape();
    expect(onNestedDismiss).toHaveBeenCalledWith('escape');
    expect(onDismiss).not.toHaveBeenCalled();
    expect(queryByTestId('nested')).toBeNull();
    expect(lower.inert).toBe(false);

    await escape();
    expect(onDismiss).toHaveBeenCalledWith('escape');
  });

  it('back follows the content contract', async () => {
    const onDismiss = vi.fn();
    let answer: boolean | undefined = true;
    const { queryByTestId } = render(ModalHarness, {
      props: {
        isOpen: true,
        isDismissible: false,
        onDismiss,
        onBack: () => answer,
      },
    });

    // The content owns back: handled, nothing closes.
    expect(globalLayers.back()).toBe(true);
    expect(queryByTestId('modal')).not.toBeNull();

    // No opinion and not dismissible: swallowed, still open.
    answer = undefined;
    expect(globalLayers.back()).toBe(true);
    expect(onDismiss).not.toHaveBeenCalled();

    // The content cedes: closes even though it is not dismissible.
    answer = false;
    expect(globalLayers.back()).toBe(true);
    expect(onDismiss).toHaveBeenCalledWith('back');
  });

  it('renders into the LayerHost and makes the rest of the frame inert', async () => {
    const { getByTestId } = render(ModalHarness, {
      props: { withHost: true },
    });
    const host = getByTestId('host');
    const page = getByTestId('page');
    expect(page.hasAttribute('inert')).toBe(false);

    await fireEvent.click(getByTestId('trigger'));
    expect(host.contains(getByTestId('modal'))).toBe(true);
    expect(getByTestId('host-surfaces').contains(getByTestId('modal'))).toBe(
      true
    );
    expect(getByTestId('host-backdrop').dataset.state).toBe('open');
    expect(page.hasAttribute('inert')).toBe(true);

    await escape();
    expect(getByTestId('host-surfaces').children).toHaveLength(0);
    expect(getByTestId('host-backdrop').dataset.state).toBe('closed');
    expect(page.hasAttribute('inert')).toBe(false);
  });

  it('stacked modals share the host scrim, and a tap on it closes the top one only', async () => {
    const onDismiss = vi.fn();
    const onNestedDismiss = vi.fn();
    // Both open at mount, in tree order: the nested one is on top.
    const { getByTestId, queryByTestId } = render(ModalHarness, {
      props: {
        withHost: true,
        isOpen: true,
        nestedOpen: true,
        onDismiss,
        onNestedDismiss,
      },
    });
    const surfaces = getByTestId('host-surfaces');
    const scrim = getByTestId('host-backdrop');
    expect(surfaces.children).toHaveLength(2);
    // No scrim of their own: each root starts with its panel.
    expect(getByTestId('modal').parentElement?.firstElementChild).toBe(
      getByTestId('modal')
    );
    expect(getByTestId('nested').parentElement?.firstElementChild).toBe(
      getByTestId('nested')
    );
    expect(scrim.dataset.state).toBe('open');

    await fireEvent.click(scrim);
    expect(onNestedDismiss).toHaveBeenCalledExactlyOnceWith('blur');
    expect(onDismiss).not.toHaveBeenCalled();
    expect(queryByTestId('nested')).toBeNull();
    // One modal still open: the scrim stays.
    expect(scrim.dataset.state).toBe('open');

    await fireEvent.click(scrim);
    expect(onDismiss).toHaveBeenCalledExactlyOnceWith('blur');
    expect(scrim.dataset.state).toBe('closed');
  });
});
