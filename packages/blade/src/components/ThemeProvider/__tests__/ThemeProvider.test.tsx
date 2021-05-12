import { renderHook, act, WrapperComponent } from '@testing-library/react-hooks';
import { paymentTheme, colorSchemeNamesInput } from '../../../tokens/theme';
import { ThemeProvider, useTheme, ThemeProviderProps } from '../../ThemeProvider';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<ThemeProvider/>', () => {
  const wrapper: WrapperComponent<ThemeProviderProps> = ({ theme, colorScheme, children }) => (
    <ThemeProvider theme={theme} colorScheme={colorScheme}>
      {children}
    </ThemeProvider>
  );

  it('should render with provided theme and colorscheme', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper,
      initialProps: {
        theme: paymentTheme,
        colorScheme: 'light',
        children: null,
      },
    });

    expect(result.current.theme).toEqual(paymentTheme);
    expect(result.current.colorScheme).toBe('light');
  });

  it('should select colorscheme as "light" when colorscheme not provided', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper,
      initialProps: {
        theme: paymentTheme,
        children: null,
      },
    });

    expect(result.current.colorScheme).toBe('light');
  });

  it('should change colorscheme', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper,
      initialProps: {
        theme: paymentTheme,
        colorScheme: 'light',
        children: null,
      },
    });

    act(() => {
      result.current.setColorScheme('dark');
    });

    expect(result.current.colorScheme).toBe('dark');
  });

  it('should throw error when theme is not passed', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper,
      // @ts-expect-error testing the error case when theme is not passed
      initialProps: {
        colorScheme: 'light',
        children: null,
      },
    });

    expect(result.error?.message).toBe(
      `[ThemeProvider]: Expected valid theme object of type Theme to be passed but found undefined`,
    );
  });

  it(`should throw error when colorscheme is not one of [${colorSchemeNamesInput.toString()}]`, () => {
    const initialColorScheme = 'random';
    const { result } = renderHook(() => useTheme(), {
      wrapper,
      initialProps: {
        theme: paymentTheme,
        // @ts-expect-error testing the error case when colorscheme is not one of [light, dark, system]
        colorScheme: initialColorScheme,
        children: null,
      },
    });

    expect(result.error?.message).toBe(
      `[ThemeProvider]: Expected color scheme to be one of [${colorSchemeNamesInput.toString()}] but received ${initialColorScheme}`,
    );
  });
});
