import cloneDeep from './cloneDeep';

describe('lodashButBetter/cloneDeep', () => {
  it('should clone primitives', () => {
    expect(cloneDeep(1)).toBe(1);
    expect(cloneDeep('a')).toBe('a');
    expect(cloneDeep(true)).toBe(true);
    expect(cloneDeep(null)).toBe(null);
    expect(cloneDeep(undefined)).toBe(undefined);
  });

  it('should not shallow clone', () => {
    const a = { b: 1 };
    const b = cloneDeep(a);
    expect(b).toStrictEqual(a);
    expect(b).not.toBe(a);

    // arrays
    const a1 = [{ b: 1 }];
    const b2 = cloneDeep(a1);
    expect(b2).toStrictEqual(a1);
    expect(b2).not.toBe(a1);
  });

  it('should clone arrays', () => {
    expect(cloneDeep([1, 2, 3])).toStrictEqual([1, 2, 3]);
  });

  it('should clone objects', () => {
    expect(cloneDeep({ a: 1, b: 2 })).toStrictEqual({ a: 1, b: 2 });
  });

  it('should clone deeply nested objects', () => {
    expect(cloneDeep({ a: { b: { c: { d: { e: 2 } } } } })).toStrictEqual({
      a: { b: { c: { d: { e: 2 } } } },
    });
  });

  it('should clone arrays of objects', () => {
    expect(cloneDeep([{ a: 1 }, { b: 2 }])).toStrictEqual([{ a: 1 }, { b: 2 }]);
  });

  it('should clone objects of arrays', () => {
    expect(cloneDeep({ a: [1, 2], b: [3, 4] })).toStrictEqual({ a: [1, 2], b: [3, 4] });
  });

  it('should clone arrays of arrays', () => {
    expect(
      cloneDeep([
        [1, 2],
        [3, 4],
      ]),
    ).toStrictEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it('should clone objects of objects', () => {
    expect(cloneDeep({ a: { b: 1 }, c: { d: 2 } })).toStrictEqual({
      a: { b: 1 },
      c: { d: 2 },
    });
  });

  it('should clone objects of arrays of objects', () => {
    expect(cloneDeep({ a: [{ b: 1 }], c: [{ d: 2 }] })).toStrictEqual({
      a: [{ b: 1 }],
      c: [{ d: 2 }],
    });
  });

  it('should clone arrays of objects of arrays', () => {
    expect(cloneDeep([{ a: [1] }, { b: [2] }])).toStrictEqual([{ a: [1] }, { b: [2] }]);
  });
});
