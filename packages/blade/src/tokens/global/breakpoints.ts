export type Breakpoints = Readonly<{
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
  /** min width: 1201px  */
  max: number;
}>;

const breakpoints: Breakpoints = {
  xs: 320,
  s: 480,
  m: 768,
  l: 1024,
  xl: 1200,
  max: 1201,
};

// const breakpointsForStyledSystem = {
//   xs: '320px',
//   s: '480px',
//   m: '768px',
//   l: '1024px',
//   xl: '1200px',
//   // max: '1201px',
// };

export default breakpoints;
