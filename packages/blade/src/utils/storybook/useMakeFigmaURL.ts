import { DocsContext } from '@storybook/addon-docs';
import { useContext } from 'react';

const useMakeFigmaURL = (
  themeURLs: {
    themeTokenName: 'paymentTheme' | 'bankingTheme';
    lightModeURL?: string;
    darkModeURL?: string;
  }[],
): string => {
  const {
    // @ts-expect-error globals is available but the typings in storybook are properly defined hence, ignoring it
    globals: { themeTokenName, colorScheme },
  } = useContext(DocsContext);
  const themeURL = themeURLs.find((url) => url.themeTokenName === themeTokenName);

  if (themeTokenName === 'paymentTheme') {
    if (colorScheme === 'light') {
      return themeURL?.lightModeURL ?? '#';
    }
    return themeURL?.darkModeURL ?? '#';
  }
  if (themeTokenName === 'bankingTheme') {
    if (colorScheme === 'light') {
      return themeURL?.lightModeURL ?? '#';
    }
    return themeURL?.darkModeURL ?? '#';
  }
  return '#';
};

export default useMakeFigmaURL;
