export type Breakpoints = Readonly<{
  base: number;
  /** max width: 320px  */
  xs: number;
  /** min width: 321px and max width: 480px */
  s: number;
  /** min width: 481px and max width: 768px */
  m: number;
  /** min width: 769 and max width: 1024px */
  l: number;
  /** min width: 1025 and max width: 1200px */
  xl: number;
}>;

const breakpoints: Breakpoints = {
  base: 0, // Used for base mobile styles
  xs: 320, // small mobile
  s: 480, // mobile
  m: 768, // tab, ipad - mini
  l: 1024, // desktop
  xl: 1200, // HD desktop
};

export default breakpoints;
