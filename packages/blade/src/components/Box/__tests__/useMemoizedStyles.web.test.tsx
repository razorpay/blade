import type { CSSObject } from 'styled-components';
import { getMemoDependency, useMemoizedStyles } from '../BaseBox/useMemoizedStyles';
import paymentLightTheme from '~components/BladeProvider/__tests__/paymentLightTheme/paymentLightTheme.web';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('getDependencyProp', () => {
  it('should return react usememo dependency prop', () => {
    expect(
      getMemoDependency({
        paddingLeft: '12px',
        display: 'block',
        id: 'yo',
        className: 'hi',
        children: 'wuuhuuu',
        // @ts-expect-error: we don't have to care about actual theme object. It is ignored in this function
        theme: { something: 'something' },
      }),
    ).toMatchInlineSnapshot(`"{\\"paddingLeft\\":\\"12px\\",\\"display\\":\\"block\\"}"`);
  });
});

describe('useMemoizedStyles', () => {
  const MockComponentToTestHook = ({
    returnValueCallback,
  }: {
    returnValueCallback: (val: CSSObject) => void;
  }): null => {
    const memoVal = useMemoizedStyles({
      padding: 'spacing.10',
      margin: ['spacing.1', 'spacing.2'],
      theme: paymentLightTheme,
    });
    returnValueCallback(memoVal);
    return null;
  };

  it('should return correct CSS styles', () => {
    const returnValueCallback = jest.fn();
    renderWithTheme(<MockComponentToTestHook returnValueCallback={returnValueCallback} />);
    expect(JSON.stringify(returnValueCallback.mock.calls[0][0])).toMatchInlineSnapshot(
      `"{\\"padding\\":\\"48px\\",\\"margin\\":\\"2px 4px\\"}"`,
    );
  });
});
