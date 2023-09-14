import { hasSameObjectStructure } from '../hasSameObjectStructure';

describe('hasSameObjectStructure', () => {
  it('should return true for objects with the same structure', () => {
    const obj1 = {
      a: {
        b: {
          c: 1,
        },
        d: 'hello',
      },
      e: 42,
    };

    const obj2 = {
      a: {
        b: {
          c: 42,
        },
        d: 'world',
      },
      e: 42,
    };

    expect(hasSameObjectStructure(obj1, obj2)).toBe(true);
  });

  it('should return false for objects with different structures', () => {
    const obj1 = {
      a: {
        b: {
          c: 1,
        },
        d: 'hello',
      },
    };

    const obj2 = {
      a: {
        b: {
          x: 42,
        },
        d: 'world',
      },
    };

    expect(hasSameObjectStructure(obj1, obj2)).toBe(false);
  });
});
