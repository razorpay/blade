import type * as StagePool from '../stagePool';

// a stage that records what's done to it (its engine works unless told otherwise)
const mockMade: {
  box: HTMLElement;
  destroyed: boolean;
  onError?: unknown;
  paused?: boolean;
}[] = [];
jest.mock('../../RazorSenseEngine', () => ({
  FreshStage: class {
    private rec: typeof mockMade[number];
    constructor(box: HTMLElement, _: unknown, { onError }: { onError?: unknown }) {
      this.rec = { box, destroyed: false, onError };
      mockMade.push(this.rec);
    }
    hasEngine(): boolean {
      return !this.rec.destroyed;
    }
    setPaused(paused: boolean): void {
      this.rec.paused = paused;
    }
    setOnError(onError?: unknown): void {
      this.rec.onError = onError;
    }
    destroy(): void {
      this.rec.destroyed = true;
    }
  },
}));

type Pool = typeof StagePool;
/** a fresh pool (it's page-wide: one per module) */
const loadPool = (): Pool => {
  let pool: Pool | undefined;
  jest.isolateModules(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    pool = require('../stagePool') as Pool;
  });
  if (!pool) throw new Error('stagePool did not load');
  return pool;
};
const spot = (): HTMLElement => {
  const host = document.createElement('span');
  document.body.append(host);
  return host;
};
const create = (jest.fn() as unknown) as Parameters<Pool['takeStage']>[2];

beforeEach(() => {
  mockMade.length = 0;
  jest.useFakeTimers();
});
afterEach(() => jest.useRealTimers());

describe('stagePool', () => {
  it('hands a stage let go to the next button of the same comp, moved into its spot, its handler swapped', () => {
    const { takeStage, letGoOfStage, stagePoolSize } = loadPool();
    const onA = jest.fn();
    const onB = jest.fn();
    const a = takeStage(spot(), 'razorsense:light:wide', create, onA);
    letGoOfStage(a);
    expect(stagePoolSize()).toEqual({ parked: 1, inUse: 0 });
    expect(a.box.isConnected).toBe(false);
    expect(mockMade[0].paused).toBe(true);

    const hostB = spot();
    const b = takeStage(hostB, 'razorsense:light:wide', create, onB);
    expect(b.stage).toBe(a.stage);
    expect(mockMade).toHaveLength(1);
    expect(b.box.parentElement).toBe(hostB);
    expect(mockMade[0].onError).toBe(onB);
    expect(stagePoolSize()).toEqual({ parked: 0, inUse: 1 });
  });

  it('makes a new stage for another comp, and never holds more than 3 in all (one parked for another comp goes first)', () => {
    const { takeStage, letGoOfStage, stagePoolSize } = loadPool();
    const held = [1, 2].map(() => takeStage(spot(), 'ray:light:investigate', create, jest.fn()));
    const other = takeStage(spot(), 'razorsense:light:wide', create, jest.fn());
    letGoOfStage(other);
    expect(stagePoolSize()).toEqual({ parked: 1, inUse: 2 });
    // a third Ray: the parked RazorSense stage is freed to make room
    takeStage(spot(), 'ray:light:investigate', create, jest.fn());
    expect(mockMade).toHaveLength(4);
    expect(mockMade[2].destroyed).toBe(true);
    expect(stagePoolSize()).toEqual({ parked: 0, inUse: 3 });
    held.forEach((h) => letGoOfStage(h));
  });

  it('frees a parked stage once it has lingered', () => {
    const { takeStage, letGoOfStage, stagePoolSize, LINGER_MS } = loadPool();
    letGoOfStage(takeStage(spot(), 'razorsense:dark:square', create, jest.fn()));
    jest.advanceTimersByTime(LINGER_MS - 100);
    expect(mockMade[0].destroyed).toBe(false);
    jest.advanceTimersByTime(200);
    expect(mockMade[0].destroyed).toBe(true);
    expect(stagePoolSize()).toEqual({ parked: 0, inUse: 0 });
  });

  it('frees at once a stage that lost its GPU context or whose engine failed', () => {
    const { takeStage, letGoOfStage, stagePoolSize } = loadPool();
    letGoOfStage(takeStage(spot(), 'razorsense:light:wide', create, jest.fn()), false);
    expect(mockMade[0].destroyed).toBe(true);
    const failed = takeStage(spot(), 'razorsense:light:wide', create, jest.fn());
    // (no engine: it couldn't make one here)
    failed.stage.destroy();
    letGoOfStage(failed);
    expect(stagePoolSize()).toEqual({ parked: 0, inUse: 0 });
    expect(mockMade).toHaveLength(2);
  });
});
