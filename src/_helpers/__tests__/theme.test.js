import * as themeHelpers from '../theme';

afterEach(() => {
  jest.clearAllMocks();
});

describe('test "makePxValue" helper function', () => {
  it('checks "makePxValue" is called with 1 argument', () => {
    const spy = jest.spyOn(themeHelpers, 'makePxValue');
    const value = themeHelpers.makePxValue(2);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith(2);
    expect(value).toEqual('16px');
  });

  it('checks "makePxValue" is called with 1 argument(Array)', () => {
    const spy = jest.spyOn(themeHelpers, 'makePxValue');
    const value = themeHelpers.makePxValue([1, 2]);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith([1, 2]);
    expect(value).toEqual('8px 16px');
  });

  it('checks "makePxValue" throws error when it is called with array of length >4', () => {
    const expectedErrorMessage =
      'Error in makePxValue: array length should be less than or equal to 4';
    expect(() => themeHelpers.makePxValue([1, 2, 3, 4, 5])).toThrow(expectedErrorMessage);
  });
});
