/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { useEffect, useState, useCallback, useMemo } from 'react';
import { getPlatformType } from '../getPlatformType';
import { getMediaQuery } from '../getMediaQuery';
import type { Breakpoints } from '~tokens/global';

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

export const useBreakpoint = ({
  breakpoints,
}: {
  breakpoints: Breakpoints;
}): BreakpointAndDevice => {
  const supportsMatchMedia =
    typeof document !== 'undefined' &&
    typeof window !== 'undefined' &&
    typeof window?.matchMedia === 'function';

  const breakpointsTokenAndQueryCollection = useMemo(
    () =>
      (supportsMatchMedia
        ? Object.entries(breakpoints).map(([token, screenSize]) => {
            const mediaQuery = getMediaQuery(screenSize);
            return { token, screenSize, mediaQuery };
          })
        : []) as {
        token: keyof Breakpoints;
        screenSize: number;
        mediaQuery: string;
      }[],
    [breakpoints, supportsMatchMedia],
  );

  const getMatchedDeviceType = useCallback((matchedBreakpoint: Breakpoint): DeviceType => {
    let matchedDeviceType: DeviceType = deviceType.mobile;
    const platform = getPlatformType();
    if (platform === 'react-native') {
      matchedDeviceType = deviceType.mobile;
    } else if (platform === 'browser') {
      // @TODO: In earlier logic, tablets were not considered as "mobile" here. Although the comment said "tablets are considered as mobile"
      // Now that we've changed the tokens to `min-width`, it will start considering tab as mobile.
      // Check if that is expected or not
      if (matchedBreakpoint && ['xs', 's', 'm'].includes(matchedBreakpoint)) {
        // tablet is also categorised as mobile
        matchedDeviceType = deviceType.mobile;
      } else {
        matchedDeviceType = deviceType.desktop;
      }
    } else if (platform === 'node') {
      //@TODO: Check for useragent for node
      matchedDeviceType = deviceType.desktop;
    }
    return matchedDeviceType;
  }, []);

  const getMatchedBreakpoint = useCallback(
    (event?: MediaQueryListEvent): Breakpoint => {
      const matchedBreakpoint =
        breakpointsTokenAndQueryCollection.find(({ mediaQuery = '' }) => {
          // this will run whenever mediaQuery change event is triggered
          if (event?.media === mediaQuery) {
            return true;
          }
          // this will run when the state is initialised for the first time and hence the event object will be empty so we'll fallback to browser's window object
          if (window.matchMedia(mediaQuery).matches) {
            return true;
          }
          return false;
        })?.token ?? undefined;

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
      setBreakpointAndDevice(() => {
        const matchedBreakpoint = getMatchedBreakpoint(event);
        const matchedDeviceType = getMatchedDeviceType(matchedBreakpoint);

        return { matchedBreakpoint, matchedDeviceType };
      });
    };

    const mediaQueryInstances = breakpointsTokenAndQueryCollection.map(({ mediaQuery = '' }) => {
      const mediaQueryInstance = window.matchMedia(mediaQuery);
      /**
       * the mediaquery event listener is available on mediaQuery instances and not `window`
       * we iterate over all the breakpoints we have, register each instance and store them as `mediaQueryInstances` so we can later unregister all of them.
       */
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
