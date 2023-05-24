import type { RenderResult } from '@testing-library/react';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { BladeProvider } from '~components/BladeProvider';
import { paymentTheme } from '~tokens/theme';

const renderWithTheme = (ui: ReactElement): RenderResult =>
  render(
    <BladeProvider themeTokens={paymentTheme} colorScheme="light">
      {ui}
    </BladeProvider>,
  );

export default renderWithTheme;
