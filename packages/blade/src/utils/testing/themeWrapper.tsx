import { BladeProvider } from '~components/BladeProvider';
import { bladeTheme } from '~tokens/theme';

import type { ReactElement } from 'react';

const themeWrapper = ({ children }: { children: ReactElement }): ReactElement => (
  <BladeProvider themeTokens={bladeTheme} colorScheme="light">
    {children}
  </BladeProvider>
);

export default themeWrapper;
