import * as themeHelpers from '../theme';

afterEach(() => {
  jest.clearAllMocks();
});

describe('test "getPxScale" helper function', () => {
  it('checks "getPxScale" is called with 1 argument', () => {
    const spy = jest.spyOn(themeHelpers, 'getPxScale');
    const value = themeHelpers.getPxScale(2);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith(2);
    expect(value).toEqual('16px');
  });

  it('checks "getPxScale" is called with 1 argument(Array)', () => {
    const spy = jest.spyOn(themeHelpers, 'getPxScale');
    const value = themeHelpers.getPxScale([1, 2]);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith([1, 2]);
    expect(value).toEqual('8px 16px');
  });
});
