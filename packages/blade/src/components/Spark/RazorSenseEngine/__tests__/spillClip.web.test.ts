/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-var-requires */
// Where a component's spill grows the page (Firefox), it's placed again as what the page holds resizes, not on every change
// inside it: text streaming into a chat changes the page every frame.

type Frame = (time: number) => void;

const setup = (): {
  watchSpill: (box: HTMLElement, place: () => void) => () => void;
  flushFrames: () => void;
  resizeAll: () => void;
} => {
  let frames: Frame[] = [];
  (window as any).requestAnimationFrame = (cb: Frame): number => {
    frames.push(cb);
    return frames.length;
  };
  (window as any).cancelAnimationFrame = (): void => undefined;
  // a browser whose spill scrolls (the probe's scroller reads larger than its 40px box)
  jest.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(200);
  const observers: { cb: () => void; targets: Set<Element> }[] = [];
  (window as any).ResizeObserver = class {
    private readonly targets = new Set<Element>();
    constructor(cb: () => void) {
      observers.push({ cb, targets: this.targets });
    }
    observe(target: Element): void {
      this.targets.add(target);
    }
    disconnect(): void {
      this.targets.clear();
    }
  };
  let watchSpill: any;
  jest.isolateModules(() => {
    ({ watchSpill } = require('../spillClip'));
  });
  return {
    watchSpill,
    flushFrames: () => {
      const run = frames;
      frames = [];
      run.forEach((cb) => cb(0));
    },
    resizeAll: () => observers.forEach(({ cb, targets }) => targets.size && cb()),
  };
};

const settle = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

describe('watchSpill', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it("places again as the page's content resizes or changes children, not on text changing inside it", async () => {
    const { watchSpill, flushFrames, resizeAll } = setup();
    const chat = document.createElement('div');
    const answer = document.createElement('p');
    answer.textContent = 'Searching';
    const box = document.createElement('div');
    chat.append(answer, box);
    document.body.append(chat);
    const place = jest.fn();
    const stop = watchSpill(box, place);
    flushFrames();
    expect(place).toHaveBeenCalledTimes(1);

    // text streaming in: nothing to do
    answer.textContent += ' your settlements';
    answer.append(document.createElement('span'));
    await settle();
    flushFrames();
    expect(place).toHaveBeenCalledTimes(1);

    // the content resizing: placed again
    resizeAll();
    flushFrames();
    expect(place).toHaveBeenCalledTimes(2);

    // a child added to the page: placed again
    document.body.append(document.createElement('div'));
    await settle();
    flushFrames();
    expect(place).toHaveBeenCalledTimes(3);
    stop();
  });
});

// (a module of its own: its helpers are its own, not shared with the other test files)
export {};
