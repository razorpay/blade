import { idleAllowed, idleAt, idleByClock, idleChances } from '../rayIdles';
import type * as RayIdles from '../rayIdles';

const HOURS = Array.from({ length: 24 }, (_, h) => h);
const isNight = (h: number): boolean => h >= 21 || h < 6;

describe('idle="time-of-day"', () => {
  it('should only give the nightcap at night (9pm-6am), as the likeliest idle then', () => {
    HOURS.forEach((h) => {
      const c = idleChances(h);
      expect(c.sleep).toBe(isNight(h) ? 0.5 : 0);
    });
  });

  it('should never give Coffee at night, and make it the likeliest 7am-10am', () => {
    HOURS.forEach((h) => {
      const c = idleChances(h);
      if (isNight(h)) expect(c.coffee).toBe(0);
      else expect(c.coffee).toBe(h >= 7 && h < 10 ? 0.5 : 0.25);
    });
  });

  it('should not give the last load its idle again, unless it is the hour’s favourite', () => {
    expect(idleChances(14, 'look').look).toBe(0);
    expect(idleChances(8, 'coffee').coffee).toBe(0.5);
    expect(idleChances(23, 'sleep').sleep).toBe(0.5);
  });

  it('should draw from the chances', () => {
    expect(idleAt(8, () => 0)).toBe('coffee');
    expect(idleAt(23, () => 0.999)).toBe('sleep');
    expect(idleAt(14, () => 0.999)).toBe('reading');
  });

  describe('the clock, read each time a Ray picks', () => {
    afterEach(() => jest.useRealTimers());
    const at = (hour: number): void => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2026, 10, 4, hour, 30));
    };

    it('should never pick Coffee at 11pm or the nightcap at 8am', () => {
      at(23);
      for (let i = 0; i < 40; i++) expect(idleByClock()).not.toBe('coffee');
      at(8);
      for (let i = 0; i < 40; i++) expect(idleByClock()).not.toBe('sleep');
    });

    it('should give way when the hour rules his idle out, and only then', () => {
      expect(idleAllowed('coffee', 20)).toBe(true);
      expect(idleAllowed('coffee', 21)).toBe(false);
      expect(idleAllowed('sleep', 5)).toBe(true);
      expect(idleAllowed('sleep', 6)).toBe(false);
      at(21);
      for (let i = 0; i < 20; i++) expect(idleByClock('coffee')).not.toBe('coffee');
    });
  });
});

describe('idle="rotate"', () => {
  // each page load is a fresh copy of the module (its once-a-load pick), with the same localStorage
  const load = (): typeof RayIdles => {
    let mod: typeof RayIdles | undefined;
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
      mod = require('../rayIdles');
    });
    return mod!;
  };

  // the page's storage, in memory: the same on every Node and jsdom (CI's Node 22 had no window.localStorage)
  const saved = new Map<string, string>();
  const storage = {
    getItem: (key: string): string | null => saved.get(key) ?? null,
    setItem: (key: string, value: string): void => {
      saved.set(key, String(value));
    },
    removeItem: (key: string): void => {
      saved.delete(key);
    },
    clear: (): void => saved.clear(),
  };
  beforeEach(() => {
    saved.clear();
    Object.defineProperty(window, 'localStorage', { value: storage, configurable: true });
  });
  afterEach(() => {
    jest.restoreAllMocks();
    Reflect.deleteProperty(window, 'localStorage');
  });

  it('should take the next idle of the cycle on each page load, and come round again', () => {
    const picks = Array.from({ length: 6 }, () => load().idleOfThisLoad('rotate'));
    expect(picks).toEqual(['coffee', 'look', 'cash', 'reading', 'sleep', 'coffee']);
  });

  it('should give every Ray on a page load the same idle, stepping the cycle once', () => {
    const page = load();
    const first = page.idleOfThisLoad('rotate');
    expect(page.idleOfThisLoad('rotate')).toBe(first);
    expect(page.idleOfThisLoad('rotate')).toBe(first);
    expect(saved.get('blade-ray-idle')).toBe('1');
  });

  it('should start anywhere in the cycle when storage is refused', () => {
    jest.spyOn(storage, 'getItem').mockImplementation(() => {
      throw new Error('denied');
    });
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    expect(load().idleOfThisLoad('rotate')).toBe('cash');
  });

  it('should leave a named idle as it is, without touching storage', () => {
    const page = load();
    expect(page.idleOfThisLoad('coffee')).toBe('coffee');
    expect(page.idleOfThisLoad('rest')).toBe('rest');
    expect(saved.has('blade-ray-idle')).toBe(false);
  });
});
