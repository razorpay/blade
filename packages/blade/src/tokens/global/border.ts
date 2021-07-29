type BorderRadius = Readonly<{
  /** none: 0(px/rem/pt) */
  none: number;
  /** small: 2(px/rem/pt) */
  small: number;
  /** medium: 4(px/rem/pt) */
  medium: number;
  /** large: 8(px/rem/pt) */
  large: number;
  /** max: 9999(px/rem/pt). This will round the left and right side of your box */
  max: number;
  /** round: 9999(px/rem/pt). This will your box element as circle */
  round: string;
}>;

type BorderWidth = Readonly<{
  /** none: 0(px/rem/pt) */
  none: number;
  /** thin: 1(px/rem/pt) */
  thin: number;
}>;

export type Border = Readonly<{
  radius: BorderRadius;
  width: BorderWidth;
}>;

const border: Border = {
  radius: {
    none: 0,
    small: 2,
    medium: 4,
    large: 8,
    max: 9999,
    round: '50%', // this needs to be in % but need to figure out how will we store unitless things
  },
  width: {
    none: 0,
    thin: 1,
  },
};

export default border;
