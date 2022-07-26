import { isEqual } from './isEqual';

describe('isEqual', () => {
  it('should return "true" when object keys and value are equal', () => {
    const objectToCompare = { key1: 'value1', key2: 'value2' };
    const objectToMatch = { key1: 'value1', key2: 'value2' };
    const isEqualResult = isEqual(objectToCompare, objectToMatch);

    expect(isEqualResult).toEqual(true);
  });

  it('should return "false" when object keys are not equal', () => {
    const objectToCompare = { key1: 'value1', key2: 'value2' };
    const objectToMatch = { key2: 'value2', key3: 'value3' };
    const isEqualResult = isEqual(objectToCompare, objectToMatch);

    expect(isEqualResult).toEqual(false);
  });

  it('should return "false" when object values are not equal', () => {
    const objectToCompare = { key1: 'value1', key2: 'value2' };
    const objectToMatch = { key1: 'value2', key2: 'value2' };
    const isEqualResult = isEqual(objectToCompare, objectToMatch);

    expect(isEqualResult).toEqual(false);
  });
});
