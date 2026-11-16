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
const wait = (ms = 50): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
const moveTo = (x: number, y: number): void => {
  window.dispatchEvent(new MouseEvent('pointermove', { clientX: x, clientY: y }));
};

describe('holdNearPointer', () => {
  it('holds the button the pointer is on at once, and a neighbour only once the pointer stops next to it', async () => {
    const held: boolean[] = [];
    // five rows 40 px apart (10 px between them)
    const slots = [0, 40, 80, 120, 160].map((top, i) =>
      holdNearPointer(buttonAt(top), {
        isBusy: () => false,
        onHold: (isHeld) => {
          held[i] = isHeld;
        },
      }),
    );
    await wait();
    // no pointer yet: nothing made
    expect(held.filter(Boolean)).toHaveLength(0);

    // on row 1: only row 1 (resting on a button doesn't make its neighbours)
    moveTo(50, 55);
    await wait(200);
    expect(held).toEqual([undefined, true, undefined, undefined, undefined]);

    // into the gap below it: row 1 is kept (still within reach), row 2 waits for the pointer to stay
    moveTo(50, 75);
    await wait();
    expect(held).toEqual([undefined, true, undefined, undefined, undefined]);
    await wait(150);
    expect(held).toEqual([undefined, true, true, undefined, undefined]);

    // far away: all let go
    moveTo(50, 900);
    await wait();
    expect(held.filter(Boolean)).toHaveLength(0);

    slots.forEach((slot) => slot.remove());
  });

  it('keeps a hover that is still running or fading, and holds at most three', async () => {
    const held: boolean[] = [];
    let isBusy = false;
    const slots = [0, 40, 80, 120].map((top, i) =>
      holdNearPointer(buttonAt(top), {
        isBusy: () => isBusy,
        onHold: (isHeld) => {
          held[i] = isHeld;
        },
      }),
    );
    moveTo(50, 15);
    await wait();
    expect(held[0]).toBe(true);
    // all four running (a quick pass over them): the three nearest the pointer kept
    isBusy = true;
    moveTo(50, 500);
    await wait();
    expect(held.filter(Boolean)).toHaveLength(3);
    isBusy = false;
    slots[0].update();
    await wait();
    expect(held.filter(Boolean)).toHaveLength(0);
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
    await wait();
    expect(isHeld).toBe(false);
    slot.update([50, 1010]);
    await wait();
    expect(isHeld).toBe(true);
    slot.remove();
  });
});
