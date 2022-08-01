import { merge } from './merge';

describe('merge', () => {
  it('should merge two objects', () => {
    const mergedObjects = merge(
      { key1: 'value1', key2: 'value2' },
      { key3: 'value3', key4: 'value4' },
    );
    expect(mergedObjects).toEqual({
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
      key4: 'value4',
    });
  });

  it('should merge with overwriting keys', () => {
    const mergedObjects = merge(
      { key1: 'value1', key2: 'value2' },
      { key1: 'value3', key4: 'value4' },
    );
    expect(mergedObjects).toEqual({ key1: 'value3', key2: 'value2', key4: 'value4' });
  });
});
