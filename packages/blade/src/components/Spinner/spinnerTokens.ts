// import type { DotNotationMotionStringToken } from '~src/_helpers/types';
// import type { Motion } from '~tokens/global';

// export type SpinnerMotion = {
//   easing: `easing.${DotNotationMotionStringToken<Motion['easing']>}`;
//   duration: `duration.${keyof Motion['duration']}`;
// };

// const motion: SpinnerMotion = {
//   easing: 'easing.standard.attentive',
//   duration: `duration.2xgentle`,
// };

const dimensions = {
  small: 16,
  medium: 20,
  large: 24,
} as const;

export { dimensions };
