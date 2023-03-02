import type { Breakpoints } from '~tokens/global';

type MakeValueResponsive<T> =
  | T
  | {
      // Using this instead of Record to maintain the jsdoc from breakpoints.ts
      [P in keyof Breakpoints]?: T;
    };
type MakeObjectResponsive<T> = { [P in keyof T]: MakeValueResponsive<T[P]> };

export { MakeObjectResponsive, MakeValueResponsive };
