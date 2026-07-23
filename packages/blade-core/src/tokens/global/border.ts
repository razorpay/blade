type BorderRadius = Readonly<{
  /** none: 0(px/rem/pt) */
  none: 0;
  /** 2xsmall: 2(px/rem/pt) */
  '2xsmall': 2;
  /** xsmall: 4(px/rem/pt) */
  xsmall: 4;
  /** small: 8(px/rem/pt) */
  small: 8;
  /** medium: 12(px/rem/pt) */
  medium: 12;
  /** large: 16(px/rem/pt) */
  large: 16;
  /** xlarge: 20(px/rem/pt) */
  xlarge: 20;
  /** 2xlarge: 24(px/rem/pt) */
  '2xlarge': 24;
  /** max: 9999(px/rem/pt). This will round the left and right side of the box element */
  max: 9999;
  /** round: 50%(pt). This will turn the box element into a circle */
  round: '50%';
}>;

type BorderWidth = Readonly<{
  /** none: 0(px/rem/pt) */
  none: 0;
  /** thinner: 0.5(px/rem/pt) */
  thinner: 0.5;
  /** thin: 1(px/rem/pt) */
  thin: 1;
  /** thick: 1.5(px/rem/pt) */
  thick: 1.5;
  /** thicker: 2(px/rem/pt) */
  thicker: 2;
}>;

export type Border = Readonly<{
  radius: BorderRadius;
  width: BorderWidth;
}>;

export const border: Border = {
  radius: {
    none: 0,
    '2xsmall': 2,
    xsmall: 4,
    small: 8,
    medium: 12,
    large: 16,
    xlarge: 20,
    '2xlarge': 24,
    max: 9999,
    round: '50%', // this needs to be in % but need to figure out how will we store unitless things
  },
  width: {
    none: 0,
    thinner: 0.5,
    thin: 1,
    thick: 1.5,
    thicker: 2,
  },
};
