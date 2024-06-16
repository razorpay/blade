import { mergeProps } from '~utils/mergeProps';

describe('mergeProps', () => {
  it('should merge two basic props', () => {
    expect(mergeProps({ a: 1, b: 2 }, { c: 3 })).toStrictEqual({ a: 1, b: 2, c: 3 });
  });

  it('should merge two function props', () => {
    const functionOne = jest.fn();
    const functionTwo = jest.fn();
    const mergedFunction = mergeProps({ callback: functionOne }, { callback: functionTwo });
    expect(mergedFunction).toBeTruthy();

    expect(functionOne).toHaveBeenCalledTimes(0);
    expect(functionTwo).toHaveBeenCalledTimes(0);

    const passedArgs = 'passed args';
    mergedFunction.callback(passedArgs);

    expect(functionOne).toHaveBeenCalledWith(passedArgs);
    expect(functionTwo).toHaveBeenCalledWith(passedArgs);
  });
});
