import { followKeyboardFocus, holdNearPointer } from '../hoverSlots';
import type { HoverSlot } from '../hoverSlots';

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
  it('holds the button the pointer is on at once, the one it heads for as it comes, and one it stops next to', async () => {
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

    // off it and heading down for row 2: row 2 is held as the pointer comes (row 1 kept, still within reach)
    moveTo(50, 72);
    await wait(20);
    moveTo(50, 76);
    await wait();
    expect(held).toEqual([undefined, true, true, undefined, undefined]);

    // far away: all let go
    moveTo(50, 900);
    await wait();
    expect(held.filter(Boolean)).toHaveLength(0);

    // after a pause, next to row 4 without coming towards it: row 4 waits for the pointer to stay
    await wait(250);
    moveTo(90, 117);
    await wait(20);
    expect(held[3]).not.toBe(true);
    await wait(150);
    expect(held[3]).toBe(true);

    slots.forEach((slot) => slot.remove());
  });

  it("doesn't take a button added near the pointer as the one it's heading for", async () => {
    let isHeld = false;
    // a button far off, so the pointer is followed, and the pointer resting (a check just run)
    const far = holdNearPointer(buttonAt(5000), { isBusy: () => false, onHold: () => undefined });
    await wait();
    moveTo(50, 2060);
    await wait(20);
    // then a button comes in 60 px below it: past dwelling reach, within approach, and the pointer isn't coming
    const slot = holdNearPointer(buttonAt(2060 + 60), {
      isBusy: () => false,
      onHold: (held) => {
        isHeld = held;
      },
    });
    await wait(30);
    expect(isHeld).toBe(false);
    slot.remove();
    far.remove();
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

  it('holds the button the pointer is on even when three others are still fading', async () => {
    const held: boolean[] = [];
    // three just passed over (still fading), and the pointer on the fourth
    const slots = [3000, 3040, 3080, 3120].map((top, i) =>
      holdNearPointer(buttonAt(top), {
        isBusy: () => i < 3,
        onHold: (isHeld) => {
          held[i] = isHeld;
        },
      }),
    );
    moveTo(50, 3015);
    await wait();
    moveTo(50, 3135);
    await wait();
    expect(held[3]).toBe(true);
    expect(held.filter(Boolean)).toHaveLength(3);
    slots.forEach((slot) => slot.remove());
  });

  it('holds a keyboard-focused button wherever the pointer is, and lets it go once focus leaves', async () => {
    let isHeld = false;
    const slot = holdNearPointer(buttonAt(6000), {
      isBusy: () => false,
      onHold: (held) => {
        isHeld = held;
      },
    });
    // the pointer far from it
    moveTo(50, 10);
    await wait();
    expect(isHeld).toBe(false);
    slot.focus(true);
    // (held once it has kept focus a moment)
    await wait(100);
    expect(isHeld).toBe(true);
    slot.focus(false);
    await wait();
    expect(isHeld).toBe(false);
    slot.remove();
  });

  it('holds the keyboard-focused button even when three others are still fading', async () => {
    const held: boolean[] = [];
    // three just passed over (still fading), and the fourth, far from the pointer, focused from the keyboard
    const slots = [7000, 7040, 7080, 9000].map((top, i) =>
      holdNearPointer(buttonAt(top), {
        isBusy: () => i < 3,
        onHold: (isHeld) => {
          held[i] = isHeld;
        },
      }),
    );
    moveTo(50, 7015);
    await wait();
    slots[3].focus(true);
    await wait(100);
    expect(held[3]).toBe(true);
    expect(held.filter(Boolean)).toHaveLength(3);
    slots.forEach((slot) => slot.remove());
  });

  it('holds nothing for a focus passing through (Tab held down a table), only the one that stays focused', () => {
    // (on fake timers, frames and the clock: a slow machine can't stretch a 30 ms step past the 60 ms dwell)
    jest.useFakeTimers();
    try {
      const held: boolean[] = [];
      const made: number[] = [];
      const slots = [0, 40, 80, 120, 160, 200].map((top, i) =>
        holdNearPointer(buttonAt(10000 + top), {
          isBusy: () => false,
          onHold: (isHeld) => {
            held[i] = isHeld;
            if (isHeld) made.push(i);
          },
        }),
      );
      moveTo(50, 10);
      jest.advanceTimersByTime(50);
      // a row every 30 ms (key repeat), stopping on the last
      slots.forEach((slot, i) => {
        if (i) slots[i - 1].focus(false);
        slot.focus(true);
        jest.advanceTimersByTime(30);
      });
      expect(made).toEqual([]);
      jest.advanceTimersByTime(100);
      expect(made).toEqual([5]);
      expect(held[5]).toBe(true);
      slots.forEach((slot) => slot.remove());
    } finally {
      jest.useRealTimers();
    }
  });

  it("tells a button it's held in a task of its own, not in the frame's callback (its stage is made there)", async () => {
    const raf = window.requestAnimationFrame;
    let isInFrame = false;
    window.requestAnimationFrame = (callback) =>
      raf((t) => {
        isInFrame = true;
        try {
          callback(t);
        } finally {
          isInFrame = false;
        }
      });
    const told: boolean[] = [];
    const slot = holdNearPointer(buttonAt(12000), {
      isBusy: () => false,
      onHold: (isHeld) => {
        if (isHeld) told.push(isInFrame);
      },
    });
    moveTo(50, 12015);
    await wait();
    expect(told).toEqual([false]);
    window.requestAnimationFrame = raf;
    slot.remove();
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

describe('followKeyboardFocus', () => {
  /** a slot that only records what it's told */
  const fakeSlot = (): HoverSlot & { focus: jest.Mock } => ({
    update: jest.fn(),
    focus: jest.fn(),
    remove: jest.fn(),
  });
  /** a button whose focus is from the keyboard (`:focus-visible`) or not (a click's) */
  const buttonWith = (isKeyboard: () => boolean): HTMLButtonElement => {
    const button = document.createElement('button');
    const matches = button.matches.bind(button);
    button.matches = (selector: string) =>
      selector === ':focus-visible' ? isKeyboard() : matches(selector);
    document.body.append(button);
    return button;
  };

  it('plays on a keyboard focus and ends on blur, holding its slot meanwhile', () => {
    const button = buttonWith(() => true);
    const slot = fakeSlot();
    const onChange = jest.fn();
    const keyboard = followKeyboardFocus(button, slot, onChange);
    expect(onChange).not.toHaveBeenCalled();

    button.focus();
    expect(keyboard.isFocused()).toBe(true);
    expect(slot.focus).toHaveBeenLastCalledWith(true);
    expect(onChange).toHaveBeenLastCalledWith(true);

    button.blur();
    expect(keyboard.isFocused()).toBe(false);
    expect(slot.focus).toHaveBeenLastCalledWith(false);
    expect(onChange).toHaveBeenLastCalledWith(false);
    expect(onChange).toHaveBeenCalledTimes(2);
    keyboard.stop();
    button.remove();
  });

  it("doesn't play on a click's focus (not :focus-visible), nor end anything on its blur", () => {
    const button = buttonWith(() => false);
    const slot = fakeSlot();
    const onChange = jest.fn();
    const keyboard = followKeyboardFocus(button, slot, onChange);
    button.focus();
    button.blur();
    expect(keyboard.isFocused()).toBe(false);
    expect(slot.focus).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
    keyboard.stop();
    button.remove();
  });

  it('plays at once for a button already focused from the keyboard before its hover was in', () => {
    const button = buttonWith(() => true);
    button.focus();
    const slot = fakeSlot();
    const onChange = jest.fn();
    const keyboard = followKeyboardFocus(button, slot, onChange);
    expect(keyboard.isFocused()).toBe(true);
    expect(onChange).toHaveBeenCalledWith(true);
    keyboard.stop();
    button.blur();
    button.remove();
  });

  it('follows nothing once stopped', () => {
    const button = buttonWith(() => true);
    const slot = fakeSlot();
    const onChange = jest.fn();
    followKeyboardFocus(button, slot, onChange).stop();
    button.focus();
    button.blur();
    expect(slot.focus).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
    button.remove();
  });

  it('treats a browser without :focus-visible as no keyboard focus', () => {
    const button = buttonWith(() => {
      throw new SyntaxError("':focus-visible' is not a valid selector");
    });
    const onChange = jest.fn();
    const keyboard = followKeyboardFocus(button, fakeSlot(), onChange);
    button.focus();
    expect(onChange).not.toHaveBeenCalled();
    keyboard.stop();
    button.blur();
    button.remove();
  });
});
