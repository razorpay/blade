import { renderHook, act, WrapperComponent } from '@testing-library/react-hooks';
import { clear, mockUserAgent } from 'jest-useragent-mock';
import { paymentTheme, colorSchemeNamesInput } from '../../../tokens/theme';
import { BladeProvider, useTheme, BladeProviderProps } from '../../BladeProvider';
import paymentLightTheme from './paymentLightTheme';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<BladeProvider/>', () => {
  beforeEach(() => {
    const mobileUserAgent =
      'Mozilla/5.0 (Linux; Android 6.0.1; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Mobile Safari/537.36';
    mockUserAgent(mobileUserAgent);
  });
  afterEach(() => {
    clear();
  });

  const wrapper: WrapperComponent<BladeProviderProps> = ({
    themeTokens,
    colorScheme,
    children,
  }) => (
    <BladeProvider themeTokens={themeTokens} colorScheme={colorScheme}>
      {children}
    </BladeProvider>
  );

  it('should render with provided theme and colorscheme', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper,
      initialProps: {
        themeTokens: paymentTheme,
        colorScheme: 'light',
        children: null,
      },
    });

    expect(result.current.theme).toEqual(paymentLightTheme);
    expect(result.current.colorScheme).toBe('light');
  });

  it('should select colorscheme as "light" when colorscheme not provided', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper,
      initialProps: {
        themeTokens: paymentTheme,
        children: null,
      },
    });

    expect(result.current.colorScheme).toBe('light');
  });

  it('should change colorscheme', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper,
      initialProps: {
        themeTokens: paymentTheme,
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
      `[BladeProvider]: Expected valid themeTokens of type ThemeTokens to be passed but found undefined`,
    );
  });

  it(`should throw error when colorscheme is not one of [${colorSchemeNamesInput.toString()}]`, () => {
    const initialColorScheme = 'random';
    const { result } = renderHook(() => useTheme(), {
      wrapper,
      initialProps: {
        themeTokens: paymentTheme,
        // @ts-expect-error testing the error case when colorscheme is not one of [light, dark, system]
        colorScheme: initialColorScheme,
        children: null,
      },
    });

    expect(result.error?.message).toBe(
      `[BladeProvider]: Expected color scheme to be one of [${colorSchemeNamesInput.toString()}] but received ${initialColorScheme}`,
    );
  });
});
