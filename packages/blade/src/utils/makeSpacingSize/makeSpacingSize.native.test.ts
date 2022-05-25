import spacing from '../../tokens/global/spacing';
import makeSpacingSize from '.';

describe('makeSpacingSize', () => {
  it('should return the spacing value in `px`', () => {
    const space = makeSpacingSize(spacing[2]);
    expect(space).toEqual('8px');
  });
});
