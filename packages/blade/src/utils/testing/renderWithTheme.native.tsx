import type { RenderAPI } from '@testing-library/react-native';
import { render } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import { BladeProvider } from '~components/BladeProvider';
import { bladeTheme } from '~tokens/theme';

const renderWithTheme = (ui: ReactElement): RenderAPI =>
  render(
    <BladeProvider themeTokens={bladeTheme} colorScheme="light">
      {ui}
    </BladeProvider>,
  );

export default renderWithTheme;
