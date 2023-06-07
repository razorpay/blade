import { opacity } from './opacity';

type ColorChromaticScale = Readonly<{
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

type ColorNeutralScale = Readonly<{
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
}>;

type AshGrayColorNeutralScale = ColorNeutralScale &
  Readonly<{
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
    ashGrayLight: AshGrayColorNeutralScale;
    ashGrayDark: AshGrayColorNeutralScale;
  };
}>;

export const colors: Color = {
  chromatic: {
    azure: {
      50: `hsla(222, 100%, 96%, ${opacity[9]})`,
      100: `hsla(218, 93%, 88%, ${opacity[9]})`,
      200: `hsla(216, 92%, 81%, ${opacity[9]})`,
      300: `hsla(215, 91%, 74%, ${opacity[9]})`,
      400: `hsla(213, 91%, 66%, ${opacity[9]})`,
      500: `hsla(213, 89%, 56%, ${opacity[9]})`,
      600: `hsla(218, 89%, 51%, ${opacity[9]})`,
      700: `hsla(223, 95%, 48%, ${opacity[9]})`,
      800: `hsla(227, 100%, 45%, ${opacity[9]})`,
      900: `hsla(230, 100%, 42%, ${opacity[9]})`,
      950: `hsla(234, 100%, 34%, ${opacity[9]})`,
      a00: `hsla(218, 89%, 51%, ${opacity[0]})`,
      a50: `hsla(218, 89%, 51%, ${opacity[1]})`,
      a100: `hsla(218, 89%, 51%, ${opacity[2]})`,
      a200: `hsla(218, 89%, 51%, ${opacity[3]})`,
    },
    emerald: {
      50: `hsla(107, 100%, 96%, ${opacity[9]})`,
      100: `hsla(113, 69%, 83%, ${opacity[9]})`,
      200: `hsla(121, 65%, 71%, ${opacity[9]})`,
      300: `hsla(130, 62%, 60%, ${opacity[9]})`,
      400: `hsla(137, 60%, 50%, ${opacity[9]})`,
      500: `hsla(149, 99%, 35%, ${opacity[9]})`,
      600: `hsla(155, 100%, 31%, ${opacity[9]})`,
      700: `hsla(160, 100%, 26%, ${opacity[9]})`,
      800: `hsla(163, 100%, 22%, ${opacity[9]})`,
      900: `hsla(164, 100%, 17%, ${opacity[9]})`,
      950: `hsla(165, 100%, 13%, ${opacity[9]})`,
      a00: `hsla(155, 100%, 31%, ${opacity[0]})`,
      a50: `hsla(155, 100%, 31%, ${opacity[1]})`,
      a100: `hsla(155, 100%, 31%, ${opacity[2]})`,
      a200: `hsla(155, 100%, 31%, ${opacity[3]})`,
    },
    crimson: {
      50: `hsla(0, 100%, 97%, ${opacity[9]})`,
      100: `hsla(0, 100%, 92%, ${opacity[9]})`,
      200: `hsla(3, 100%, 86%, ${opacity[9]})`,
      300: `hsla(5, 100%, 80%, ${opacity[9]})`,
      400: `hsla(6, 100%, 75%, ${opacity[9]})`,
      500: `hsla(8, 99%, 65%, ${opacity[9]})`,
      600: `hsla(9, 91%, 56%, ${opacity[9]})`,
      700: `hsla(8, 73%, 47%, ${opacity[9]})`,
      800: `hsla(7, 72%, 40%, ${opacity[9]})`,
      900: `hsla(5, 69%, 32%, ${opacity[9]})`,
      950: `hsla(3, 66%, 24%, ${opacity[9]})`,
      a00: `hsla(9, 91%, 56%, ${opacity[0]})`,
      a50: `hsla(9, 91%, 56%, ${opacity[1]})`,
      a100: `hsla(9, 91%, 56%, ${opacity[2]})`,
      a200: `hsla(9, 91%, 56%, ${opacity[3]})`,
    },
    cider: {
      50: `hsla(32, 100%, 94%, ${opacity[9]})`,
      100: `hsla(32, 97%, 86%, ${opacity[9]})`,
      200: `hsla(33, 94%, 79%, ${opacity[9]})`,
      300: `hsla(33, 94%, 72%, ${opacity[9]})`,
      400: `hsla(34, 93%, 65%, ${opacity[9]})`,
      500: `hsla(35, 84%, 54%, ${opacity[9]})`,
      600: `hsla(36, 100%, 44%, ${opacity[9]})`,
      700: `hsla(38, 97%, 38%, ${opacity[9]})`,
      800: `hsla(40, 90%, 32%, ${opacity[9]})`,
      900: `hsla(41, 82%, 26%, ${opacity[9]})`,
      950: `hsla(42, 74%, 20%, ${opacity[9]})`,
      a00: `hsla(36, 100%, 44%, ${opacity[0]})`,
      a50: `hsla(36, 100%, 44%, ${opacity[1]})`,
      a100: `hsla(36, 100%, 44%, ${opacity[2]})`,
      a200: `hsla(36, 100%, 44%, ${opacity[3]})`,
    },
    orchid: {
      50: `hsla(258, 100%, 96%, ${opacity[9]})`,
      100: `hsla(263, 100%, 92%, ${opacity[9]})`,
      200: `hsla(264, 100%, 87%, ${opacity[9]})`,
      300: `hsla(267, 100%, 83%, ${opacity[9]})`,
      400: `hsla(268, 100%, 79%, ${opacity[9]})`,
      500: `hsla(269, 100%, 69%, ${opacity[9]})`,
      600: `hsla(271, 96%, 61%, ${opacity[9]})`,
      700: `hsla(276, 79%, 47%, ${opacity[9]})`,
      800: `hsla(280, 95%, 36%, ${opacity[9]})`,
      900: `hsla(283, 96%, 29%, ${opacity[9]})`,
      950: `hsla(286, 96%, 22%, ${opacity[9]})`,
      a00: `hsla(271, 96%, 61%, ${opacity[0]})`,
      a50: `hsla(271, 96%, 61%, ${opacity[1]})`,
      a100: `hsla(271, 96%, 61%, ${opacity[2]})`,
      a200: `hsla(271, 96%, 61%, ${opacity[3]})`,
    },
    magenta: {
      50: `hsla(309, 100%, 96%, ${opacity[9]})`,
      100: `hsla(307, 100%, 91%, ${opacity[9]})`,
      200: `hsla(303, 100%, 85%, ${opacity[9]})`,
      300: `hsla(301, 100%, 80%, ${opacity[9]})`,
      400: `hsla(300, 100%, 75%, ${opacity[9]})`,
      500: `hsla(303, 100%, 65%, ${opacity[9]})`,
      600: `hsla(308, 75%, 51%, ${opacity[9]})`,
      700: `hsla(313, 88%, 40%, ${opacity[9]})`,
      800: `hsla(317, 100%, 32%, ${opacity[9]})`,
      900: `hsla(321, 100%, 26%, ${opacity[9]})`,
      950: `hsla(324, 100%, 20%, ${opacity[9]})`,
      a00: `hsla(308, 75%, 51%, ${opacity[0]})`,
      a50: `hsla(308, 75%, 51%, ${opacity[1]})`,
      a100: `hsla(308, 75%, 51%, ${opacity[2]})`,
      a200: `hsla(308, 75%, 51%, ${opacity[3]})`,
    },
    sapphire: {
      50: `hsla(180, 100%, 97%, ${opacity[9]})`,
      100: `hsla(181, 75%, 85%, ${opacity[9]})`,
      200: `hsla(184, 72%, 73%, ${opacity[9]})`,
      300: `hsla(185, 70%, 62%, ${opacity[9]})`,
      400: `hsla(187, 68%, 52%, ${opacity[9]})`,
      500: `hsla(190, 100%, 39%, ${opacity[9]})`,
      600: `hsla(193, 100%, 35%, ${opacity[9]})`,
      700: `hsla(195, 100%, 31%, ${opacity[9]})`,
      800: `hsla(196, 100%, 27%, ${opacity[9]})`,
      900: `hsla(197, 100%, 23%, ${opacity[9]})`,
      950: `hsla(198, 100%, 20%, ${opacity[9]})`,
      a00: `hsla(193, 100%, 35%, ${opacity[0]})`,
      a50: `hsla(193, 100%, 35%, ${opacity[1]})`,
      a100: `hsla(193, 100%, 35%, ${opacity[2]})`,
      a200: `hsla(193, 100%, 35%, ${opacity[3]})`,
    },
  },
  neutral: {
    blueGrayLight: {
      0: `hsla(0, 0%, 100%, ${opacity[9]})`,
      50: `hsla(220, 27%, 98%, ${opacity[9]})`,
      100: `hsla(220, 30%, 96%, ${opacity[9]})`,
      200: `hsla(214, 21%, 94%, ${opacity[9]})`,
      300: `hsla(216, 19%, 89%, ${opacity[9]})`,
      400: `hsla(218, 19%, 81%, ${opacity[9]})`,
      500: `hsla(214, 18%, 69%, ${opacity[9]})`,
      600: `hsla(216, 16%, 60%, ${opacity[9]})`,
      700: `hsla(216, 15%, 54%, ${opacity[9]})`,
      800: `hsla(217, 18%, 45%, ${opacity[9]})`,
      900: `hsla(216, 27%, 36%, ${opacity[9]})`,
      1000: `hsla(216, 33%, 29%, ${opacity[9]})`,
      1100: `hsla(216, 44%, 23%, ${opacity[9]})`,
      1200: `hsla(217, 56%, 17%, ${opacity[9]})`,
      1300: `hsla(215, 70%, 13%, ${opacity[9]})`,
      a00: `hsla(216, 44%, 23%, ${opacity[0]})`,
      a50: `hsla(216, 15%, 54%, ${opacity[1]})`,
      a100: `hsla(216, 15%, 54%, ${opacity[2]})`,
      a200: `hsla(216, 15%, 54%, ${opacity[3]})`,
      a300: `hsla(214, 21%, 94%, ${opacity[1]})`,
      a400: `hsla(214, 21%, 94%, ${opacity[2]})`,
      a500: `hsla(214, 21%, 94%, ${opacity[3]})`,
    },
    blueGrayDark: {
      0: `hsla(0, 0%, 99%, ${opacity[9]})`,
      50: `hsla(215, 12%, 92%, ${opacity[9]})`,
      100: `hsla(218, 11%, 84%, ${opacity[9]})`,
      200: `hsla(218, 11%, 76%, ${opacity[9]})`,
      300: `hsla(219, 10%, 60%, ${opacity[9]})`,
      400: `hsla(219, 12%, 45%, ${opacity[9]})`,
      500: `hsla(220, 16%, 37%, ${opacity[9]})`,
      600: `hsla(220, 23%, 29%, ${opacity[9]})`,
      700: `hsla(220, 35%, 22%, ${opacity[9]})`,
      800: `hsla(219, 41%, 19%, ${opacity[9]})`,
      900: `hsla(218, 49%, 17%, ${opacity[9]})`,
      1000: `hsla(218, 52%, 16%, ${opacity[9]})`,
      1100: `hsla(218, 54%, 15%, ${opacity[9]})`,
      1200: `hsla(218, 59%, 13%, ${opacity[9]})`,
      1300: `hsla(218, 67%, 10%, ${opacity[9]})`,
      a00: `hsla(220, 11%, 84%, ${opacity[0]})`,
      a50: `hsla(220, 11%, 84%, ${opacity[1]})`,
      a100: `hsla(220, 11%, 84%, ${opacity[2]})`,
      a200: `hsla(220, 11%, 84%, ${opacity[3]})`,
      a300: `hsla(217, 11%, 76%, ${opacity[1]})`,
      a400: `hsla(217, 11%, 76%, ${opacity[2]})`,
      a500: `hsla(217, 11%, 76%, ${opacity[3]})`,
    },
    navyGrayLight: {
      0: `hsla(0, 0%, 100%, ${opacity[9]})`,
      50: `hsla(230, 27%, 98%, ${opacity[9]})`,
      100: `hsla(230, 30%, 96%, ${opacity[9]})`,
      200: `hsla(224, 21%, 94%, ${opacity[9]})`,
      300: `hsla(226, 19%, 89%, ${opacity[9]})`,
      400: `hsla(228, 19%, 81%, ${opacity[9]})`,
      500: `hsla(225, 18%, 69%, ${opacity[9]})`,
      600: `hsla(226, 16%, 60%, ${opacity[9]})`,
      700: `hsla(226, 15%, 54%, ${opacity[9]})`,
      800: `hsla(227, 18%, 45%, ${opacity[9]})`,
      900: `hsla(226, 27%, 36%, ${opacity[9]})`,
      1000: `hsla(226, 33%, 29%, ${opacity[9]})`,
      1100: `hsla(226, 44%, 23%, ${opacity[9]})`,
      1200: `hsla(228, 56%, 17%, ${opacity[9]})`,
      1300: `hsla(226, 70%, 13%, ${opacity[9]})`,
      a00: `hsla(226, 44%, 23%, ${opacity[0]})`,
      a50: `hsla(226, 15%, 54%, ${opacity[1]})`,
      a100: `hsla(226, 15%, 54%, ${opacity[2]})`,
      a200: `hsla(226, 15%, 54%, ${opacity[3]})`,
      a300: `hsla(223, 21%, 94%, ${opacity[1]})`,
      a400: `hsla(223, 21%, 94%, ${opacity[2]})`,
      a500: `hsla(223, 21%, 94%, ${opacity[3]})`,
    },
    navyGrayDark: {
      0: `hsla(0, 0%, 99%, ${opacity[9]})`,
      50: `hsla(228, 12%, 92%, ${opacity[9]})`,
      100: `hsla(233, 11%, 84%, ${opacity[9]})`,
      200: `hsla(231, 11%, 76%, ${opacity[9]})`,
      300: `hsla(229, 10%, 60%, ${opacity[9]})`,
      400: `hsla(229, 12%, 45%, ${opacity[9]})`,
      500: `hsla(230, 16%, 37%, ${opacity[9]})`,
      600: `hsla(230, 23%, 29%, ${opacity[9]})`,
      700: `hsla(231, 35%, 22%, ${opacity[9]})`,
      800: `hsla(231, 41%, 19%, ${opacity[9]})`,
      900: `hsla(230, 49%, 17%, ${opacity[9]})`,
      1000: `hsla(230, 52%, 16%, ${opacity[9]})`,
      1100: `hsla(231, 54%, 15%, ${opacity[9]})`,
      1200: `hsla(231, 59%, 13%, ${opacity[9]})`,
      1300: `hsla(231, 67%, 10%, ${opacity[9]})`,
      a00: `hsla(233, 11%, 84%, ${opacity[0]})`,
      a50: `hsla(233, 11%, 84%, ${opacity[1]})`,
      a100: `hsla(233, 11%, 84%, ${opacity[2]})`,
      a200: `hsla(233, 11%, 84%, ${opacity[3]})`,
      a300: `hsla(231, 11%, 76%, ${opacity[1]})`,
      a400: `hsla(231, 11%, 76%, ${opacity[2]})`,
      a500: `hsla(231, 11%, 76%, ${opacity[3]})`,
    },
    ashGrayLight: {
      0: `hsla(0, 0%, 100%, ${opacity[9]})`,
      50: `hsla(216, 9%, 98%, ${opacity[9]})`,
      100: `hsla(216, 9%, 96%, ${opacity[9]})`,
      200: `hsla(216, 6%, 94%, ${opacity[9]})`,
      300: `hsla(216, 4%, 89%, ${opacity[9]})`,
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
      a00: `hsla(214, 15%, 18%, ${opacity[0]})`,
      a50: `hsla(214, 15%, 18%, ${opacity[1]})`,
      a100: `hsla(214, 15%, 18%, ${opacity[2]})`,
      a200: `hsla(214, 15%, 18%, ${opacity[3]})`,
      a300: `hsla(210, 6%, 94%, ${opacity[1]})`,
      a400: `hsla(210, 6%, 94%, ${opacity[2]})`,
      a500: `hsla(210, 6%, 94%, ${opacity[3]})`,
      a1100: `hsla(214, 15%, 18%, ${opacity[4]})`,
    },
    ashGrayDark: {
      0: `hsla(0, 0%, 99%, ${opacity[9]})`,
      50: `hsla(240, 2%, 92%, ${opacity[9]})`,
      100: `hsla(240, 1%, 84%, ${opacity[9]})`,
      200: `hsla(228, 4%, 76%, ${opacity[9]})`,
      300: `hsla(227, 4%, 60%, ${opacity[9]})`,
      400: `hsla(229, 4%, 50%, ${opacity[9]})`,
      500: `hsla(232, 4%, 40%, ${opacity[9]})`,
      600: `hsla(232, 5%, 32%, ${opacity[9]})`,
      700: `hsla(230, 5%, 22%, ${opacity[9]})`,
      800: `hsla(230, 6%, 19%, ${opacity[9]})`,
      900: `hsla(230, 7%, 17%, ${opacity[9]})`,
      1000: `hsla(230, 8%, 15%, ${opacity[9]})`,
      1100: `hsla(231, 11%, 12%, ${opacity[9]})`,
      1200: `hsla(231, 17%, 8%, ${opacity[9]})`,
      1300: `hsla(228, 5%, 4%, ${opacity[9]})`,
      a00: `hsla(240, 1%, 84%, ${opacity[0]})`,
      a50: `hsla(240, 1%, 84%, ${opacity[1]})`,
      a100: `hsla(240, 1%, 84%, ${opacity[2]})`,
      a200: `hsla(240, 1%, 84%, ${opacity[3]})`,
      a300: `hsla(228, 4%, 76%, ${opacity[1]})`,
      a400: `hsla(228, 4%, 76%, ${opacity[2]})`,
      a500: `hsla(228, 4%, 76%, ${opacity[3]})`,
      a1100: `hsla(231, 11%, 12%, ${opacity[5]})`,
    },
  },
};
