import { opacity } from './opacity';

export type ColorChromaticScale = Readonly<{
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
  a00: string;
  a50: string;
  a100: string;
  a200: string;
}>;

export type ColorNeutralScale = Readonly<{
  0: string;
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  1000: string;
  1100: string;
  1200: string;
  1300: string;
  a00: string;
  a50: string;
  a100: string;
  a200: string;
  a300: string;
  a400: string;
  a500: string;
  a1100: string;
}>;

export type Color = Readonly<{
  chromatic: {
    azure: ColorChromaticScale;
    emerald: ColorChromaticScale;
    crimson: ColorChromaticScale;
    cider: ColorChromaticScale;
    orchid: ColorChromaticScale;
    magenta: ColorChromaticScale;
    sapphire: ColorChromaticScale;
  };
  neutral: {
    blueGrayLight: ColorNeutralScale;
    blueGrayDark: ColorNeutralScale;
    navyGrayLight: ColorNeutralScale;
    navyGrayDark: ColorNeutralScale;
    ashGrayLight: ColorNeutralScale;
    ashGrayDark: ColorNeutralScale;
  };
}>;

export const colors: Color = {
  chromatic: {
    azure: {
      50: `hsla(222, 100%, 98%, ${opacity[9]})`,
      100: `hsla(221, 90%, 92%, ${opacity[9]})`,
      200: `hsla(219, 95%, 85%, ${opacity[9]})`,
      300: `hsla(220, 100%, 73%, ${opacity[9]})`,
      400: `hsla(223, 100%, 65%, ${opacity[9]})`,
      500: `hsla(227, 100%, 59%, ${opacity[9]})`,
      600: `hsla(227, 71%, 51%, ${opacity[9]})`,
      700: `hsla(227, 69%, 42%, ${opacity[9]})`,
      800: `hsla(227, 69%, 34%, ${opacity[9]})`,
      900: `hsla(227, 69%, 25%, ${opacity[9]})`,
      1000: `hsla(227, 69%, 17%, ${opacity[9]})`,
      a50: `hsla(227, 100%, 59%, ${opacity[1]})`,
      a100: `hsla(227, 100%, 59%, ${opacity[2]})`,
      a200: `hsla(227, 100%, 59%, ${opacity[3]})`,
    },
    emerald: {
      50: `hsla(152, 60%, 95%, ${opacity[9]})`,
      100: `hsla(151, 57%, 91%, ${opacity[9]})`,
      200: `hsla(150, 59%, 82%, ${opacity[9]})`,
      300: `hsla(150, 59%, 73%, ${opacity[9]})`,
      400: `hsla(150, 59%, 55%, ${opacity[9]})`,
      500: `hsla(150, 100%, 37%, ${opacity[9]})`,
      600: `hsla(150, 100%, 32%, ${opacity[9]})`,
      700: `hsla(150, 100%, 27%, ${opacity[9]})`,
      800: `hsla(150, 100%, 21%, ${opacity[9]})`,
      900: `hsla(150, 100%, 16%, ${opacity[9]})`,
      1000: `hsla(150, 100%, 11%, ${opacity[9]})`,
      a50: `hsla(150, 100%, 32%, ${opacity[1]})`,
      a100: `hsla(150, 100%, 32%, ${opacity[2]})`,
      a200: `hsla(150, 100%, 32%, ${opacity[3]})`,
    },
    crimson: {
      50: `hsla(0, 100%, 98%, ${opacity[9]})`,
      100: `hsla(4, 93%, 94%, ${opacity[9]})`,
      200: `hsla(3, 97%, 88%, ${opacity[9]})`,
      300: `hsla(4, 96%, 79%, ${opacity[9]})`,
      400: `hsla(4, 93%, 68%, ${opacity[9]})`,
      500: `hsla(4, 86%, 58%, ${opacity[9]})`,
      600: `hsla(4, 74%, 49%, ${opacity[9]})`,
      700: `hsla(4, 77%, 40%, ${opacity[9]})`,
      800: `hsla(0, 83%, 33%, ${opacity[9]})`,
      900: `hsla(0, 84%, 29%, ${opacity[9]})`,
      1000: `hsla(0, 84%, 25%, ${opacity[9]})`,
      a50: `hsla(4, 74%, 49%, ${opacity[1]})`,
      a100: `hsla(4, 74%, 49%, ${opacity[2]})`,
      a200: `hsla(4, 74%, 49%, ${opacity[3]})`,
    },
    cider: {
      50: `hsla(24, 100%, 96%, ${opacity[9]})`,
      100: `hsla(25, 100%, 90%, ${opacity[9]})`,
      200: `hsla(25, 100%, 80%, ${opacity[9]})`,
      300: `hsla(25, 100%, 72%, ${opacity[9]})`,
      400: `hsla(25, 100%, 63%, ${opacity[9]})`,
      500: `hsla(25, 100%, 55%, ${opacity[9]})`,
      600: `hsla(25, 90%, 48%, ${opacity[9]})`,
      700: `hsla(25, 85%, 42%, ${opacity[9]})`,
      800: `hsla(25, 82%, 35%, ${opacity[9]})`,
      900: `hsla(25, 80%, 28%, ${opacity[9]})`,
      1000: `hsla(25, 82%, 20%, ${opacity[9]})`,
      a50: `hsla(25, 90%, 48%, ${opacity[1]})`,
      a100: `hsla(25, 90%, 48%, ${opacity[2]})`,
      a200: `hsla(25, 90%, 48%, ${opacity[3]})`,
    },
    sapphire: {
      50: `hsla(201, 92%, 95%, ${opacity[9]})`,
      100: `hsla(200, 88%, 90%, ${opacity[9]})`,
      200: `hsla(200, 89%, 82%, ${opacity[9]})`,
      300: `hsla(200, 90%, 72%, ${opacity[9]})`,
      400: `hsla(200, 90%, 65%, ${opacity[9]})`,
      500: `hsla(198, 90%, 52%, ${opacity[9]})`,
      600: `hsla(200, 84%, 44%, ${opacity[9]})`,
      700: `hsla(200, 84%, 37%, ${opacity[9]})`,
      800: `hsla(200, 84%, 29%, ${opacity[9]})`,
      900: `hsla(200, 84%, 22%, ${opacity[9]})`,
      1000: `hsla(199, 84%, 15%, ${opacity[9]})`,
      a50: `hsla(200, 84%, 44%, ${opacity[1]})`,
      a100: `hsla(200, 84%, 44%, ${opacity[2]})`,
      a200: `hsla(200, 84%, 44%, ${opacity[3]})`,
    },
    sea: {
      50: `hsla(180, 39%, 95%, ${opacity[9]})`,
      100: `hsla(180, 42%, 92%, ${opacity[9]})`,
      200: `hsla(180, 33%, 82%, ${opacity[9]})`,
      300: `hsla(180, 35%, 70%, ${opacity[9]})`,
      400: `hsla(180, 30%, 52%, ${opacity[9]})`,
      500: `hsla(180, 45%, 40%, ${opacity[9]})`,
      600: `hsla(180, 60%, 30%, ${opacity[9]})`,
      700: `hsla(180, 55%, 25%, ${opacity[9]})`,
      800: `hsla(180, 61%, 20%, ${opacity[9]})`,
      900: `hsla(180, 91%, 13%, ${opacity[9]})`,
      1000: `hsla(180, 91%, 8%, ${opacity[9]})`,
      a50: `hsla(180, 60%, 30%, ${opacity[1]})`,
      a100: `hsla(180, 60%, 30%, ${opacity[2]})`,
      a200: `hsla(180, 60%, 30%, ${opacity[3]})`,
    },
    cloud: {
      50: `hsla(198, 39%, 95%, ${opacity[9]})`,
      100: `hsla(201, 39%, 93%, ${opacity[9]})`,
      200: `hsla(200, 35%, 85%, ${opacity[9]})`,
      300: `hsla(200, 35%, 70%, ${opacity[9]})`,
      400: `hsla(200, 30%, 52%, ${opacity[9]})`,
      500: `hsla(200, 45%, 40%, ${opacity[9]})`,
      600: `hsla(200, 60%, 30%, ${opacity[9]})`,
      700: `hsla(201, 55%, 25%, ${opacity[9]})`,
      800: `hsla(200, 61%, 20%, ${opacity[9]})`,
      900: `hsla(200, 91%, 13%, ${opacity[9]})`,
      1000: `hsla(200, 91%, 8%, ${opacity[9]})`,
      a50: `hsla(200, 60%, 30%, ${opacity[1]})`,
      a100: `hsla(200, 60%, 30%, ${opacity[2]})`,
      a200: `hsla(200, 60%, 30%, ${opacity[3]})`,
    },
    forest: {
      50: `hsla(152, 60%, 95%, ${opacity[9]})`,
      100: `hsla(151, 57%, 91%, ${opacity[9]})`,
      200: `hsla(150, 59%, 82%, ${opacity[9]})`,
      300: `hsla(150, 59%, 73%, ${opacity[9]})`,
      400: `hsla(150, 59%, 55%, ${opacity[9]})`,
      500: `hsla(155, 100%, 37%, ${opacity[9]})`,
      600: `hsla(155, 100%, 31%, ${opacity[9]})`,
      700: `hsla(155, 100%, 27%, ${opacity[9]})`,
      800: `hsla(155, 100%, 21%, ${opacity[9]})`,
      900: `hsla(155, 100%, 16%, ${opacity[9]})`,
      1000: `hsla(155, 100%, 11%, ${opacity[9]})`,
      a50: `hsla(155, 100%, 31%, ${opacity[1]})`,
      a100: `hsla(155, 100%, 31%, ${opacity[2]})`,
      a200: `hsla(155, 100%, 31%, ${opacity[3]})`,
    },
  },
  neutral: {
    blueGrayLight: {
      0: `hsla(0, 0%, 100%, ${opacity[9]})`,
      50: `hsla(210, 40%, 98%, ${opacity[9]})`,
      100: `hsla(213, 47%, 96%, ${opacity[9]})`,
      200: `hsla(214, 40%, 92%, ${opacity[9]})`,
      300: `hsla(214, 28%, 84%, ${opacity[9]})`,
      400: `hsla(211, 27%, 76%, ${opacity[9]})`,
      500: `hsla(211, 24%, 65%, ${opacity[9]})`,
      600: `hsla(211, 22%, 56%, ${opacity[9]})`,
      700: `hsla(211, 20%, 52%, ${opacity[9]})`,
      800: `hsla(211, 23%, 45%, ${opacity[9]})`,
      900: `hsla(211, 26%, 34%, ${opacity[9]})`,
      1000: `hsla(211, 29%, 26%, ${opacity[9]})`,
      1100: `hsla(211, 33%, 21%, ${opacity[9]})`,
      1200: `hsla(212, 39%, 16%, ${opacity[9]})`,
      1300: `hsla(211, 53%, 10%, ${opacity[9]})`,
      a50: `hsla(211, 20%, 52%, ${opacity[1]})`,
      a75: `hsla(211, 20%, 52%, undefined)`,
      a100: `hsla(211, 20%, 52%, ${opacity[2]})`,
      a200: `hsla(211, 20%, 52%, ${opacity[3]})`,
      a400: `hsla(211, 20%, 52%, ${opacity[6]})`,
    },
    blueGrayDark: {
      0: `hsla(240, 20%, 99%, ${opacity[9]})`,
      50: `hsla(210, 40%, 98%, ${opacity[9]})`,
      100: `hsla(213, 47%, 96%, ${opacity[9]})`,
      200: `hsla(214, 40%, 92%, ${opacity[9]})`,
      300: `hsla(214, 28%, 84%, ${opacity[9]})`,
      400: `hsla(211, 27%, 76%, ${opacity[9]})`,
      500: `hsla(211, 24%, 65%, ${opacity[9]})`,
      600: `hsla(211, 22%, 56%, ${opacity[9]})`,
      700: `hsla(211, 20%, 52%, ${opacity[9]})`,
      800: `hsla(211, 23%, 45%, ${opacity[9]})`,
      900: `hsla(211, 26%, 34%, ${opacity[9]})`,
      1000: `hsla(211, 29%, 26%, ${opacity[9]})`,
      1100: `hsla(211, 33%, 21%, ${opacity[9]})`,
      1200: `hsla(212, 39%, 16%, ${opacity[9]})`,
      1300: `hsla(211, 53%, 10%, ${opacity[9]})`,
      a50: `hsla(214, 40%, 92%, ${opacity[1]})`,
      a75: `hsla(214, 40%, 92%, undefined)`,
      a100: `hsla(214, 40%, 92%, ${opacity[2]})`,
      a200: `hsla(214, 40%, 92%, ${opacity[3]})`,
      a400: `hsla(214, 40%, 92%, ${opacity[6]})`,
    },
    ashGrayLight: {
      0: `hsla(0, 0%, 100%, ${opacity[9]})`,
      50: `hsla(240, 9%, 98%, ${opacity[9]})`,
      100: `hsla(210, 9%, 96%, ${opacity[9]})`,
      200: `hsla(210, 6%, 94%, ${opacity[9]})`,
      300: `hsla(210, 4%, 89%, ${opacity[9]})`,
      400: `hsla(214, 7%, 81%, ${opacity[9]})`,
      500: `hsla(216, 6%, 69%, ${opacity[9]})`,
      600: `hsla(215, 6%, 60%, ${opacity[9]})`,
      700: `hsla(214, 6%, 55%, ${opacity[9]})`,
      800: `hsla(216, 7%, 45%, ${opacity[9]})`,
      900: `hsla(218, 9%, 36%, ${opacity[9]})`,
      1000: `hsla(219, 12%, 28%, ${opacity[9]})`,
      1100: `hsla(214, 15%, 18%, ${opacity[9]})`,
      1200: `hsla(216, 15%, 13%, ${opacity[9]})`,
      1300: `hsla(214, 24%, 6%, ${opacity[9]})`,
      a50: `hsla(214, 6%, 55%, ${opacity[1]})`,
      a100: `hsla(214, 6%, 55%, ${opacity[2]})`,
      a200: `hsla(214, 6%, 55%, ${opacity[3]})`,
    },
    ashGrayDark: {
      0: `hsla(0, 0%, 99%, ${opacity[9]})`,
      50: `hsla(240, 2%, 92%, ${opacity[9]})`,
      100: `hsla(240, 1%, 84%, ${opacity[9]})`,
      200: `hsla(228, 4%, 76%, ${opacity[9]})`,
      300: `hsla(227, 4%, 60%, ${opacity[9]})`,
      400: `hsla(229, 4%, 50%, ${opacity[9]})`,
      500: `hsla(233, 4%, 40%, ${opacity[9]})`,
      600: `hsla(233, 5%, 32%, ${opacity[9]})`,
      700: `hsla(230, 6%, 22%, ${opacity[9]})`,
      800: `hsla(230, 6%, 19%, ${opacity[9]})`,
      900: `hsla(230, 7%, 17%, ${opacity[9]})`,
      1000: `hsla(230, 8%, 15%, ${opacity[9]})`,
      1100: `hsla(231, 12%, 12%, ${opacity[9]})`,
      1200: `hsla(231, 17%, 8%, ${opacity[9]})`,
      1300: `hsla(240, 5%, 4%, ${opacity[9]})`,
      a50: `hsla(228, 4%, 76%, ${opacity[1]})`,
      a100: `hsla(228, 4%, 76%, ${opacity[2]})`,
      a200: `hsla(228, 4%, 76%, ${opacity[3]})`,
    },
    white: {
      10: `hsla(0, 0%, 100%, ${opacity[1]})`,
      25: `hsla(0, 0%, 100%, undefined)`,
      50: `hsla(0, 0%, 100%, ${opacity[2]})`,
      100: `hsla(0, 0%, 100%, ${opacity[3]})`,
      200: `hsla(0, 0%, 100%, ${opacity[4]})`,
      300: `hsla(0, 0%, 100%, ${opacity[6]})`,
      400: `hsla(0, 0%, 100%, undefined)`,
      500: `hsla(0, 0%, 100%, ${opacity[9]})`,
    },
    black: {
      10: `hsla(0, 0%, 0%, ${opacity[1]})`,
      25: `hsla(0, 0%, 0%, undefined)`,
      50: `hsla(0, 0%, 0%, ${opacity[2]})`,
      100: `hsla(0, 0%, 0%, ${opacity[3]})`,
      200: `hsla(0, 0%, 0%, ${opacity[5]})`,
      300: `hsla(0, 0%, 0%, ${opacity[7]})`,
      400: `hsla(0, 0%, 0%, undefined)`,
      500: `hsla(0, 0%, 0%, ${opacity[9]})`,
    },
  },
};
