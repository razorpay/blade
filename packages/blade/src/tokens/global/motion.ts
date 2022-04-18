import makeBezier from '../../utils/makeBezier';

type Duration = {
  /** `70` milliseconds */
  quick1: 70;
  /** `150` milliseconds */
  quick2: 150;
  /** `200` milliseconds */
  quick3: 200;
  /** `250` milliseconds */
  moderate1: 250;
  /** `300` milliseconds */
  moderate2: 300;
  /** `400` milliseconds */
  gentle1: 400;
  /** `600` milliseconds */
  gentle2: 600;
  /** `900` milliseconds */
  gentle3: 900;
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

type Easing = {
  /** Easings for all standard animations*/
  standard: {
    /** `cubic-bezier(0.5, 0, 0.3, 1.5)`
     *
     *  Returns a `string` of `"cubic-bezier(...)"` for web & react-native-reanimated's Easing Function of type `EasingFunctionFactory` for native */
    attentive: 'cubic-bezier(0.5, 0, 0.3, 1.5)' | { factory: () => (value: number) => number };
    /** `cubic-bezier(0.3, 0, 0.2, 1)`
     *
     *  Returns a `string` of `"cubic-bezier(...)"` for web & react-native-reanimated's Easing Function of type `EasingFunctionFactory` for native */
    effective: 'cubic-bezier(0.3, 0, 0.2, 1)' | { factory: () => (value: number) => number };
    /** `cubic-bezier(0.5, 0, 0, 1)`
     *
     *  Returns a `string` of `"cubic-bezier(...)"` for web & react-native-reanimated's Easing Function of type `EasingFunctionFactory` for native */
    revealing: 'cubic-bezier(0.5, 0, 0, 1)' | { factory: () => (value: number) => number };
    /** `cubic-bezier(1, 0.5, 0, 0.5)`
     *
     *  Returns a `string` of `"cubic-bezier(...)"` for web & react-native-reanimated's Easing Function of type `EasingFunctionFactory` for native */
    wary: 'cubic-bezier(1, 0.5, 0, 0.5)' | { factory: () => (value: number) => number };
  };
  /** Easings for all entrance animations*/
  entrance: {
    /** `cubic-bezier(0.5, 0, 0.3, 1.5)`
     *
     *  Returns a `string` of `"cubic-bezier(...)"` for web & react-native-reanimated's Easing Function of type `EasingFunctionFactory` for native */
    attentive: 'cubic-bezier(0.5, 0, 0.3, 1.5)' | { factory: () => (value: number) => number };
    /** `cubic-bezier(0, 0, 0.2, 1)`
     *
     *  Returns a `string` of `"cubic-bezier(...)"` for web & react-native-reanimated's Easing Function of type `EasingFunctionFactory` for native */
    effective: 'cubic-bezier(0, 0, 0.2, 1)' | { factory: () => (value: number) => number };
    /** `cubic-bezier(0, 0, 0, 1)`
     *
     *  Returns a `string` of `"cubic-bezier(...)"` for web & react-native-reanimated's Easing Function of type `EasingFunctionFactory` for native */
    revealing: 'cubic-bezier(0, 0, 0, 1)' | { factory: () => (value: number) => number };
  };
  /** Easings for all exit animations*/
  exit: {
    /** `cubic-bezier(0.7, 0, 0.5, 1)`
     *
     *  Returns a `string` of `"cubic-bezier(...)"` for web & react-native-reanimated's Easing Function of type `EasingFunctionFactory` for native */
    attentive: 'cubic-bezier(0.7, 0, 0.5, 1)' | { factory: () => (value: number) => number };
    /** `cubic-bezier(0.17, 0, 1, 1)`
     *
     *  Returns a `string` of `"cubic-bezier(...)"` for web & react-native-reanimated's Easing Function of type `EasingFunctionFactory` for native */
    effective: 'cubic-bezier(0.17, 0, 1, 1)' | { factory: () => (value: number) => number };
    /** `cubic-bezier(0.5, 0, 1, 1)`
     *
     *  Returns a `string` of `"cubic-bezier(...)"` for web & react-native-reanimated's Easing Function of type `EasingFunctionFactory` for native */
    revealing: 'cubic-bezier(0.5, 0, 1, 1)' | { factory: () => (value: number) => number };
  };
};

export type Motion = Readonly<{
  delay: Delay;
  duration: Duration;
  easing: Easing;
}>;

const delay: Delay = {
  '2xshort': 70,
  xshort: 120,
  short: 180,
  long: 3000,
  xlong: 5000,
};

const duration: Duration = {
  quick1: 70,
  quick2: 150,
  quick3: 200,
  moderate1: 250,
  moderate2: 300,
  gentle1: 400,
  gentle2: 600,
  gentle3: 900,
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

const motion: Motion = {
  delay,
  duration,
  easing,
};

export default motion;
