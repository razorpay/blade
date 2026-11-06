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
});
