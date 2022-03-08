import { useEffect, useState, useCallback } from 'react';
import type { Breakpoints } from '../../tokens/global';

type DeviceType = 'desktop' | 'mobile';
type MatchedBreakpoint = keyof Breakpoints | '';

type BreakpointAndDevice = {
  matchedBreakpoint: MatchedBreakpoint;
  deviceType: DeviceType;
};

const useBreakpoint = ({ breakpoints }: { breakpoints: Breakpoints }): BreakpointAndDevice => {
  const supportsMatchMedia =
    typeof document !== 'undefined' && typeof window?.matchMedia === 'function';

  const getMatchedBreakpointsAndDevice = useCallback((): BreakpointAndDevice => {
    const breakpointsCollection = (supportsMatchMedia ? Object.entries(breakpoints) : []) as [
      keyof Breakpoints,
      number,
    ][];

    const matchedBreakpoint =
      breakpointsCollection.find(([_, value], index) => {
        const mediaQuery = breakpointsCollection[index - 1]
          ? `(min-width: ${breakpointsCollection[index - 1][1] + 1}px) and (max-width: ${value}px)`
          : `(max-width: ${value}px)`;

        if (window.matchMedia(mediaQuery).matches) {
          return true;
        }
        return false;
      })?.[0] ?? '';

    let deviceType: DeviceType = 'desktop';
    if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
      // react-native
      deviceType = 'mobile';
    } else if (typeof document !== 'undefined') {
      // browser
      if (['xs', 's', 'm'].includes(matchedBreakpoint)) {
        // tablet is also categorised as mobile
        deviceType = 'mobile';
      } else {
        deviceType = 'desktop';
      }
    } else if (typeof process !== 'undefined') {
      // node
      //@TODO: Check for useragent for node
      deviceType = 'desktop';
    }

    return {
      matchedBreakpoint,
      deviceType,
    };
  }, [breakpoints, supportsMatchMedia]);

  const [breakpointAndDevice, setBreakpointAndDevice] = useState(getMatchedBreakpointsAndDevice);

  useEffect(() => {
    if (!supportsMatchMedia) {
      return undefined;
    }

    const handleResize = (): void => {
      setBreakpointAndDevice(getMatchedBreakpointsAndDevice);
    };

    window.addEventListener('resize', handleResize);

    return (): void => {
      window.removeEventListener('resize', handleResize);
    };
  }, [supportsMatchMedia, getMatchedBreakpointsAndDevice]);

  return breakpointAndDevice;
};

export default useBreakpoint;
