import { makeSpace } from '.';
import { spacing } from '~tokens/global';

describe('makeSpace', () => {
  it('should return the spacing value in `px`', () => {
    const space = makeSpace(spacing[3]);
    expect(space).toEqual('8px');
  });
});
