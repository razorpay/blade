import type { ReactElement } from 'react';
import { BladeProvider } from '~components/BladeProvider';
import { bladeTheme } from '~tokens/theme';

const themeWrapper = ({ children }: { children: ReactElement }): ReactElement => (
  <BladeProvider themeTokens={bladeTheme} colorScheme="light">
    {children}
  </BladeProvider>
);

export default themeWrapper;
