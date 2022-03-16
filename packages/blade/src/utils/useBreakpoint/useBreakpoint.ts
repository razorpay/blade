import { useEffect, useState, useCallback, useMemo } from 'react';
import type { Breakpoints } from '../../tokens/global';

const deviceType = {
  desktop: 'desktop',
  mobile: 'mobile',
} as const;

type DeviceType = keyof typeof deviceType;
type Breakpoint = keyof Breakpoints | undefined;

type BreakpointAndDevice = {
  matchedBreakpoint: Breakpoint;
  matchedDeviceType: DeviceType;
};

const useBreakpoint = ({ breakpoints }: { breakpoints: Breakpoints }): BreakpointAndDevice => {
  const supportsMatchMedia =
    typeof document !== 'undefined' && typeof window?.matchMedia === 'function';

  const breakpointsTokenAndQueryCollection = useMemo(
    () =>
      (supportsMatchMedia
        ? Object.entries(breakpoints).map(
            ([breakpointTokenName, breakpointSize], index, breakpointsArray) => {
              let mediaQuery = '';

              if (breakpointTokenName === 'max') {
                mediaQuery = `screen and (min-width: ${breakpointSize}px)`;
              } else if (breakpointsArray[index - 1]) {
                mediaQuery = `screen and (min-width: ${
                  breakpointsArray[index - 1][1] + 1
                }px) and (max-width: ${breakpointSize}px)`;
              } else {
                mediaQuery = `screen and (max-width: ${breakpointSize}px)`;
              }

              return [breakpointTokenName, breakpointSize, mediaQuery];
            },
          )
        : []) as [keyof Breakpoints, number, string][],
    [breakpoints, supportsMatchMedia],
  );

  const getMatchedDeviceType = useCallback((matchedBreakpoint: Breakpoint): DeviceType => {
    let matchedDeviceType: DeviceType = deviceType.mobile;
    if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
      // react-native
      matchedDeviceType = deviceType.mobile;
    } else if (typeof document !== 'undefined') {
      // browser
      if (matchedBreakpoint && ['xs', 's', 'm'].includes(matchedBreakpoint)) {
        // tablet is also categorised as mobile
        matchedDeviceType = deviceType.mobile;
      } else {
        matchedDeviceType = deviceType.desktop;
      }
    } else if (typeof process !== 'undefined') {
      // node
      //@TODO: Check for useragent for node
      matchedDeviceType = deviceType.desktop;
    }
    return matchedDeviceType;
  }, []);

  const getMatchedBreakpoint = useCallback(
    (event?: MediaQueryListEvent): Breakpoint => {
      const matchedBreakpoint =
        breakpointsTokenAndQueryCollection.find(([_, __, mediaQuery]) => {
          if (event?.media === mediaQuery) {
            return true;
          }
          if (window.matchMedia(mediaQuery).matches) {
            return true;
          }
          return false;
        })?.[0] ?? undefined;

      return matchedBreakpoint;
    },
    [breakpointsTokenAndQueryCollection],
  );

  const [breakpointAndDevice, setBreakpointAndDevice] = useState(() => {
    const matchedBreakpoint = getMatchedBreakpoint();
    const matchedDeviceType = getMatchedDeviceType(matchedBreakpoint);
    return {
      matchedBreakpoint,
      matchedDeviceType,
    };
  });

  useEffect(() => {
    if (!supportsMatchMedia) {
      return undefined;
    }

    const handleMediaQueryChange = (event: MediaQueryListEvent): void => {
      setBreakpointAndDevice((prevBreakpointAndDevice) => {
        const matchedBreakpoint = getMatchedBreakpoint(event);
        const matchedDeviceType = getMatchedDeviceType(matchedBreakpoint);
        if (
          prevBreakpointAndDevice.matchedBreakpoint !== matchedBreakpoint ||
          prevBreakpointAndDevice.matchedDeviceType !== matchedDeviceType
        ) {
          return { matchedBreakpoint, matchedDeviceType };
        }
        return prevBreakpointAndDevice;
      });
    };

    const mediaQueryInstances = breakpointsTokenAndQueryCollection.map(([_, __, mediaQuery]) => {
      const mediaQueryInstance = window.matchMedia(mediaQuery);
      if (mediaQueryInstance.addEventListener) {
        mediaQueryInstance.addEventListener('change', handleMediaQueryChange);
      } else {
        // In older browsers MediaQueryList do not yet inherit from EventTarget, So using addListener as fallback - https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList/addListener
        mediaQueryInstance.addListener(handleMediaQueryChange);
      }
      return mediaQueryInstance;
    });

    return (): void => {
      mediaQueryInstances.forEach((mediaQueryInstance) => {
        if (mediaQueryInstance.removeEventListener) {
          mediaQueryInstance.removeEventListener('change', handleMediaQueryChange);
        } else {
          // In older browsers MediaQueryList do not yet inherit from EventTarget, So using removeListener as fallback - https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList/removeListener
          mediaQueryInstance.removeListener(handleMediaQueryChange);
        }
      });
    };
  }, [
    breakpointsTokenAndQueryCollection,
    getMatchedBreakpoint,
    getMatchedDeviceType,
    supportsMatchMedia,
  ]);

  // @TODO: handle SSR scenarios
  return breakpointAndDevice;
};

export default useBreakpoint;
