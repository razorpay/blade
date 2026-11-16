import { holdNearPointer } from '../hoverSlots';

/** a 100 x 30 button with its top `top` px down the page */
const buttonAt = (top: number): HTMLElement => {
  const button = document.createElement('button');
  button.getBoundingClientRect = () =>
    ({
      left: 0,
      top,
      right: 100,
      bottom: top + 30,
      width: 100,
      height: 30,
      x: 0,
      y: top,
    } as DOMRect);
  document.body.append(button);
  return button;
};
const nextFrame = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 50));
const moveTo = (x: number, y: number): void => {
  window.dispatchEvent(new MouseEvent('pointermove', { clientX: x, clientY: y }));
};

describe('holdNearPointer', () => {
  it('holds the hovers the pointer is near, at most three, and lets them go as it moves away', async () => {
    const held: boolean[] = [];
    let isBusy = false;
    // five buttons 10 px apart: all within reach of a pointer on the middle one
    const slots = [0, 10, 20, 30, 40].map((top, i) =>
      holdNearPointer(buttonAt(top), {
        isBusy: () => i === 0 && isBusy,
        onHold: (isHeld) => {
          held[i] = isHeld;
        },
      }),
    );
    await nextFrame();
    // no pointer yet: nothing made
    expect(held.filter(Boolean)).toHaveLength(0);

    moveTo(50, 55);
    await nextFrame();
    // the three nearest (the pointer's on 2, 3 and 4)
    expect(held).toEqual([undefined, undefined, true, true, true]);

    moveTo(50, 500);
    await nextFrame();
    expect(held.filter(Boolean)).toHaveLength(0);

    // a hover still running or fading isn't let go, however far the pointer is
    moveTo(50, 15);
    await nextFrame();
    isBusy = true;
    moveTo(50, 500);
    await nextFrame();
    expect(held[0]).toBe(true);
    isBusy = false;
    slots[0].update();
    await nextFrame();
    expect(held[0]).toBe(false);

    slots.forEach((slot) => slot.remove());
  });

  it('holds a hover from where its own event says the pointer is, with no move before it', async () => {
    let isHeld = false;
    // (a pointer that never moved since: the page scrolled under it, say)
    const slot = holdNearPointer(buttonAt(1000), {
      isBusy: () => false,
      onHold: (held) => {
        isHeld = held;
      },
    });
    await nextFrame();
    expect(isHeld).toBe(false);
    slot.update([50, 1010]);
    await nextFrame();
    expect(isHeld).toBe(true);
    slot.remove();
  });
});
