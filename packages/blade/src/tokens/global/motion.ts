import makeBezier from '../../utils/makeBezier';

export type Motion = Readonly<{
  delay: {
    /** `70` milliseconds */
    '2xshort': number;
    /** `120` milliseconds */
    xshort: number;
    /** `180` milliseconds */
    short: number;
    /** `3000` milliseconds */
    long: number;
    /** `5000` milliseconds */
    xlong: number;
  };
  duration: {
    /** `70` milliseconds */
    quick1: number;
    /** `150` milliseconds */
    quick2: number;
    /** `200` milliseconds */
    quick3: number;
    /** `250` milliseconds */
    moderate1: number;
    /** `300` milliseconds */
    moderate2: number;
    /** `400` milliseconds */
    gentle1: number;
    /** `600` milliseconds */
    gentle2: number;
    /** `900` milliseconds */
    gentle3: number;
  };
  easing: {
    /** Easings for all standard animations*/
    standard: {
      /** `cubic-bezier(0.5, 0, 0.3, 1.5)`
       *
       *  Returns a `string` for web & react-native-reanimated's Easing Function of type `EasingFunctionFactory` for native */
      attentive: string;
      /** `cubic-bezier(0.3, 0, 0.2, 1)`
       *
       *  Returns a `string` for web & react-native-reanimated's Easing Function of type `EasingFunctionFactory` for native */
      effective: string;
      /** `cubic-bezier(0.5, 0, 0, 1)`
       *
       *  Returns a `string` for web & react-native-reanimated's Easing Function of type `EasingFunctionFactory` for native */
      revealing: string;
      /** `cubic-bezier(1, 0.5, 0, 0.5)`
       *
       *  Returns a `string` for web & react-native-reanimated's Easing Function of type `EasingFunctionFactory` for native */
      wary: string;
    };
    /** Easings for all entrance animations*/
    entrance: {
      /** `cubic-bezier(0.5, 0, 0.3, 1.5)`
       *
       *  Returns a `string` for web & react-native-reanimated's Easing Function of type `EasingFunctionFactory` for native */
      attentive: string;
      /** `cubic-bezier(0, 0, 0.2, 1)`
       *
       *  Returns a `string` for web & react-native-reanimated's Easing Function of type `EasingFunctionFactory` for native */
      effective: string;
      /** `cubic-bezier(0, 0, 0, 1)`
       *
       *  Returns a `string` for web & react-native-reanimated's Easing Function of type `EasingFunctionFactory` for native */
      revealing: string;
    };
    /** Easings for all exit animations*/
    exit: {
      /** `cubic-bezier(0.7, 0, 0.5, 1)`
       *
       *  Returns a `string` for web & react-native-reanimated's Easing Function of type `EasingFunctionFactory` for native */
      attentive: string;
      /** `cubic-bezier(0.17, 0, 1, 1)`
       *
       *  Returns a `string` for web & react-native-reanimated's Easing Function of type `EasingFunctionFactory` for native */
      effective: string;
      /** `cubic-bezier(0.5, 0, 1, 1)`
       *
       *  Returns a `string` for web & react-native-reanimated's Easing Function of type `EasingFunctionFactory` for native */
      revealing: string;
    };
  };
}>;

const delay = {
  '2xshort': 70,
  xshort: 120,
  short: 180,
  long: 3000,
  xlong: 5000,
};

const duration = {
  quick1: 70,
  quick2: 150,
  quick3: 200,
  moderate1: 250,
  moderate2: 300,
  gentle1: 400,
  gentle2: 600,
  gentle3: 900,
};

/* makeBezier returns a react-native-reanimated Easing Function of type `EasingFunctionFactory` */
const easing = {
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
