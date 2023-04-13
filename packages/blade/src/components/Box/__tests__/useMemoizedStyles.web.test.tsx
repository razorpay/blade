import { renderHook } from '@testing-library/react-hooks';
import { getMemoDependency, useMemoizedStyles } from '../BaseBox/useMemoizedStyles';
import paymentLightTheme from '~components/BladeProvider/__tests__/paymentLightTheme/paymentLightTheme.web';
import { BladeProvider } from '~components/BladeProvider';
import { paymentTheme } from '~tokens/theme';

const BladeThemeProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <BladeProvider themeTokens={paymentTheme} colorScheme="light">
      {children}
    </BladeProvider>
  );
};

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
        theme: { name: 'paymentTheme', something: 'something' },
        colorScheme: 'light',
      }),
    ).toMatchInlineSnapshot(
      `"{\\"paddingLeft\\":\\"12px\\",\\"display\\":\\"block\\"}-paymentTheme-light"`,
    );
  });
});

describe('useMemoizedStyles', () => {
  it('should return correct CSS styles', () => {
    const { result } = renderHook(
      () =>
        useMemoizedStyles({
          padding: 'spacing.10',
          margin: ['spacing.1', 'spacing.2'],
          theme: paymentLightTheme,
        }),
      {
        wrapper: BladeThemeProvider,
      },
    );

    expect(JSON.stringify(result.current)).toMatchInlineSnapshot(
      `"{\\"padding\\":\\"48px\\",\\"margin\\":\\"2px 4px\\"}"`,
    );
  });
});
