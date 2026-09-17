import type { RenderAPI, RenderOptions } from '@testing-library/react-native';
import { render } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import { BladeProvider } from '~components/BladeProvider';
import { bladeTheme } from '~tokens/theme';

const BladeWrapper = ({ children }: { children: ReactElement }): ReactElement => (
  <BladeProvider themeTokens={bladeTheme} colorScheme="light">
    {children}
  </BladeProvider>
);

const renderWithTheme = (ui: ReactElement, options: RenderOptions = {}): RenderAPI =>
  render(ui, { ...options, wrapper: BladeWrapper });

export default renderWithTheme;
