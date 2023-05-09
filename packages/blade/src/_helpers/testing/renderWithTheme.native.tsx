import { PortalHost, PortalProvider } from '@gorhom/portal';
import type { RenderAPI } from '@testing-library/react-native';
import { render } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import { BladeProvider } from '~components/BladeProvider';
import { paymentTheme } from '~tokens/theme';

const renderWithTheme = (ui: ReactElement): RenderAPI =>
  render(
    <PortalProvider>
      <BladeProvider themeTokens={paymentTheme} colorScheme="light">
        {ui}
        <PortalHost name="BladeBottomSheetPortal" />
      </BladeProvider>
    </PortalProvider>,
  );

export default renderWithTheme;
