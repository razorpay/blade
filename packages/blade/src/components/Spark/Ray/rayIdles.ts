/**
 * rayIdles
 *
 * Which idle he plays when he's left to choose: `rotate` (flow 9's cycle, one step per page load) or `time-of-day` (each Ray by
 * the viewer's clock as it comes, the user 2026-11-04: "the coffee one is more likely to be the idle state in the time of 7am - 10am, and the
 * nightcap one is more likely at 9pm - 12am; the coffee doesn't come at night"; then: "no nightcap outside 9pm to 6am, and keep the
 * nightcap likely time that only, 9pm to 6am"; "the calling instance should check the time each time it's called").
 */
import type { RayIdle } from './types';

type Idle = Exclude<RayIdle, 'rotate' | 'time-of-day'>;
type Cycle = Exclude<Idle, 'rest'>; // the idles a load can be given
type Chooser = Extract<RayIdle, 'rotate' | 'time-of-day'>;

const IDLE_CYCLE: Cycle[] = ['coffee', 'look', 'cash', 'reading', 'sleep']; // flow 9's cycle ('rest' isn't in it)
const ROTATE_KEY = 'blade-ray-idle'; // the cycle's step
const TIME_KEY = 'blade-ray-idle-time'; // the last pick by the clock (the last Ray's, on this page or a page before)
const FAVOURITE = 3; // the hour's favourite against 1 for the others: half of 7–10am's loads are Coffee, half of the night's the nightcap

/** How likely each idle is at `hour` (0–23, local time), as weights (0: never then). */
const idleWeights = (hour: number): Record<Cycle, number> => {
  const night = hour >= 21 || hour < 6; // 9pm–6am: the nightcap's, and never Coffee's
  return {
    coffee: night ? 0 : hour >= 7 && hour < 10 ? FAVOURITE : 1,
    look: 1,
    cash: 1,
    reading: 1,
    sleep: night ? FAVOURITE : 0, // (the nightcap)
  };
};

/** Each idle's chance (0..1) at `hour`, after `last`: the one before doesn't come again, unless it's the hour's favourite. */
const idleChances = (hour: number, last?: Cycle | null): Record<Cycle, number> => {
  const w = idleWeights(hour);
  if (last && w[last] < FAVOURITE && IDLE_CYCLE.some((idle) => idle !== last && w[idle] > 0))
    w[last] = 0;
  const total = IDLE_CYCLE.reduce((sum, idle) => sum + w[idle], 0);
  return Object.fromEntries(IDLE_CYCLE.map((idle) => [idle, w[idle] / total])) as Record<
    Cycle,
    number
  >;
};

/** An idle for a load at `hour`, drawn from its chances (`random`: 0..1). */
const idleAt = (hour: number, random: () => number, last?: Cycle | null): Cycle => {
  const chances = idleChances(hour, last);
  let r = random();
  for (const idle of IDLE_CYCLE) {
    r -= chances[idle];
    if (r < 0 && chances[idle] > 0) return idle;
  }
  return IDLE_CYCLE.filter((idle) => chances[idle] > 0).pop() ?? 'look';
};

const storage = (): Storage | null => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const rotateStep = (): Cycle => {
  const store = storage();
  let n = Math.floor(Math.random() * IDLE_CYCLE.length); // (without storage: anywhere in the cycle)
  try {
    if (store) {
      n = Number(store.getItem(ROTATE_KEY)) || 0;
      store.setItem(ROTATE_KEY, String(n + 1));
    }
  } catch {
    // storage refused: the random step stands
  }
  return IDLE_CYCLE[n % IDLE_CYCLE.length];
};

/** Whether the hour lets him play `idle` (Coffee isn't for the night, the nightcap is only for it). */
const idleAllowed = (idle: Cycle, hour: number): boolean => idleWeights(hour)[idle] > 0;

/**
 * An idle by the clock, now: for a Ray as it appears (`instead` unset: not the last one's, unless it's the hour's favourite), or
 * in place of one the hour has since ruled out (`instead`).
 */
const idleByClock = (instead?: Cycle): Cycle => {
  const store = storage();
  let last: Cycle | null = instead ?? null;
  try {
    const saved = store?.getItem(TIME_KEY);
    if (!last && saved && (IDLE_CYCLE as string[]).includes(saved)) last = saved as Cycle;
  } catch {
    // no memory of the last one: any idle may come
  }
  const idle = idleAt(new Date().getHours(), Math.random, last);
  try {
    store?.setItem(TIME_KEY, idle);
  } catch {
    // not remembered for the next load
  }
  return idle;
};

let rotated: Cycle | null = null; // the cycle's step for this page load, for every Ray on it

/** The idle a Ray plays: as asked, or this page load's step of the cycle (`rotate`). (`time-of-day` is each Ray's own: idleByClock.) */
const idleOfThisLoad = (idle: Exclude<RayIdle, 'time-of-day'>): Exclude<RayIdle, Chooser> => {
  if (idle !== 'rotate') return idle;
  rotated = rotated ?? rotateStep();
  return rotated;
};

export { idleOfThisLoad, idleByClock, idleAllowed, idleAt, idleChances, IDLE_CYCLE };
export type { Idle, Cycle };
