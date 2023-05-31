type BorderRadius = Readonly<{
  /** none: 0(px/rem/pt) */
  none: 0;
  /** small: 2(px/rem/pt) */
  small: 2;
  /** medium: 4(px/rem/pt) */
  medium: 4;
  /** large: 8(px/rem/pt) */
  large: 8;
  /** xlarge: 12(px/rem/pt) */
  xlarge: 12;
  /** max: 9999(px/rem/pt). This will round the left and right side of the box element */
  max: 9999;
  /** round: 50%(pt). This will turn the box element into a circle */
  round: '50%';
}>;

type BorderWidth = Readonly<{
  /** none: 0(px/rem/pt) */
  none: 0;
  /** thin: 1(px/rem/pt) */
  thin: 1;
  /** thick: 1.5(px/rem/pt) */
  thick: 1.5;
}>;

export type Border = Readonly<{
  radius: BorderRadius;
  width: BorderWidth;
}>;

export const border: Border = {
  radius: {
    none: 0,
    small: 2,
    medium: 4,
    large: 8,
    xlarge: 12,
    max: 9999,
    round: '50%', // this needs to be in % but need to figure out how will we store unitless things
  },
  width: {
    none: 0,
    thin: 1,
    thick: 1.5,
  },
};
