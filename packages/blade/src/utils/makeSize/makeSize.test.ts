import { makeSize } from '.';

describe('makeSize', () => {
  it('should return the size value in `px`', () => {
    const size = makeSize(8);
    expect(size).toEqual('8px');
  });
});
