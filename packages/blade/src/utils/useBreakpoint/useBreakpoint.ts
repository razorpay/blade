/**
 * What do we want to do?
 * 1. register an event listener on screen resize
 * 2. get the current matched media query
 * 3. set the appropriate typography scale based on the matched media
 * what to be set in state?
 *  - {
 * matchedBreakpoints:[]
 * deviceType:''
 * }
 */

import { useEffect, useState, useCallback } from 'react';
import type { Breakpoints } from '../../tokens/global';

type DeviceType = 'desktop' | 'mobile';

type BreakpointAndDevice = {
  matchedBreakpoints: string[];
  deviceType: DeviceType;
};

const useBreakpoint = ({ breakpoints }: { breakpoints: Breakpoints }): BreakpointAndDevice => {
  const supportsMatchMedia =
    typeof document !== 'undefined' && typeof window?.matchMedia === 'function';

  const getMatchedBreakpointsAndDevice = useCallback((): BreakpointAndDevice => {
    const matchedBreakpoints = supportsMatchMedia
      ? Object.entries(breakpoints)
          .map(([key, value]) => {
            if (window.matchMedia(`(min-width: ${value}px)`).matches) {
              return key;
            }
            return '';
          })
          .filter(Boolean)
      : [];

    let deviceType: DeviceType;
    if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
      // react-native
      deviceType = 'mobile';
    } else if (typeof document !== 'undefined') {
      // browser
      if (
        matchedBreakpoints.some((matchedBreakpoint) => ['xs', 's', 'm'].includes(matchedBreakpoint))
      ) {
        // tablet is also categorised as mobile
        deviceType = 'mobile';
      } else {
        deviceType = 'desktop';
      }
    } else {
      // node
      //@TODO: Check for useragent for node
      deviceType = 'desktop';
    }

    return {
      matchedBreakpoints,
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
