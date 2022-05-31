import spacing from '../../tokens/global/spacing';
import makeSpace from '.';

describe('makeSpace', () => {
  it('should return the spacing value in `px`', () => {
    const space = makeSpace(spacing[2]);
    expect(space).toEqual('8px');
  });
});
