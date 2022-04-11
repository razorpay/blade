import makeBezier from '../../utils/makeBezier';

export type Motion = Readonly<{
  delay: {
    /** `70` milliseconds */
    delay1: number;
    /** `120` milliseconds */
    delay2: number;
    /** `180` milliseconds */
    delay3: number;
    /** `3000` milliseconds */
    delay4: number;
    /** `5000` milliseconds */
    delay5: number;
  };
  duration: {
    /** `70` milliseconds */
    duration1: number;
    /** `150` milliseconds */
    duration2: number;
    /** `200` milliseconds */
    duration3: number;
    /** `250` milliseconds */
    duration4: number;
    /** `300` milliseconds */
    duration5: number;
    /** `400` milliseconds */
    duration6: number;
    /** `600` milliseconds */
    duration7: number;
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
  delay1: 70,
  delay2: 120,
  delay3: 180,
  delay4: 3000,
  delay5: 5000,
};

const duration = {
  duration1: 70,
  duration2: 150,
  duration3: 200,
  duration4: 250,
  duration5: 300,
  duration6: 400,
  duration7: 600,
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
