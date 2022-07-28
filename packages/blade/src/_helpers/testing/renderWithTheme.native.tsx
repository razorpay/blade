import type { RenderAPI } from '@testing-library/react-native';
import { render } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import { BladeProvider } from '~components/BladeProvider';
import { paymentTheme } from '~tokens/theme';

const renderWithTheme = (ui: ReactElement): RenderAPI =>
  render(
    <BladeProvider themeTokens={paymentTheme} colorScheme="light">
      {ui}
    </BladeProvider>,
  );

export default renderWithTheme;
