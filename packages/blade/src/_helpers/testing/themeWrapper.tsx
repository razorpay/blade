import type { ReactElement } from 'react';
import { BladeProvider } from '../../components/BladeProvider';
import { paymentTheme } from '../../tokens/theme';

const themeWrapper = ({ children }: { children: ReactElement }): ReactElement => (
  <BladeProvider themeTokens={paymentTheme} colorScheme="light">
    {children}
  </BladeProvider>
);

export default themeWrapper;
