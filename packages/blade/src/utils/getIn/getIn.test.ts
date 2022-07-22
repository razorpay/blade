import { getIn } from './getIn';

const testObject = {
  a: [
    {
      b: {
        c: 3,
      },
    },
  ],
};

describe('getIn', () => {
  it(`should return resolved value for nested key string lookup`, () => {
    expect(getIn(testObject, 'a[0].b.c')).toEqual(3);
  });

  it(`should return resolved value for nested key array lookup`, () => {
    expect(getIn(testObject, ['a', '0', 'b', 'c'])).toEqual(3);
  });

  it(`should return default value for invalid key lookup`, () => {
    expect(getIn(testObject, 'a.b.d', 'default')).toEqual('default');
  });

  it(`should return undefined for invalid key lookup`, () => {
    expect(getIn(testObject, 'a.b.d')).toEqual(undefined);
  });
});
