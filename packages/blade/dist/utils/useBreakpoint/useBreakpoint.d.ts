import { Breakpoints } from '../../tokens/global';
declare const deviceType: {
    readonly desktop: "desktop";
    readonly mobile: "mobile";
};
type DeviceType = keyof typeof deviceType;
type Breakpoint = keyof Breakpoints | undefined;
type BreakpointAndDevice = {
    matchedBreakpoint: Breakpoint;
    matchedDeviceType: DeviceType;
};
export declare const useBreakpoint: ({ breakpoints, }: {
    breakpoints: Breakpoints;
}) => BreakpointAndDevice;
export type { DeviceType };
