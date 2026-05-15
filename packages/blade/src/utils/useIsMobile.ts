import { useTheme } from '~components/BladeProvider';

import { useBreakpoint } from './useBreakpoint';

const useIsMobile = (): boolean => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({
    breakpoints: theme.breakpoints,
  });
  return matchedDeviceType === 'mobile';
};

export { useIsMobile };
