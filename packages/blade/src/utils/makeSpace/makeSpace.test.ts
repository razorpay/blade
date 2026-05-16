import { spacing } from '~tokens/global';

import { makeSpace } from '.';

describe('makeSpace', () => {
  it('should return the spacing value in `px`', () => {
    const space = makeSpace(spacing[3]);
    expect(space).toEqual('8px');
  });
});
