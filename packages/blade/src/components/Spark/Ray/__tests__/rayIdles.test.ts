import { idleAllowed, idleAt, idleByClock, idleChances } from '../rayIdles';

const HOURS = Array.from({ length: 24 }, (_, h) => h);
const isNight = (h: number): boolean => h >= 21 || h < 6;

describe('idle="timeOfDay"', () => {
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
