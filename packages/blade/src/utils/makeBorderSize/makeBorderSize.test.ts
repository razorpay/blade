import { makeBorderSize } from '.';
import { border } from '~tokens/global';
import { isReactNative } from '~utils';

describe('makeBorderSize', () => {
  it('should return the border width in `px`', () => {
    const space = makeBorderSize(border.width.thin);
    // Native returns raw numbers; web returns `${n}px` strings
    expect(space).toEqual(isReactNative() ? 1 : '1px');
  });
  it('should return the border radius in `px`', () => {
    const space = makeBorderSize(border.radius.small);
    expect(space).toEqual(isReactNative() ? 8 : '8px');
  });
  it('should return the border radius in `%`', () => {
    const space = makeBorderSize(border.radius.round);
    // On native, `parseFloat("50%")` → 50 (RN uses numeric border radii)
    expect(space).toEqual(isReactNative() ? 50 : '50%');
  });
});
