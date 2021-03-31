type BorderRadius = Readonly<{
  none: number;
  small: number;
  medium: number;
  large: number;
  max: number;
  round: string;
}>;

type BorderWidth = Readonly<{
  none: number;
  thin: number;
}>;

type Border = Readonly<{
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
