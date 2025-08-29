import { Platform } from '../../utils';
type Duration = {
    /** `80` milliseconds */
    '2xquick': 80;
    /** `160` milliseconds */
    xquick: 160;
    /** `200` milliseconds */
    quick: 200;
    /** `280` milliseconds */
    moderate: 280;
    /** `360` milliseconds */
    xmoderate: 360;
    /** `480` milliseconds */
    gentle: 480;
    /** `640` milliseconds */
    xgentle: 640;
    /** `960` milliseconds */
    '2xgentle': 960;
};
export type Delay = {
    /** `80` milliseconds */
    '2xquick': 80;
    /** `160` milliseconds */
    xquick: 160;
    /** `280` milliseconds */
    moderate: 280;
    /** `480` milliseconds */
    gentle: 480;
    /** `960` milliseconds */
    xgentle: 960;
    /** `2000` milliseconds */
    long: 2000;
    /** `3000` milliseconds */
    xlong: 3000;
    /** `5000` milliseconds */
    '2xlong': 5000;
};
export type EasingFactoryFn = {
    factory: () => (value: number) => number;
};
export type EasingType<Value extends string> = Platform.Select<{
    web: Value;
    native: EasingFactoryFn;
}>;
type Easing = {
    /**
     * Linear Easing
     *
     * Use Case: Marquee, Progress Bar, etc
     *
     * Returns cubic-bezier string in web and EasingFactoryFn of react-native-reanimated in native
     */
    linear: EasingType<'cubic-bezier(0, 0, 0, 0)'>;
    /**
     * Entrance Animation Easing
     *
     * Use Case: Entry of modals, drawer, dropdown, etc
     *
     * Returns cubic-bezier string in web and EasingFactoryFn of react-native-reanimated in native
     */
    entrance: EasingType<'cubic-bezier(0, 0, 0.2, 1)'>;
    /**
     * Exit Animation Easing
     *
     * Use Case: Exit of modals, drawer, dropdown, etc
     *
     * Returns cubic-bezier string in web and EasingFactoryFn of react-native-reanimated in native
     */
    exit: EasingType<'cubic-bezier(0.17, 0, 1, 1)'>;
    /**
     * Standard Easing
     *
     * Use Case: Morph
     *
     * Returns cubic-bezier string in web and EasingFactoryFn of react-native-reanimated in native
     */
    standard: EasingType<'cubic-bezier(0.3, 0, 0.2, 1)'>;
    /**
     * Emphasized Easing
     *
     * Use Case: Hover states of interactive items
     *
     * Returns cubic-bezier string in web and EasingFactoryFn of react-native-reanimated in native
     */
    emphasized: EasingType<'cubic-bezier(0.5, 0, 0, 1)'>;
    /**
     * Overshoot Easing
     *
     * Use Case: Toast notifications
     *
     * Returns cubic-bezier string in web and EasingFactoryFn of react-native-reanimated in native
     */
    overshoot: EasingType<'cubic-bezier(0.5, 0, 0.3, 1.5)'>;
    /**
     * Error Easing
     *
     * Use Case: Error States
     *
     * Returns cubic-bezier string in web and EasingFactoryFn of react-native-reanimated in native
     */
    shake: EasingType<'cubic-bezier(1, 0.5, 0, 0.5)'>;
};
export type Motion = Readonly<{
    delay: Delay;
    duration: Duration;
    easing: Easing;
}>;
export type EasingString = `easing.${keyof Easing}`;
export type DurationString = `duration.${keyof Duration}`;
export type DelayString = `delay.${keyof Delay}`;
export declare const motion: Motion;
export {};
