export type Breakpoints = Readonly<{
  /** minimum width: 320px  */
  xs: number;
  /** minimum width: 480px  */
  s: number;
  /** minimum width: 768px  */
  m: number;
  /** minimum width: 1024px  */
  l: number;
  /** minimum width: 1200px  */
  xl: number;
}>;

const breakpoints: Breakpoints = {
  xs: 320,
  s: 480,
  m: 768,
  l: 1024,
  xl: 1200,
};

export default breakpoints;
