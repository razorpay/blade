import { render } from '@testing-library/react-native';
import { BladeProvider } from '~components/BladeProvider';
import { bladeTheme } from '~tokens/theme';

import type { RenderAPI, RenderOptions } from '@testing-library/react-native';
import type { ReactElement } from 'react';

const renderWithTheme = (ui: ReactElement, options: RenderOptions = {}): RenderAPI =>
  render(
    <BladeProvider themeTokens={bladeTheme} colorScheme="light">
      {ui}
    </BladeProvider>,
    options,
  );

export default renderWithTheme;
