import type { DotNotationMotionStringToken } from '~src/_helpers/types';
import type { Platform } from '~utils';
import { makeBezier } from '~utils';

type Duration = {
  /** `70` milliseconds */
  '2xquick': 70;
  /** `150` milliseconds */
  xquick: 150;
  /** `200` milliseconds */
  quick: 200;
  /** `250` milliseconds */
  moderate: 250;
  /** `300` milliseconds */
  xmoderate: 300;
  /** `400` milliseconds */
  gentle: 400;
  /** `600` milliseconds */
  xgentle: 600;
  /** `900` milliseconds */
  '2xgentle': 900;
};

type Delay = {
  /** `70` milliseconds */
  '2xshort': 70;
  /** `120` milliseconds */
  xshort: 120;
  /** `180` milliseconds */
  short: 180;
  /** `3000` milliseconds */
  long: 3000;
  /** `5000` milliseconds */
  xlong: 5000;
};

export type EasingFunctionFactory = { factory: () => (value: number) => number }; // similar to EasingFunctionFactory of `react-native-reanimated`
type EasingType<Value extends string> = Platform.Select<{
  web: Value;
  native: EasingFunctionFactory;
}>;

type Easing = {
  /** Easings for all standard animations*/
  standard: {
    /** `cubic-bezier(0.5, 0, 0.3, 1.5)`
     *
     *  Returns a `string` of `"cubic-bezier(...)"` for web & react-native-reanimated's Easing Function of type `EasingFunctionFactory` for native */
    attentive: EasingType<'cubic-bezier(0.5, 0, 0.3, 1.5)'>;
    /** `cubic-bezier(0.3, 0, 0.2, 1)`
     *
     *  Returns a `string` of `"cubic-bezier(...)"` for web & react-native-reanimated's Easing Function of type `EasingFunctionFactory` for native */
    effective: EasingType<'cubic-bezier(0.3, 0, 0.2, 1)'>;
    /** `cubic-bezier(0.5, 0, 0, 1)`
     *
     *  Returns a `string` of `"cubic-bezier(...)"` for web & react-native-reanimated's Easing Function of type `EasingFunctionFactory` for native */
    revealing: EasingType<'cubic-bezier(0.5, 0, 0, 1)'>;
    /** `cubic-bezier(1, 0.5, 0, 0.5)`
     *
     *  Returns a `string` of `"cubic-bezier(...)"` for web & react-native-reanimated's Easing Function of type `EasingFunctionFactory` for native */
    wary: EasingType<'cubic-bezier(1, 0.5, 0, 0.5)'>;
  };
  /** Easings for all entrance animations*/
  entrance: {
    /** `cubic-bezier(0.5, 0, 0.3, 1.5)`
     *
     *  Returns a `string` of `"cubic-bezier(...)"` for web & react-native-reanimated's Easing Function of type `EasingFunctionFactory` for native */
    attentive: EasingType<'cubic-bezier(0.5, 0, 0.3, 1.5)'>;
    /** `cubic-bezier(0, 0, 0.2, 1)`
     *
     *  Returns a `string` of `"cubic-bezier(...)"` for web & react-native-reanimated's Easing Function of type `EasingFunctionFactory` for native */
    effective: EasingType<'cubic-bezier(0, 0, 0.2, 1)'>;
    /** `cubic-bezier(0, 0, 0, 1)`
     *
     *  Returns a `string` of `"cubic-bezier(...)"` for web & react-native-reanimated's Easing Function of type `EasingFunctionFactory` for native */
    revealing: EasingType<'cubic-bezier(0, 0, 0, 1)'>;
  };
  /** Easings for all exit animations*/
  exit: {
    /** `cubic-bezier(0.7, 0, 0.5, 1)`
     *
     *  Returns a `string` of `"cubic-bezier(...)"` for web & react-native-reanimated's Easing Function of type `EasingFunctionFactory` for native */
    attentive: EasingType<'cubic-bezier(0.7, 0, 0.5, 1)'>;
    /** `cubic-bezier(0.17, 0, 1, 1)`
     *
     *  Returns a `string` of `"cubic-bezier(...)"` for web & react-native-reanimated's Easing Function of type `EasingFunctionFactory` for native */
    effective: EasingType<'cubic-bezier(0.17, 0, 1, 1)'>;
    /** `cubic-bezier(0.5, 0, 1, 1)`
     *
     *  Returns a `string` of `"cubic-bezier(...)"` for web & react-native-reanimated's Easing Function of type `EasingFunctionFactory` for native */
    revealing: EasingType<'cubic-bezier(0.5, 0, 1, 1)'>;
  };
};

export type Motion = Readonly<{
  delay: Delay;
  duration: Duration;
  easing: Easing;
}>;

export type EasingString = `easing.${DotNotationMotionStringToken<Easing>}`;
export type DurationString = `duration.${keyof Duration}`;
export type DelayString = `delay.${keyof Delay}`;

const delay: Delay = {
  '2xshort': 70,
  xshort: 120,
  short: 180,
  long: 3000,
  xlong: 5000,
};

const duration: Duration = {
  '2xquick': 70,
  xquick: 150,
  quick: 200,
  moderate: 250,
  xmoderate: 300,
  gentle: 400,
  xgentle: 600,
  '2xgentle': 900,
};

/* makeBezier returns a string of `cubic-bezier()` for web & a react-native-reanimated Easing Function of type `EasingFunctionFactory` for native */
const easing: Easing = {
  standard: {
    attentive: makeBezier(0.5, 0, 0.3, 1.5),
    effective: makeBezier(0.3, 0, 0.2, 1),
    revealing: makeBezier(0.5, 0, 0, 1),
    wary: makeBezier(1, 0.5, 0, 0.5),
  },
  entrance: {
    attentive: makeBezier(0.5, 0, 0.3, 1.5),
    effective: makeBezier(0, 0, 0.2, 1),
    revealing: makeBezier(0, 0, 0, 1),
  },
  exit: {
    attentive: makeBezier(0.7, 0, 0.5, 1),
    effective: makeBezier(0.17, 0, 1, 1),
    revealing: makeBezier(0.5, 0, 1, 1),
  },
};

export const motion: Motion = {
  delay,
  duration,
  easing,
};
