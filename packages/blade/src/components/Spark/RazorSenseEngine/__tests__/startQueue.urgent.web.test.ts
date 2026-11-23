/* eslint-disable @typescript-eslint/no-var-requires */
import type { waitForTurn as WaitForTurn } from '../startQueue';

// An urgent turn (RazorSenseSuccess: a one-shot moment) starts as soon as it's on screen, past every RazorSense in line: in line
// behind six others on an Intel UHD laptop it started ~2.3 s late, past its wait for a first frame, and only its badge played.

type Queue = { waitForTurn: typeof WaitForTurn };
const load = (): Queue => {
  let mod: Queue | undefined;
  jest.isolateModules(() => {
    mod = require('../startQueue');
  });
  return mod!;
};

describe('startQueue: an urgent turn', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('starts at once with six in line ahead of it, the one starting not yet drawn', () => {
    const { waitForTurn } = load();
    const started: string[] = [];
    // six in line, none of them drawing (each holds the line till it does, or its wait runs out)
    for (let i = 0; i < 6; i++) {
      waitForTurn(document.createElement('div'), () => {
        started.push(`piece ${i}`);
        return () => false;
      });
    }
    waitForTurn(
      document.createElement('div'),
      () => {
        started.push('success');
        return () => false;
      },
      undefined,
      true,
    );
    // (no idle callback in jsdom: a step a moment)
    jest.advanceTimersByTime(100);
    expect(started).toEqual(['piece 0', 'success']);
    // the line itself is as it was: one at a time
    jest.advanceTimersByTime(2000);
    expect(started).toEqual(['piece 0', 'success']);
  });

  it('makes its engine a step at a time all the same, and starts nothing once its component has gone', () => {
    const { waitForTurn } = load();
    const go = jest.fn(() => () => true);
    let steps = 0;
    const leave = waitForTurn(
      document.createElement('div'),
      go,
      () => {
        steps += 1;
        return steps >= 3;
      },
      true,
    );
    jest.advanceTimersByTime(16);
    expect(steps).toBeGreaterThanOrEqual(1);
    leave();
    jest.advanceTimersByTime(500);
    expect(go).not.toHaveBeenCalled();
  });
});
