import { ChatDriver, getChatSetup } from '../chatDriver';
import { chatLight } from '../comps';
import type { FreshPlayer } from '../../RazorSenseEngine';

// the engine's player, doing nothing: the driver's own state is what's checked
const player = (new Proxy({}, { get: () => (): void => undefined }) as unknown) as FreshPlayer;

/** steps the driver on for `seconds`, 50 ms at a time, from `fromMs`; returns the clock after */
const run = (driver: ChatDriver, seconds: number, fromMs: number): number => {
  let now = fromMs;
  for (let i = 0; i < seconds * 20; i++) {
    driver.step(player, 0.05, now, false);
    now += 50;
  }
  return now;
};

const makeDriver = (): ChatDriver => {
  const setup = getChatSetup(chatLight);
  if (!setup) throw new Error('the chat comp has no setup');
  return new ChatDriver(setup, false);
};

describe('ChatDriver', () => {
  it('settles to idle once the answer is in', () => {
    const driver = makeDriver();
    driver.think();
    let now = run(driver, 0.5, 0);
    driver.answer(now);
    now = run(driver, 15, now);
    expect(driver.state).toBe('idle');
  });

  it('keeps thinking when asked again before the answer surges (thinking, idle, thinking)', () => {
    const driver = makeDriver();
    driver.think();
    let now = run(driver, 0.2, 0);
    driver.answer(now);
    now = run(driver, 0.2, now);
    driver.think();
    now = run(driver, 15, now);
    expect(driver.state).toBe('think');
  });

  it('thinks again after it has settled', () => {
    const driver = makeDriver();
    driver.think();
    let now = run(driver, 0.5, 0);
    driver.answer(now);
    now = run(driver, 15, now);
    driver.think();
    // (it rises back up first: about 3 s)
    run(driver, 5, now);
    expect(driver.state).toBe('think');
  });

  it('a new question once the answer is in rises back up (the surge, backwards), then thinks', () => {
    const driver = makeDriver();
    driver.think();
    let now = run(driver, 0.5, 0);
    driver.answer(now);
    now = run(driver, 15, now);
    expect(driver.state).toBe('idle');
    driver.think();
    expect(driver.state).toBe('rise');
    now = run(driver, 1, now);
    expect(driver.state).toBe('rise');
    run(driver, 4, now);
    expect(driver.state).toBe('think');
  });

  it('turns round mid-way: an answer while rising goes back down, a question while surging goes back up', () => {
    const driver = makeDriver();
    driver.think();
    let now = run(driver, 0.5, 0);
    driver.answer(now);
    now = run(driver, 15, now);
    driver.think();
    now = run(driver, 1, now);
    driver.answer(now);
    expect(driver.state).toBe('surge');
    now = run(driver, 6, now);
    expect(driver.state).toBe('idle');
    driver.think();
    now = run(driver, 1, now);
    driver.answer(now);
    now = run(driver, 0.5, now);
    driver.think();
    expect(driver.state).toBe('rise');
    run(driver, 5, now);
    expect(driver.state).toBe('think');
  });

  it('plays an outcome on the strip at rest, and is back at rest as it ends', () => {
    const driver = makeDriver();
    driver.think();
    let now = run(driver, 0.5, 0);
    driver.answer(now);
    now = run(driver, 15, now);
    expect(driver.isAtRest()).toBe(true);
    driver.playOutcome(15.02, 3.71);
    expect(driver.isPlayingOutcome).toBe(true);
    expect(driver.isAtRest()).toBe(false);
    now = run(driver, 2, now);
    expect(driver.isPlayingOutcome).toBe(true);
    run(driver, 2, now);
    expect(driver.isPlayingOutcome).toBe(false);
    expect(driver.isAtRest()).toBe(true);
    expect(driver.state).toBe('idle');
  });

  it('an outcome ended early (cleared, or another set) plays out quickly, never backwards', () => {
    // (the strip page's clock: page A's through seek, page B's through its comps; past the strip's end only while an outcome plays)
    const clock: number[] = [];
    const recorder = (new Proxy(
      {},
      {
        get: (_, key) => (...args: unknown[]): void => {
          if (key === 'seek') clock.push(args[0] as number);
          if (key === 'comp' && args[0] === 'b_c3') clock.push((args[1] as { t: number }).t);
        },
      },
    ) as unknown) as FreshPlayer;
    const step = (driver: ChatDriver, seconds: number, fromMs: number): number => {
      let now = fromMs;
      for (let i = 0; i < seconds * 20; i++) {
        driver.step(recorder, 0.05, now);
        now += 50;
      }
      return now;
    };
    const driver = makeDriver();
    driver.think();
    let now = step(driver, 0.5, 0);
    driver.answer(now);
    now = step(driver, 15, now);
    clock.length = 0;
    driver.playOutcome(15.02, 3.71);
    // (near its end, as the user had it: success nearly over, then Finish with error)
    now = step(driver, 3, now);
    driver.hurryOutcome();
    now = step(driver, 0.15, now);
    expect(driver.isPlayingOutcome).toBe(true);
    step(driver, 0.15, now);
    expect(driver.isPlayingOutcome).toBe(false);
    expect(driver.isAtRest()).toBe(true);
    const piece = clock.filter((t) => t > 15.01);
    expect(piece.length).toBeGreaterThan(10);
    for (let i = 1; i < piece.length; i++) expect(piece[i]).toBeGreaterThanOrEqual(piece[i - 1]);
  });

  it('an outcome takes the wave down to where success-blob shows it, and back to its rest as it ends', () => {
    // (the strip page's group: how far down it's drawn, each frame)
    let dy = 0;
    const recorder = (new Proxy(
      {},
      {
        get: (_, key) => (...args: unknown[]): void => {
          if (key === 'group' && args[0] === 'main') dy = (args[1] as { dy: number }).dy;
        },
      },
    ) as unknown) as FreshPlayer;
    const step = (driver: ChatDriver, seconds: number, fromMs: number): number => {
      let now = fromMs;
      for (let i = 0; i < seconds * 20; i++) {
        driver.step(recorder, 0.05, now);
        now += 50;
      }
      return now;
    };
    const driver = makeDriver();
    driver.think();
    let now = step(driver, 0.5, 0);
    driver.answer(now);
    now = step(driver, 15, now);
    const rest = dy;
    driver.playOutcome(15.02, 3.71, 90);
    now = step(driver, 0.05, now);
    expect(dy - rest).toBeLessThan(5);
    now = step(driver, 1.5, now);
    expect(dy - rest).toBeCloseTo(90, 5);
    now = step(driver, 3, now);
    expect(driver.isPlayingOutcome).toBe(false);
    step(driver, 0.05, now);
    expect(dy).toBeCloseTo(rest, 5);
  });

  it('a new question mid-outcome plays it out quickly, then rises', () => {
    const driver = makeDriver();
    driver.think();
    let now = run(driver, 0.5, 0);
    driver.answer(now);
    now = run(driver, 15, now);
    driver.playOutcome(15.02, 3.71);
    now = run(driver, 1, now);
    driver.think();
    // (it plays out first, at x 4: under a second)
    expect(driver.state).toBe('idle');
    now = run(driver, 0.8, now);
    expect(driver.isPlayingOutcome).toBe(false);
    expect(driver.state).toBe('rise');
    run(driver, 5, now);
    expect(driver.state).toBe('think');
  });

  it('drops the strip offline on its curve, rests there, and comes back up from where it is', () => {
    const driver = makeDriver();
    driver.think();
    let now = run(driver, 0.5, 0);
    driver.answer(now);
    now = run(driver, 15, now);
    driver.setDrop(400, now);
    now = run(driver, 0.6, now);
    expect(driver.isAway(now)).toBe(false);
    now = run(driver, 0.7, now);
    expect(driver.isAway(now)).toBe(true);
    // back up, turned round mid-way: it starts from where it is, and is up after its 1.2 s
    driver.setDrop(0, now);
    now = run(driver, 0.3, now);
    driver.setDrop(400, now);
    now = run(driver, 0.3, now);
    expect(driver.isAway(now)).toBe(false);
    driver.setDrop(0, now);
    run(driver, 1.3, now);
    expect(driver.isAway(now + 1300)).toBe(false);
  });
});
