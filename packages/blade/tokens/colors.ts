import opacities from './opacities';

type colorChromaticScale = Readonly<{
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
  a50: string;
  a100: string;
  a200: string;
}>;

type colorNeutralScale = Readonly<{
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
}>;

type color = Readonly<{
  chromatic: {
    azure: colorChromaticScale;
    emerald: colorChromaticScale;
    crimson: colorChromaticScale;
    cider: colorChromaticScale;
    orchid: colorChromaticScale;
    magenta: colorChromaticScale;
    sapphire: colorChromaticScale;
  };
  neutral: {
    blueGray: colorNeutralScale;
    warmGray: colorNeutralScale;
    navyGray: colorNeutralScale;
    coolGray: colorNeutralScale;
  };
}>;

const colors: color = {
  chromatic: {
    azure: {
      50: `hsla(222, 100%, 96%, ${opacities[9]})`,
      100: `hsla(218, 93%, 88%, ${opacities[9]})`,
      200: `hsla(216, 92%, 81%, ${opacities[9]})`,
      300: `hsla(215, 91%, 74%, ${opacities[9]})`,
      400: `hsla(213, 91%, 66%, ${opacities[9]})`,
      500: `hsla(213, 89%, 56%, ${opacities[9]})`,
      600: `hsla(218, 89%, 51%, ${opacities[9]})`,
      700: `hsla(223, 95%, 48%, ${opacities[9]})`,
      800: `hsla(227, 100%, 45%, ${opacities[9]})`,
      900: `hsla(230, 100%, 42%, ${opacities[9]})`,
      950: `hsla(234, 100%, 34%, ${opacities[9]})`,
      a50: `hsla(218, 89%, 51%, ${opacities[1]})`,
      a100: `hsla(218, 89%, 51%, ${opacities[2]})`,
      a200: `hsla(218, 89%, 51%, ${opacities[3]})`,
    },
    emerald: {
      50: `hsla(107, 100%, 96%, ${opacities[9]})`,
      100: `hsla(113, 69%, 83%, ${opacities[9]})`,
      200: `hsla(121, 65%, 71%, ${opacities[9]})`,
      300: `hsla(130, 62%, 60%, ${opacities[9]})`,
      400: `hsla(137, 60%, 50%, ${opacities[9]})`,
      500: `hsla(149, 99%, 35%, ${opacities[9]})`,
      600: `hsla(155, 100%, 31%, ${opacities[9]})`,
      700: `hsla(160, 100%, 26%, ${opacities[9]})`,
      800: `hsla(163, 100%, 22%, ${opacities[9]})`,
      900: `hsla(164, 100%, 17%, ${opacities[9]})`,
      950: `hsla(165, 100%, 13%, ${opacities[9]})`,
      a50: `hsla(155, 100%, 31%, ${opacities[1]})`,
      a100: `hsla(155, 100%, 31%, ${opacities[2]})`,
      a200: `hsla(155, 100%, 31%, ${opacities[3]})`,
    },
    crimson: {
      50: `hsla(0, 100%, 97%, ${opacities[9]})`,
      100: `hsla(0, 100%, 92%, ${opacities[9]})`,
      200: `hsla(3, 100%, 86%, ${opacities[9]})`,
      300: `hsla(5, 100%, 80%, ${opacities[9]})`,
      400: `hsla(6, 100%, 75%, ${opacities[9]})`,
      500: `hsla(8, 99%, 65%, ${opacities[9]})`,
      600: `hsla(9, 91%, 56%, ${opacities[9]})`,
      700: `hsla(8, 73%, 47%, ${opacities[9]})`,
      800: `hsla(7, 72%, 40%, ${opacities[9]})`,
      900: `hsla(5, 69%, 32%, ${opacities[9]})`,
      950: `hsla(3, 66%, 24%, ${opacities[9]})`,
      a50: `hsla(9, 91%, 56%, ${opacities[1]})`,
      a100: `hsla(9, 91%, 56%, ${opacities[2]})`,
      a200: `hsla(9, 91%, 56%, ${opacities[3]})`,
    },
    cider: {
      50: `hsla(32, 100%, 94%, ${opacities[9]})`,
      100: `hsla(32, 97%, 86%, ${opacities[9]})`,
      200: `hsla(33, 94%, 79%, ${opacities[9]})`,
      300: `hsla(33, 94%, 72%, ${opacities[9]})`,
      400: `hsla(34, 93%, 65%, ${opacities[9]})`,
      500: `hsla(35, 84%, 54%, ${opacities[9]})`,
      600: `hsla(36, 100%, 44%, ${opacities[9]})`,
      700: `hsla(38, 97%, 38%, ${opacities[9]})`,
      800: `hsla(40, 90%, 32%, ${opacities[9]})`,
      900: `hsla(41, 82%, 26%, ${opacities[9]})`,
      950: `hsla(42, 74%, 20%, ${opacities[9]})`,
      a50: `hsla(36, 100%, 44%, ${opacities[1]})`,
      a100: `hsla(36, 100%, 44%, ${opacities[2]})`,
      a200: `hsla(36, 100%, 44%, ${opacities[3]})`,
    },
    orchid: {
      50: `hsla(258, 100%, 96%, ${opacities[9]})`,
      100: `hsla(263, 100%, 92%, ${opacities[9]})`,
      200: `hsla(264, 100%, 87%, ${opacities[9]})`,
      300: `hsla(267, 100%, 83%, ${opacities[9]})`,
      400: `hsla(268, 100%, 79%, ${opacities[9]})`,
      500: `hsla(269, 100%, 69%, ${opacities[9]})`,
      600: `hsla(271, 96%, 61%, ${opacities[9]})`,
      700: `hsla(276, 79%, 47%, ${opacities[9]})`,
      800: `hsla(280, 95%, 36%, ${opacities[9]})`,
      900: `hsla(283, 96%, 29%, ${opacities[9]})`,
      950: `hsla(286, 96%, 22%, ${opacities[9]})`,
      a50: `hsla(271, 96%, 61%, ${opacities[1]})`,
      a100: `hsla(271, 96%, 61%, ${opacities[2]})`,
      a200: `hsla(271, 96%, 61%, ${opacities[3]})`,
    },
    magenta: {
      50: `hsla(309, 100%, 96%, ${opacities[9]})`,
      100: `hsla(307, 100%, 91%, ${opacities[9]})`,
      200: `hsla(303, 100%, 85%, ${opacities[9]})`,
      300: `hsla(301, 100%, 80%, ${opacities[9]})`,
      400: `hsla(300, 100%, 75%, ${opacities[9]})`,
      500: `hsla(303, 100%, 65%, ${opacities[9]})`,
      600: `hsla(308, 75%, 51%, ${opacities[9]})`,
      700: `hsla(313, 88%, 40%, ${opacities[9]})`,
      800: `hsla(317, 100%, 32%, ${opacities[9]})`,
      900: `hsla(321, 100%, 26%, ${opacities[9]})`,
      950: `hsla(324, 100%, 20%, ${opacities[9]})`,
      a50: `hsla(308, 75%, 51%, ${opacities[1]})`,
      a100: `hsla(308, 75%, 51%, ${opacities[2]})`,
      a200: `hsla(308, 75%, 51%, ${opacities[3]})`,
    },
    sapphire: {
      50: `hsla(180, 100%, 97%, ${opacities[9]})`,
      100: `hsla(181, 75%, 85%, ${opacities[9]})`,
      200: `hsla(184, 72%, 73%, ${opacities[9]})`,
      300: `hsla(185, 70%, 62%, ${opacities[9]})`,
      400: `hsla(187, 68%, 52%, ${opacities[9]})`,
      500: `hsla(190, 100%, 39%, ${opacities[9]})`,
      600: `hsla(193, 100%, 35%, ${opacities[9]})`,
      700: `hsla(195, 100%, 31%, ${opacities[9]})`,
      800: `hsla(196, 100%, 27%, ${opacities[9]})`,
      900: `hsla(197, 100%, 23%, ${opacities[9]})`,
      950: `hsla(198, 100%, 20%, ${opacities[9]})`,
      a50: `hsla(193, 100%, 35%, ${opacities[1]})`,
      a100: `hsla(193, 100%, 35%, ${opacities[2]})`,
      a200: `hsla(193, 100%, 35%, ${opacities[3]})`,
    },
  },
  neutral: {
    blueGray: {
      0: `hsla(0, 0%, 100%, ${opacities[9]})`,
      50: `hsla(220, 27%, 98%, ${opacities[9]})`,
      100: `hsla(220, 30%, 96%, ${opacities[9]})`,
      200: `hsla(214, 21%, 94%, ${opacities[9]})`,
      300: `hsla(216, 19%, 89%, ${opacities[9]})`,
      400: `hsla(218, 19%, 81%, ${opacities[9]})`,
      500: `hsla(214, 18%, 69%, ${opacities[9]})`,
      600: `hsla(216, 16%, 60%, ${opacities[9]})`,
      700: `hsla(216, 15%, 54%, ${opacities[9]})`,
      800: `hsla(217, 18%, 45%, ${opacities[9]})`,
      900: `hsla(216, 27%, 36%, ${opacities[9]})`,
      1000: `hsla(216, 33%, 29%, ${opacities[9]})`,
      1100: `hsla(216, 44%, 23%, ${opacities[9]})`,
      1200: `hsla(217, 56%, 17%, ${opacities[9]})`,
      1300: `hsla(215, 70%, 13%, ${opacities[9]})`,
    },
    warmGray: {
      0: `hsla(0, 0%, 100%, ${opacities[9]})`,
      50: `hsla(216, 9%, 98%, ${opacities[9]})`,
      100: `hsla(216, 9%, 96%, ${opacities[9]})`,
      200: `hsla(216, 6%, 94%, ${opacities[9]})`,
      300: `hsla(216, 4%, 89%, ${opacities[9]})`,
      400: `hsla(214, 7%, 81%, ${opacities[9]})`,
      500: `hsla(216, 6%, 69%, ${opacities[9]})`,
      600: `hsla(215, 6%, 60%, ${opacities[9]})`,
      700: `hsla(214, 6%, 55%, ${opacities[9]})`,
      800: `hsla(216, 7%, 45%, ${opacities[9]})`,
      900: `hsla(218, 9%, 36%, ${opacities[9]})`,
      1000: `hsla(219, 12%, 28%, ${opacities[9]})`,
      1100: `hsla(214, 15%, 18%, ${opacities[9]})`,
      1200: `hsla(216, 15, 13%, ${opacities[9]})`,
      1300: `hsla(214, 24%, 6%, ${opacities[9]})`,
    },
    navyGray: {
      0: `hsla(231, 67%, 10%, ${opacities[9]})`,
      50: `hsla(231, 59%, 13%, ${opacities[9]})`,
      100: `hsla(231, 54%, 15%, ${opacities[9]})`,
      200: `hsla(230, 52%, 16%, ${opacities[9]})`,
      300: `hsla(230, 49%, 17%, ${opacities[9]})`,
      400: `hsla(231, 41%, 19%, ${opacities[9]})`,
      500: `hsla(231, 35%, 22%, ${opacities[9]})`,
      600: `hsla(230, 23%, 29%, ${opacities[9]})`,
      700: `hsla(230, 16%, 37%, ${opacities[9]})`,
      800: `hsla(229, 12%, 45%, ${opacities[9]})`,
      900: `hsla(229, 10%, 60%, ${opacities[9]})`,
      1000: `hsla(231, 11%, 76%, ${opacities[9]})`,
      1100: `hsla(233, 11%, 84%, ${opacities[9]})`,
      1200: `hsla(228, 12%, 92%, ${opacities[9]})`,
      1300: `hsla(0, 0, 99%, ${opacities[9]})`,
    },
    coolGray: {
      0: `hsla(228, 5%, 4%, ${opacities[9]})`,
      50: `hsla(231, 17%, 8%, ${opacities[9]})`,
      100: `hsla(231, 11%, 12%, ${opacities[9]})`,
      200: `hsla(230, 8%, 15%, ${opacities[9]})`,
      300: `hsla(230, 7%, 17%, ${opacities[9]})`,
      400: `hsla(230, 6%, 19%, ${opacities[9]})`,
      500: `hsla(230, 5%, 22%, ${opacities[9]})`,
      600: `hsla(232, 5%, 32%, ${opacities[9]})`,
      700: `hsla(232, 4%, 40%, ${opacities[9]})`,
      800: `hsla(229, 4%, 50%, ${opacities[9]})`,
      900: `hsla(227, 4%, 60%, ${opacities[9]})`,
      1000: `hsla(228, 4%, 76%, ${opacities[9]})`,
      1100: `hsla(240, 1%, 84%, ${opacities[9]})`,
      1200: `hsla(240, 2%, 92%, ${opacities[9]})`,
      1300: `hsla(0, 0%, 99%, ${opacities[9]})`,
    },
  },
};

export default colors;
