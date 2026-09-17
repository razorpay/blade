import { afterEach, describe, expect, it } from 'vitest';
import { clearBodyScrollLocks, lockBodyScroll, unlockBodyScroll } from './bodyScrollLock';

/* jsdom has no TouchEvent, and the handlers only read `touches`. */
function dispatchTouch(type: 'touchstart' | 'touchmove', target: EventTarget, clientY = 0): Event {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'touches', { value: [{ clientY }] });
  target.dispatchEvent(event);
  return event;
}

/* jsdom reports every box as 0×0, which reads as "scrolled to both edges". */
function makeScrollable(element: HTMLElement): void {
  element.style.overflowY = 'auto';
  Object.defineProperty(element, 'scrollTop', { value: 50, writable: true });
  Object.defineProperty(element, 'scrollHeight', { value: 500 });
  Object.defineProperty(element, 'clientHeight', { value: 100 });
}

function pretendIos(): void {
  Object.defineProperty(window.navigator, 'platform', {
    value: 'iPhone',
    configurable: true,
  });
}

afterEach(() => {
  clearBodyScrollLocks();
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
  document.body.innerHTML = '';
  Object.defineProperty(window.navigator, 'platform', {
    value: 'MacIntel',
    configurable: true,
  });
});

describe('bodyScrollLock', () => {
  it('hides body overflow while locked and restores the previous value', () => {
    document.body.style.overflow = 'auto';
    const scroller = document.createElement('div');

    lockBodyScroll(scroller);
    expect(document.body.style.overflow).toBe('hidden');

    unlockBodyScroll(scroller);
    expect(document.body.style.overflow).toBe('auto');
  });

  it('keeps the lock until every holder of the same target releases it', () => {
    const scroller = document.createElement('div');

    lockBodyScroll(scroller);
    lockBodyScroll(scroller);
    unlockBodyScroll(scroller);
    expect(document.body.style.overflow).toBe('hidden');

    unlockBodyScroll(scroller);
    expect(document.body.style.overflow).toBe('');
  });

  it('keeps the lock while another target still holds one', () => {
    const sheetScroller = document.createElement('div');
    const modalSurface = document.createElement('div');

    lockBodyScroll(sheetScroller);
    lockBodyScroll(modalSurface);
    unlockBodyScroll(sheetScroller);
    expect(document.body.style.overflow).toBe('hidden');

    unlockBodyScroll(modalSurface);
    expect(document.body.style.overflow).toBe('');
  });

  it('reserves the scrollbar gap when asked', () => {
    const scroller = document.createElement('div');

    lockBodyScroll(scroller, { reserveScrollBarGap: true });
    expect(document.body.style.paddingRight).not.toBe('');

    unlockBodyScroll(scroller);
    expect(document.body.style.paddingRight).toBe('');
  });

  it('blocks touchmove outside the locked scroller on iOS', () => {
    pretendIos();
    const scroller = document.createElement('div');
    document.body.append(scroller);

    lockBodyScroll(scroller);

    expect(dispatchTouch('touchmove', document.body).defaultPrevented).toBe(true);
  });

  it('lets the locked scroller scroll, but blocks overscroll at its edges', () => {
    pretendIos();
    const scroller = document.createElement('div');
    makeScrollable(scroller);
    document.body.append(scroller);

    lockBodyScroll(scroller);

    dispatchTouch('touchstart', scroller, 100);
    expect(dispatchTouch('touchmove', scroller, 60).defaultPrevented).toBe(false);

    (scroller as { scrollTop: number }).scrollTop = 0;
    /* Dragging down at the top would otherwise chain to the page behind. */
    expect(dispatchTouch('touchmove', scroller, 140).defaultPrevented).toBe(true);
  });

  it('scrolls a scrollable descendant of the locked target on iOS', () => {
    pretendIos();
    /* Modal locks its whole surface, but the scrolling element is the body
     * nested inside it. */
    const surface = document.createElement('div');
    const body = document.createElement('div');
    makeScrollable(body);
    surface.append(body);
    document.body.append(surface);

    lockBodyScroll(surface);

    dispatchTouch('touchstart', body, 100);
    expect(dispatchTouch('touchmove', body, 60).defaultPrevented).toBe(false);
    /* The surface itself has nothing to scroll. */
    expect(dispatchTouch('touchmove', surface, 60).defaultPrevented).toBe(true);
  });

  it('honours the allowTouchMove escape hatch on iOS', () => {
    pretendIos();
    const scroller = document.createElement('div');
    const nestedScroller = document.createElement('div');
    nestedScroller.setAttribute('data-allow-scroll', '');
    document.body.append(scroller, nestedScroller);

    lockBodyScroll(scroller, {
      allowTouchMove: (element) => Boolean(element.closest('[data-allow-scroll]')),
    });

    expect(dispatchTouch('touchmove', nestedScroller).defaultPrevented).toBe(false);
  });
});
