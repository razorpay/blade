import { attributes, jsxAttribute } from '../attributes';

describe('jsxAttribute', () => {
  test('should generate jsx attribute of type string correctly', () => {
    expect(jsxAttribute('key', { type: 'string', value: 'value' })).toEqual('key="value"');
  });

  test('should generate jsx attribute of type boolean correctly', () => {
    expect(jsxAttribute('key', { type: 'boolean', value: 'true' })).toEqual('key={true}');
  });

  test('should generate jsx attribute of type number correctly', () => {
    expect(jsxAttribute('key', { type: 'number', value: '1' })).toEqual('key={1}');
  });

  test('should generate jsx attribute of type instance correctly', () => {
    expect(jsxAttribute('key', { type: 'instance', value: 'value' })).toEqual('key={value}');
  });
});

describe('attributes', () => {
  test('should generate jsx attributes correctly', () => {
    expect(
      attributes({
        key: { type: 'string', value: 'value' },
        key2: { type: 'boolean', value: 'true' },
        key3: { type: 'number', value: '1' },
        key4: { type: 'instance', value: 'value' },
        '': { type: 'instance', value: 'value' },
        key5: { type: 'instance', value: '' },
      }),
    ).toMatchSnapshot();
  });
});
