import { render } from '@testing-library/react';
import tinycolor from 'tinycolor2';
import { createTheme } from '../createTheme';
import { BladeProvider } from '~components/BladeProvider';
import { Button } from '~components/Button';

describe('createTheme', () => {
  it('should create a theme with the correct brand colors', () => {
    const brandColor = '#83003D';
    const { theme, brandColors } = createTheme({ brandColor });
    const { getByRole } = render(
      <BladeProvider themeTokens={theme} colorScheme="light">
        <Button>Pay now</Button>
      </BladeProvider>,
    );

    expect(
      tinycolor.isReadable(
        theme.colors.onLight.interactive.background.primary.default,
        theme.colors.onLight.interactive.text.onPrimary.normal,
        {
          level: 'AAA',
          size: 'large',
        },
      ),
    ).toBe(true);
    expect(theme).toMatchSnapshot();
    expect(brandColors).toMatchSnapshot();
    expect(getByRole('button')).toMatchSnapshot();
  });

  it('should create a theme with the correct brand colors', () => {
    const brandColor = '#FFF10A';
    const { theme, brandColors } = createTheme({ brandColor });
    const { getByRole } = render(
      <BladeProvider themeTokens={theme} colorScheme="dark">
        <Button>Pay now</Button>
      </BladeProvider>,
    );
    expect(
      tinycolor.isReadable(
        theme.colors.onLight.interactive.background.primary.default,
        theme.colors.onLight.interactive.text.onPrimary.normal,
        {
          level: 'AAA',
          size: 'large',
        },
      ),
    ).toBe(true);
    expect(theme).toMatchSnapshot();
    expect(brandColors).toMatchSnapshot();
    expect(getByRole('button')).toMatchSnapshot();
  });
});
