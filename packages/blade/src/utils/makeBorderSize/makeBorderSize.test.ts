import { makeBorderSize } from '.';
import { border } from '~tokens/global';

describe('makeBorderSize', () => {
  it('should return the border width in `px`', () => {
    const space = makeBorderSize(border.width.thin);
    expect(space).toEqual('1px');
  });
  it('should return the border radius in `px`', () => {
    const space = makeBorderSize(border.radius.small);
    expect(space).toEqual('2px');
  });
  it('should return the border radius in `%`', () => {
    const space = makeBorderSize(border.radius.round);
    expect(space).toEqual('50%');
  });
});
