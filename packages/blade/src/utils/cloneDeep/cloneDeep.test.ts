import { cloneDeep } from './cloneDeep';

describe('cloneDeep', () => {
  it('should return "false" when comparing the cloned object with the original object', () => {
    const actualObject = { key1: 'value1', key2: 'value2' };
    let clonedObject = actualObject;
    expect(actualObject === clonedObject).toEqual(true);

    clonedObject = cloneDeep(actualObject);
    expect(actualObject === clonedObject).toEqual(false);
  });
});
