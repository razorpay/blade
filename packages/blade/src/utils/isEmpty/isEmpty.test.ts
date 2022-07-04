import { isEmpty } from './isEmpty';

describe('isEmpty', () => {
  it(`should return true for 'null'`, () => {
    expect(isEmpty(null)).toEqual(true);
  });

  it(`should return true for boolean`, () => {
    expect(isEmpty(true)).toEqual(true);
  });

  it(`should return true for empty object`, () => {
    expect(isEmpty({})).toEqual(true);
  });

  it(`should return true for empty array`, () => {
    expect(isEmpty([])).toEqual(true);
  });

  it(`should return false for object with keys`, () => {
    expect(
      isEmpty({
        key1: 'value1',
        key2: 'value2',
        key3: {},
      }),
    ).toEqual(false);
  });

  it(`should return false for array with values`, () => {
    expect(isEmpty(['item1', 'item2', 'item3'])).toEqual(false);
  });
});
