// Generated from uno/config.ts by scripts/build-uno-config.mjs: do not edit.

// uno/config.ts
import { defineConfig, symbols as symbols2 } from "unocss";
import {
  backdropBlur,
  bladeNeutralTheme,
  bladeTheme,
  border,
  elevation,
  motion,
  typography
} from "@razorpay/blade-core/tokens";
import { colorsToCSSVariables } from "@razorpay/blade-core/utils";

// uno/tailwind/defaults.ts
var defaultTheme = {
  accentColor: ({ theme }) => ({
    ...theme("colors"),
    auto: "auto"
  }),
  animation: {
    none: "none",
    spin: "spin 1s linear infinite",
    ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
    pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    bounce: "bounce 1s infinite"
  },
  aspectRatio: {
    auto: "auto",
    square: "1 / 1",
    video: "16 / 9"
  },
  backdropBlur: ({ theme }) => theme("blur"),
  backdropBrightness: ({ theme }) => theme("brightness"),
  backdropContrast: ({ theme }) => theme("contrast"),
  backdropGrayscale: ({ theme }) => theme("grayscale"),
  backdropHueRotate: ({ theme }) => theme("hueRotate"),
  backdropInvert: ({ theme }) => theme("invert"),
  backdropOpacity: ({ theme }) => theme("opacity"),
  backdropSaturate: ({ theme }) => theme("saturate"),
  backdropSepia: ({ theme }) => theme("sepia"),
  backgroundColor: ({ theme }) => theme("colors"),
  backgroundImage: {
    none: "none",
    "gradient-to-t": "linear-gradient(to top, var(--tw-gradient-stops))",
    "gradient-to-tr": "linear-gradient(to top right, var(--tw-gradient-stops))",
    "gradient-to-r": "linear-gradient(to right, var(--tw-gradient-stops))",
    "gradient-to-br": "linear-gradient(to bottom right, var(--tw-gradient-stops))",
    "gradient-to-b": "linear-gradient(to bottom, var(--tw-gradient-stops))",
    "gradient-to-bl": "linear-gradient(to bottom left, var(--tw-gradient-stops))",
    "gradient-to-l": "linear-gradient(to left, var(--tw-gradient-stops))",
    "gradient-to-tl": "linear-gradient(to top left, var(--tw-gradient-stops))"
  },
  backgroundOpacity: ({ theme }) => theme("opacity"),
  backgroundPosition: {
    bottom: "bottom",
    center: "center",
    left: "left",
    "left-bottom": "left bottom",
    "left-top": "left top",
    right: "right",
    "right-bottom": "right bottom",
    "right-top": "right top",
    top: "top"
  },
  backgroundSize: {
    auto: "auto",
    cover: "cover",
    contain: "contain"
  },
  blur: {
    0: "0",
    none: "0",
    sm: "4px",
    DEFAULT: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    "2xl": "40px",
    "3xl": "64px"
  },
  borderColor: ({ theme }) => ({
    ...theme("colors"),
    DEFAULT: theme("colors.gray.200", "currentColor")
  }),
  borderOpacity: ({ theme }) => theme("opacity"),
  borderRadius: {
    none: "0px",
    sm: "0.125rem",
    DEFAULT: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px"
  },
  borderSpacing: ({ theme }) => ({
    ...theme("spacing")
  }),
  borderWidth: {
    DEFAULT: "1px",
    0: "0px",
    2: "2px",
    4: "4px",
    8: "8px"
  },
  boxShadow: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
    none: "none"
  },
  boxShadowColor: ({ theme }) => theme("colors"),
  brightness: {
    0: "0",
    50: ".5",
    75: ".75",
    90: ".9",
    95: ".95",
    100: "1",
    105: "1.05",
    110: "1.1",
    125: "1.25",
    150: "1.5",
    200: "2"
  },
  caretColor: ({ theme }) => theme("colors"),
  colors: {},
  columns: {
    auto: "auto",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    10: "10",
    11: "11",
    12: "12",
    "3xs": "16rem",
    "2xs": "18rem",
    xs: "20rem",
    sm: "24rem",
    md: "28rem",
    lg: "32rem",
    xl: "36rem",
    "2xl": "42rem",
    "3xl": "48rem",
    "4xl": "56rem",
    "5xl": "64rem",
    "6xl": "72rem",
    "7xl": "80rem"
  },
  content: {
    none: "none"
  },
  contrast: {
    0: "0",
    50: ".5",
    75: ".75",
    100: "1",
    125: "1.25",
    150: "1.5",
    200: "2"
  },
  cursor: {
    auto: "auto",
    default: "default",
    pointer: "pointer",
    wait: "wait",
    text: "text",
    move: "move",
    help: "help",
    "not-allowed": "not-allowed",
    none: "none",
    "context-menu": "context-menu",
    progress: "progress",
    cell: "cell",
    crosshair: "crosshair",
    "vertical-text": "vertical-text",
    alias: "alias",
    copy: "copy",
    "no-drop": "no-drop",
    grab: "grab",
    grabbing: "grabbing",
    "all-scroll": "all-scroll",
    "col-resize": "col-resize",
    "row-resize": "row-resize",
    "n-resize": "n-resize",
    "e-resize": "e-resize",
    "s-resize": "s-resize",
    "w-resize": "w-resize",
    "ne-resize": "ne-resize",
    "nw-resize": "nw-resize",
    "se-resize": "se-resize",
    "sw-resize": "sw-resize",
    "ew-resize": "ew-resize",
    "ns-resize": "ns-resize",
    "nesw-resize": "nesw-resize",
    "nwse-resize": "nwse-resize",
    "zoom-in": "zoom-in",
    "zoom-out": "zoom-out"
  },
  divideColor: ({ theme }) => theme("borderColor"),
  divideOpacity: ({ theme }) => theme("borderOpacity"),
  divideWidth: ({ theme }) => theme("borderWidth"),
  dropShadow: {
    sm: "0 1px 1px rgb(0 0 0 / 0.05)",
    DEFAULT: ["0 1px 2px rgb(0 0 0 / 0.1)", "0 1px 1px rgb(0 0 0 / 0.06)"],
    md: ["0 4px 3px rgb(0 0 0 / 0.07)", "0 2px 2px rgb(0 0 0 / 0.06)"],
    lg: ["0 10px 8px rgb(0 0 0 / 0.04)", "0 4px 3px rgb(0 0 0 / 0.1)"],
    xl: ["0 20px 13px rgb(0 0 0 / 0.03)", "0 8px 5px rgb(0 0 0 / 0.08)"],
    "2xl": "0 25px 25px rgb(0 0 0 / 0.15)",
    none: "0 0 #0000"
  },
  fill: ({ theme }) => ({
    none: "none",
    ...theme("colors")
  }),
  flex: {
    1: "1 1 0%",
    auto: "1 1 auto",
    initial: "0 1 auto",
    none: "none"
  },
  flexBasis: ({ theme }) => ({
    auto: "auto",
    ...theme("spacing"),
    "1/2": "50%",
    "1/3": "33.333333%",
    "2/3": "66.666667%",
    "1/4": "25%",
    "2/4": "50%",
    "3/4": "75%",
    "1/5": "20%",
    "2/5": "40%",
    "3/5": "60%",
    "4/5": "80%",
    "1/6": "16.666667%",
    "2/6": "33.333333%",
    "3/6": "50%",
    "4/6": "66.666667%",
    "5/6": "83.333333%",
    "1/12": "8.333333%",
    "2/12": "16.666667%",
    "3/12": "25%",
    "4/12": "33.333333%",
    "5/12": "41.666667%",
    "6/12": "50%",
    "7/12": "58.333333%",
    "8/12": "66.666667%",
    "9/12": "75%",
    "10/12": "83.333333%",
    "11/12": "91.666667%",
    full: "100%"
  }),
  flexGrow: {
    0: "0",
    DEFAULT: "1"
  },
  flexShrink: {
    0: "0",
    DEFAULT: "1"
  },
  fontFamily: {
    sans: [
      "ui-sans-serif",
      "system-ui",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
      '"Noto Color Emoji"'
    ],
    serif: ["ui-serif", "Georgia", "Cambria", '"Times New Roman"', "Times", "serif"],
    mono: [
      "ui-monospace",
      "SFMono-Regular",
      "Menlo",
      "Monaco",
      "Consolas",
      '"Liberation Mono"',
      '"Courier New"',
      "monospace"
    ]
  },
  fontSize: {
    xs: ["0.75rem", { lineHeight: "1rem" }],
    sm: ["0.875rem", { lineHeight: "1.25rem" }],
    base: ["1rem", { lineHeight: "1.5rem" }],
    lg: ["1.125rem", { lineHeight: "1.75rem" }],
    xl: ["1.25rem", { lineHeight: "1.75rem" }],
    "2xl": ["1.5rem", { lineHeight: "2rem" }],
    "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
    "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
    "5xl": ["3rem", { lineHeight: "1" }],
    "6xl": ["3.75rem", { lineHeight: "1" }],
    "7xl": ["4.5rem", { lineHeight: "1" }],
    "8xl": ["6rem", { lineHeight: "1" }],
    "9xl": ["8rem", { lineHeight: "1" }]
  },
  fontWeight: {
    thin: "100",
    extralight: "200",
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900"
  },
  gap: ({ theme }) => theme("spacing"),
  gradientColorStops: ({ theme }) => theme("colors"),
  gradientColorStopPositions: {
    "0%": "0%",
    "5%": "5%",
    "10%": "10%",
    "15%": "15%",
    "20%": "20%",
    "25%": "25%",
    "30%": "30%",
    "35%": "35%",
    "40%": "40%",
    "45%": "45%",
    "50%": "50%",
    "55%": "55%",
    "60%": "60%",
    "65%": "65%",
    "70%": "70%",
    "75%": "75%",
    "80%": "80%",
    "85%": "85%",
    "90%": "90%",
    "95%": "95%",
    "100%": "100%"
  },
  grayscale: {
    0: "0",
    DEFAULT: "100%"
  },
  gridAutoColumns: {
    auto: "auto",
    min: "min-content",
    max: "max-content",
    fr: "minmax(0, 1fr)"
  },
  gridAutoRows: {
    auto: "auto",
    min: "min-content",
    max: "max-content",
    fr: "minmax(0, 1fr)"
  },
  gridColumn: {
    auto: "auto",
    "span-1": "span 1 / span 1",
    "span-2": "span 2 / span 2",
    "span-3": "span 3 / span 3",
    "span-4": "span 4 / span 4",
    "span-5": "span 5 / span 5",
    "span-6": "span 6 / span 6",
    "span-7": "span 7 / span 7",
    "span-8": "span 8 / span 8",
    "span-9": "span 9 / span 9",
    "span-10": "span 10 / span 10",
    "span-11": "span 11 / span 11",
    "span-12": "span 12 / span 12",
    "span-full": "1 / -1"
  },
  gridColumnEnd: {
    auto: "auto",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    10: "10",
    11: "11",
    12: "12",
    13: "13"
  },
  gridColumnStart: {
    auto: "auto",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    10: "10",
    11: "11",
    12: "12",
    13: "13"
  },
  gridRow: {
    auto: "auto",
    "span-1": "span 1 / span 1",
    "span-2": "span 2 / span 2",
    "span-3": "span 3 / span 3",
    "span-4": "span 4 / span 4",
    "span-5": "span 5 / span 5",
    "span-6": "span 6 / span 6",
    "span-7": "span 7 / span 7",
    "span-8": "span 8 / span 8",
    "span-9": "span 9 / span 9",
    "span-10": "span 10 / span 10",
    "span-11": "span 11 / span 11",
    "span-12": "span 12 / span 12",
    "span-full": "1 / -1"
  },
  gridRowEnd: {
    auto: "auto",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    10: "10",
    11: "11",
    12: "12",
    13: "13"
  },
  gridRowStart: {
    auto: "auto",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    10: "10",
    11: "11",
    12: "12",
    13: "13"
  },
  gridTemplateColumns: {
    none: "none",
    subgrid: "subgrid",
    1: "repeat(1, minmax(0, 1fr))",
    2: "repeat(2, minmax(0, 1fr))",
    3: "repeat(3, minmax(0, 1fr))",
    4: "repeat(4, minmax(0, 1fr))",
    5: "repeat(5, minmax(0, 1fr))",
    6: "repeat(6, minmax(0, 1fr))",
    7: "repeat(7, minmax(0, 1fr))",
    8: "repeat(8, minmax(0, 1fr))",
    9: "repeat(9, minmax(0, 1fr))",
    10: "repeat(10, minmax(0, 1fr))",
    11: "repeat(11, minmax(0, 1fr))",
    12: "repeat(12, minmax(0, 1fr))"
  },
  gridTemplateRows: {
    none: "none",
    subgrid: "subgrid",
    1: "repeat(1, minmax(0, 1fr))",
    2: "repeat(2, minmax(0, 1fr))",
    3: "repeat(3, minmax(0, 1fr))",
    4: "repeat(4, minmax(0, 1fr))",
    5: "repeat(5, minmax(0, 1fr))",
    6: "repeat(6, minmax(0, 1fr))",
    7: "repeat(7, minmax(0, 1fr))",
    8: "repeat(8, minmax(0, 1fr))",
    9: "repeat(9, minmax(0, 1fr))",
    10: "repeat(10, minmax(0, 1fr))",
    11: "repeat(11, minmax(0, 1fr))",
    12: "repeat(12, minmax(0, 1fr))"
  },
  height: ({ theme }) => ({
    auto: "auto",
    ...theme("spacing"),
    "1/2": "50%",
    "1/3": "33.333333%",
    "2/3": "66.666667%",
    "1/4": "25%",
    "2/4": "50%",
    "3/4": "75%",
    "1/5": "20%",
    "2/5": "40%",
    "3/5": "60%",
    "4/5": "80%",
    "1/6": "16.666667%",
    "2/6": "33.333333%",
    "3/6": "50%",
    "4/6": "66.666667%",
    "5/6": "83.333333%",
    full: "100%",
    screen: "100vh",
    svh: "100svh",
    lvh: "100lvh",
    dvh: "100dvh",
    min: "min-content",
    max: "max-content",
    fit: "fit-content"
  }),
  hueRotate: {
    0: "0deg",
    15: "15deg",
    30: "30deg",
    60: "60deg",
    90: "90deg",
    180: "180deg"
  },
  inset: ({ theme }) => ({
    auto: "auto",
    ...theme("spacing"),
    "1/2": "50%",
    "1/3": "33.333333%",
    "2/3": "66.666667%",
    "1/4": "25%",
    "2/4": "50%",
    "3/4": "75%",
    full: "100%"
  }),
  invert: {
    0: "0",
    DEFAULT: "100%"
  },
  keyframes: {
    spin: {
      to: {
        transform: "rotate(360deg)"
      }
    },
    ping: {
      "75%, 100%": {
        transform: "scale(2)",
        opacity: "0"
      }
    },
    pulse: {
      "50%": {
        opacity: ".5"
      }
    },
    bounce: {
      "0%, 100%": {
        transform: "translateY(-25%)",
        animationTimingFunction: "cubic-bezier(0.8,0,1,1)"
      },
      "50%": {
        transform: "none",
        animationTimingFunction: "cubic-bezier(0,0,0.2,1)"
      }
    }
  },
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0em",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em"
  },
  lineHeight: {
    none: "1",
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
    3: ".75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    7: "1.75rem",
    8: "2rem",
    9: "2.25rem",
    10: "2.5rem"
  },
  listStyleType: {
    none: "none",
    disc: "disc",
    decimal: "decimal"
  },
  listStyleImage: {
    none: "none"
  },
  margin: ({ theme }) => ({
    auto: "auto",
    ...theme("spacing")
  }),
  lineClamp: {
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6"
  },
  maxHeight: ({ theme }) => ({
    ...theme("spacing"),
    none: "none",
    full: "100%",
    screen: "100vh",
    svh: "100svh",
    lvh: "100lvh",
    dvh: "100dvh",
    min: "min-content",
    max: "max-content",
    fit: "fit-content"
  }),
  maxWidth: ({ theme }) => ({
    ...theme("spacing"),
    none: "none",
    xs: "20rem",
    sm: "24rem",
    md: "28rem",
    lg: "32rem",
    xl: "36rem",
    "2xl": "42rem",
    "3xl": "48rem",
    "4xl": "56rem",
    "5xl": "64rem",
    "6xl": "72rem",
    "7xl": "80rem",
    full: "100%",
    min: "min-content",
    max: "max-content",
    fit: "fit-content",
    prose: "65ch"
  }),
  minHeight: ({ theme }) => ({
    ...theme("spacing"),
    full: "100%",
    screen: "100vh",
    svh: "100svh",
    lvh: "100lvh",
    dvh: "100dvh",
    min: "min-content",
    max: "max-content",
    fit: "fit-content"
  }),
  minWidth: ({ theme }) => ({
    ...theme("spacing"),
    full: "100%",
    min: "min-content",
    max: "max-content",
    fit: "fit-content"
  }),
  objectPosition: {
    bottom: "bottom",
    center: "center",
    left: "left",
    "left-bottom": "left bottom",
    "left-top": "left top",
    right: "right",
    "right-bottom": "right bottom",
    "right-top": "right top",
    top: "top"
  },
  opacity: {
    0: "0",
    5: "0.05",
    10: "0.1",
    15: "0.15",
    20: "0.2",
    25: "0.25",
    30: "0.3",
    35: "0.35",
    40: "0.4",
    45: "0.45",
    50: "0.5",
    55: "0.55",
    60: "0.6",
    65: "0.65",
    70: "0.7",
    75: "0.75",
    80: "0.8",
    85: "0.85",
    90: "0.9",
    95: "0.95",
    100: "1"
  },
  order: {
    first: "-9999",
    last: "9999",
    none: "0",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    10: "10",
    11: "11",
    12: "12"
  },
  outlineColor: ({ theme }) => theme("colors"),
  outlineOffset: {
    0: "0px",
    1: "1px",
    2: "2px",
    4: "4px",
    8: "8px"
  },
  outlineWidth: {
    0: "0px",
    1: "1px",
    2: "2px",
    4: "4px",
    8: "8px"
  },
  padding: ({ theme }) => theme("spacing"),
  placeholderColor: ({ theme }) => theme("colors"),
  placeholderOpacity: ({ theme }) => theme("opacity"),
  ringColor: ({ theme }) => ({
    DEFAULT: theme("colors.blue.500", "#3b82f6"),
    ...theme("colors")
  }),
  ringOffsetColor: ({ theme }) => theme("colors"),
  ringOffsetWidth: {
    0: "0px",
    1: "1px",
    2: "2px",
    4: "4px",
    8: "8px"
  },
  ringOpacity: ({ theme }) => ({
    DEFAULT: "0.5",
    ...theme("opacity")
  }),
  ringWidth: {
    DEFAULT: "3px",
    0: "0px",
    1: "1px",
    2: "2px",
    4: "4px",
    8: "8px"
  },
  rotate: {
    0: "0deg",
    1: "1deg",
    2: "2deg",
    3: "3deg",
    6: "6deg",
    12: "12deg",
    45: "45deg",
    90: "90deg",
    180: "180deg"
  },
  saturate: {
    0: "0",
    50: ".5",
    100: "1",
    150: "1.5",
    200: "2"
  },
  scale: {
    0: "0",
    50: ".5",
    75: ".75",
    90: ".9",
    95: ".95",
    100: "1",
    105: "1.05",
    110: "1.1",
    125: "1.25",
    150: "1.5"
  },
  scrollMargin: ({ theme }) => ({
    ...theme("spacing")
  }),
  scrollPadding: ({ theme }) => theme("spacing"),
  sepia: {
    0: "0",
    DEFAULT: "100%"
  },
  skew: {
    0: "0deg",
    1: "1deg",
    2: "2deg",
    3: "3deg",
    6: "6deg",
    12: "12deg"
  },
  space: ({ theme }) => ({
    ...theme("spacing")
  }),
  spacing: {
    px: "1px",
    0: "0px",
    0.5: "0.125rem",
    1: "0.25rem",
    1.5: "0.375rem",
    2: "0.5rem",
    2.5: "0.625rem",
    3: "0.75rem",
    3.5: "0.875rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    7: "1.75rem",
    8: "2rem",
    9: "2.25rem",
    10: "2.5rem",
    11: "2.75rem",
    12: "3rem",
    14: "3.5rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
    28: "7rem",
    32: "8rem",
    36: "9rem",
    40: "10rem",
    44: "11rem",
    48: "12rem",
    52: "13rem",
    56: "14rem",
    60: "15rem",
    64: "16rem",
    72: "18rem",
    80: "20rem",
    96: "24rem"
  },
  stroke: ({ theme }) => ({
    none: "none",
    ...theme("colors")
  }),
  strokeWidth: {
    0: "0",
    1: "1",
    2: "2"
  },
  textColor: ({ theme }) => theme("colors"),
  textDecorationColor: ({ theme }) => theme("colors"),
  textDecorationThickness: {
    auto: "auto",
    "from-font": "from-font",
    0: "0px",
    1: "1px",
    2: "2px",
    4: "4px",
    8: "8px"
  },
  textIndent: ({ theme }) => ({
    ...theme("spacing")
  }),
  textOpacity: ({ theme }) => theme("opacity"),
  textUnderlineOffset: {
    auto: "auto",
    0: "0px",
    1: "1px",
    2: "2px",
    4: "4px",
    8: "8px"
  },
  transformOrigin: {
    center: "center",
    top: "top",
    "top-right": "top right",
    right: "right",
    "bottom-right": "bottom right",
    bottom: "bottom",
    "bottom-left": "bottom left",
    left: "left",
    "top-left": "top left"
  },
  transitionDelay: {
    0: "0s",
    75: "75ms",
    100: "100ms",
    150: "150ms",
    200: "200ms",
    300: "300ms",
    500: "500ms",
    700: "700ms",
    1e3: "1000ms"
  },
  transitionDuration: {
    DEFAULT: "150ms",
    0: "0s",
    75: "75ms",
    100: "100ms",
    150: "150ms",
    200: "200ms",
    300: "300ms",
    500: "500ms",
    700: "700ms",
    1e3: "1000ms"
  },
  transitionProperty: {
    none: "none",
    all: "all",
    DEFAULT: "color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter",
    colors: "color, background-color, border-color, text-decoration-color, fill, stroke",
    opacity: "opacity",
    shadow: "box-shadow",
    transform: "transform"
  },
  transitionTimingFunction: {
    DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
    linear: "linear",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    "in-out": "cubic-bezier(0.4, 0, 0.2, 1)"
  },
  translate: ({ theme }) => ({
    ...theme("spacing"),
    "1/2": "50%",
    "1/3": "33.333333%",
    "2/3": "66.666667%",
    "1/4": "25%",
    "2/4": "50%",
    "3/4": "75%",
    full: "100%"
  }),
  size: ({ theme }) => ({
    auto: "auto",
    ...theme("spacing"),
    "1/2": "50%",
    "1/3": "33.333333%",
    "2/3": "66.666667%",
    "1/4": "25%",
    "2/4": "50%",
    "3/4": "75%",
    "1/5": "20%",
    "2/5": "40%",
    "3/5": "60%",
    "4/5": "80%",
    "1/6": "16.666667%",
    "2/6": "33.333333%",
    "3/6": "50%",
    "4/6": "66.666667%",
    "5/6": "83.333333%",
    "1/12": "8.333333%",
    "2/12": "16.666667%",
    "3/12": "25%",
    "4/12": "33.333333%",
    "5/12": "41.666667%",
    "6/12": "50%",
    "7/12": "58.333333%",
    "8/12": "66.666667%",
    "9/12": "75%",
    "10/12": "83.333333%",
    "11/12": "91.666667%",
    full: "100%",
    min: "min-content",
    max: "max-content",
    fit: "fit-content"
  }),
  width: ({ theme }) => ({
    auto: "auto",
    ...theme("spacing"),
    "1/2": "50%",
    "1/3": "33.333333%",
    "2/3": "66.666667%",
    "1/4": "25%",
    "2/4": "50%",
    "3/4": "75%",
    "1/5": "20%",
    "2/5": "40%",
    "3/5": "60%",
    "4/5": "80%",
    "1/6": "16.666667%",
    "2/6": "33.333333%",
    "3/6": "50%",
    "4/6": "66.666667%",
    "5/6": "83.333333%",
    "1/12": "8.333333%",
    "2/12": "16.666667%",
    "3/12": "25%",
    "4/12": "33.333333%",
    "5/12": "41.666667%",
    "6/12": "50%",
    "7/12": "58.333333%",
    "8/12": "66.666667%",
    "9/12": "75%",
    "10/12": "83.333333%",
    "11/12": "91.666667%",
    full: "100%",
    screen: "100vw",
    svw: "100svw",
    lvw: "100lvw",
    dvw: "100dvw",
    min: "min-content",
    max: "max-content",
    fit: "fit-content"
  }),
  willChange: {
    auto: "auto",
    scroll: "scroll-position",
    contents: "contents",
    transform: "transform"
  },
  zIndex: {
    auto: "auto",
    0: "0",
    10: "10",
    20: "20",
    30: "30",
    40: "40",
    50: "50"
  }
};

// uno/tailwind/color-names.ts
var colorNames = {
  white: [255, 255, 255]
};

// uno/tailwind/color.ts
var HEX = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i;
var SHORT_HEX = /^#([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i;
var VALUE = /(?:\d+|\d*\.\d+)%?/;
var SEP = /(?:\s*,\s*|\s+)/;
var ALPHA_SEP = /\s*[,/]\s*/;
var CUSTOM_PROPERTY = /var\(--(?:[^ )]*?)(?:,(?:[^ )]*?|var\(--[^ )]*?\)))?\)/;
var CHANNEL = `(${VALUE.source}|${CUSTOM_PROPERTY.source})`;
var RGB = new RegExp(
  `^(rgba?)\\(\\s*${CHANNEL}(?:${SEP.source}${CHANNEL})?(?:${SEP.source}${CHANNEL})?(?:${ALPHA_SEP.source}${CHANNEL})?\\s*\\)$`
);
var HSL = new RegExp(
  `^(hsla?)\\(\\s*((?:${VALUE.source})(?:deg|rad|grad|turn)?|${CUSTOM_PROPERTY.source})(?:${SEP.source}${CHANNEL})?(?:${SEP.source}${CHANNEL})?(?:${ALPHA_SEP.source}${CHANNEL})?\\s*\\)$`
);
function parseColor(input, { loose = false } = {}) {
  if (typeof input !== "string") return null;
  const value = input.trim();
  if (value === "transparent") return { mode: "rgb", color: ["0", "0", "0"], alpha: "0" };
  if (value in colorNames) {
    return { mode: "rgb", color: colorNames[value].map(String) };
  }
  const hex = value.replace(SHORT_HEX, (_, r, g, b, a) => ["#", r, r, g, g, b, b, a ? a + a : ""].join("")).match(HEX);
  if (hex) {
    return {
      mode: "rgb",
      color: [hex[1], hex[2], hex[3]].map((channel) => String(parseInt(channel, 16))),
      alpha: hex[4] ? String(parseInt(hex[4], 16) / 255) : void 0
    };
  }
  const match = value.match(RGB) ?? value.match(HSL);
  if (!match) return null;
  const color3 = [match[2], match[3], match[4]].filter(Boolean).map(String);
  if (color3.length === 2 && color3[0].startsWith("var(")) {
    return { mode: match[1], color: [color3[0]], alpha: color3[1] };
  }
  if (!loose && color3.length !== 3) return null;
  if (color3.length < 3 && !color3.some((part) => /^var\(.*?\)$/.test(part))) return null;
  return { mode: match[1], color: color3, alpha: match[5]?.toString() };
}
function formatColor({ mode, color: color3, alpha }) {
  const hasAlpha = alpha !== void 0;
  if (mode === "rgba" || mode === "hsla") {
    return `${mode}(${color3.join(", ")}${hasAlpha ? `, ${alpha}` : ""})`;
  }
  return `${mode}(${color3.join(" ")}${hasAlpha ? ` / ${alpha}` : ""})`;
}
var hasAlphaSlot = (color3) => color3.includes("<alpha-value>");
function withAlphaValue(color3, alpha, fallback) {
  if (hasAlphaSlot(color3)) return color3.replace("<alpha-value>", alpha);
  const parsed = parseColor(color3, { loose: true });
  if (!parsed) return fallback;
  return formatColor({ ...parsed, alpha });
}
function withAlphaVariable(color3, properties, variable) {
  const props = [].concat(properties);
  if (hasAlphaSlot(color3)) {
    return {
      [variable]: "1",
      ...Object.fromEntries(
        props.map((p) => [p, color3.replace("<alpha-value>", `var(${variable})`)])
      )
    };
  }
  const parsed = parseColor(color3);
  if (!parsed || parsed.alpha !== void 0) {
    return Object.fromEntries(props.map((p) => [p, color3]));
  }
  return {
    [variable]: "1",
    ...Object.fromEntries(
      props.map((p) => [p, formatColor({ ...parsed, alpha: `var(${variable})` })])
    )
  };
}
var toColorValue = (color3) => hasAlphaSlot(color3) ? color3.replace("<alpha-value>", "1") : color3;

// uno/tailwind/theme.ts
var isPlainObject = (value) => {
  if (Object.prototype.toString.call(value) !== "[object Object]") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === null || Object.getPrototypeOf(prototype) === null;
};
var isFunction = (value) => typeof value === "function";
function mergeWith(target, ...rest) {
  const customizer = rest.pop();
  for (const source of rest) {
    for (const key of Object.keys(source ?? {})) {
      const merged = customizer(target[key], source[key]);
      if (merged !== void 0) target[key] = merged;
      else if (isPlainObject(target[key]) && isPlainObject(source[key])) {
        target[key] = mergeWith({}, target[key], source[key], customizer);
      } else target[key] = source[key];
    }
  }
  return target;
}
var cloneDeep = (value) => {
  if (Array.isArray(value)) return value.map(cloneDeep);
  if (isPlainObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, cloneDeep(entry)]));
  }
  return value;
};
function collectExtends(themes) {
  return themes.reduce(
    (merged, { extend }) => mergeWith(merged, extend ?? {}, (mergedValue, extendValue) => {
      if (mergedValue === void 0) return [extendValue];
      if (Array.isArray(mergedValue)) return [extendValue, ...mergedValue];
      return [extendValue, mergedValue];
    }),
    {}
  );
}
function mergeExtensionCustomizer(merged, value) {
  if (Array.isArray(merged) && isPlainObject(merged[0])) return merged.concat(value);
  if (Array.isArray(value) && isPlainObject(value[0]) && isPlainObject(merged)) {
    return [merged, ...value];
  }
  if (Array.isArray(value)) return value;
  return void 0;
}
function mergeExtensions({ extend, ...theme }) {
  return mergeWith(theme, extend, (themeValue, extensions) => {
    if (!isFunction(themeValue) && !extensions.some(isFunction)) {
      return mergeWith({}, themeValue, ...extensions, mergeExtensionCustomizer);
    }
    return (helpers) => mergeWith(
      {},
      ...[themeValue, ...extensions].map((entry) => isFunction(entry) ? entry(helpers) : entry),
      mergeExtensionCustomizer
    );
  });
}
var toPath = (path) => path.split(/\.(?![^[]*\])|[[\]]/g).filter(Boolean);
function* toPaths(key) {
  const path = toPath(key);
  if (path.length === 0) return;
  yield path;
  const match = /^(.*?)\s*\/\s*([^/]+)$/.exec(key);
  if (match) {
    const withAlpha = toPath(match[1]);
    withAlpha.alpha = match[2];
    yield withAlpha;
  }
}
var colorAt = (color3, alpha) => color3.includes("<alpha-value>") ? color3.replace("<alpha-value>", String(alpha)) : color3;
function resolveFunctionKeys(object) {
  const helpers = {};
  const resolvePath = (key, fallback) => {
    for (const path of toPaths(key)) {
      let index = 0;
      let value = object;
      while (value !== void 0 && value !== null && index < path.length) {
        value = value[path[index++]];
        const callIt = isFunction(value) && (path.alpha === void 0 || index <= path.length - 1);
        value = callIt ? value(helpers) : value;
      }
      if (value === void 0) continue;
      if (path.alpha !== void 0) {
        const color3 = String(value);
        if (color3.includes("<alpha-value>")) return colorAt(color3, path.alpha);
        const parsed = parseColor(color3, { loose: true });
        return parsed ? withAlphaValue(color3, path.alpha, color3) : color3;
      }
      return isPlainObject(value) ? cloneDeep(value) : value;
    }
    return fallback;
  };
  helpers.theme = resolvePath;
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [key, isFunction(value) ? value(helpers) : value])
  );
}
function resolveTheme(themes) {
  const base = themes.reduce((merged, { extend: _extend, ...theme }) => {
    for (const key of Object.keys(theme)) if (!(key in merged)) merged[key] = theme[key];
    return merged;
  }, {});
  return resolveFunctionKeys(mergeExtensions({ ...base, extend: collectExtends(themes) }));
}
function flattenColors(colors = {}) {
  return Object.assign(
    {},
    ...Object.entries(colors).map(([key, value]) => {
      if (isPlainObject(value)) {
        return Object.fromEntries(
          Object.entries(flattenColors(value)).map(([shade, color3]) => [
            shade === "DEFAULT" ? key : `${key}-${shade}`,
            color3
          ])
        );
      }
      return { [key]: String(value) };
    })
  );
}

// uno/tailwind/engine.ts
import { symbols } from "unocss";

// uno/tailwind/values.ts
function splitAtTopLevelOnly(input, separator) {
  const stack = [];
  const parts = [];
  let lastPos = 0;
  let isEscaped = false;
  for (let index = 0; index < input.length; index++) {
    const char = input[index];
    if (stack.length === 0 && char === separator[0] && !isEscaped) {
      if (separator.length === 1 || input.slice(index, index + separator.length) === separator) {
        parts.push(input.slice(lastPos, index));
        lastPos = index + separator.length;
      }
    }
    if (isEscaped) isEscaped = false;
    else if (char === "\\") isEscaped = true;
    if (char === "(" || char === "[" || char === "{") stack.push(char);
    else if (char === ")" && stack[stack.length - 1] === "(" || char === "]" && stack[stack.length - 1] === "[" || char === "}" && stack[stack.length - 1] === "{") {
      stack.pop();
    }
  }
  parts.push(input.slice(lastPos));
  return parts;
}
var PREVENT_FORMATTING_KEYWORDS = [
  "min-content",
  "max-content",
  "fit-content",
  "safe-area-inset-top",
  "safe-area-inset-right",
  "safe-area-inset-bottom",
  "safe-area-inset-left",
  "titlebar-area-x",
  "titlebar-area-y",
  "titlebar-area-width",
  "titlebar-area-height",
  "keyboard-inset-top",
  "keyboard-inset-right",
  "keyboard-inset-bottom",
  "keyboard-inset-left",
  "keyboard-inset-width",
  "keyboard-inset-height",
  "radial-gradient",
  "linear-gradient",
  "conic-gradient",
  "repeating-radial-gradient",
  "repeating-linear-gradient",
  "repeating-conic-gradient"
];
function normalizeMathOperatorSpacing(value) {
  return value.replace(/(calc|min|max|clamp)\(.+\)/g, (match) => {
    let result = "";
    const lastChar = () => {
      const trimmed = result.trimEnd();
      return trimmed[trimmed.length - 1];
    };
    for (let i = 0; i < match.length; i++) {
      const peek = (word) => word.split("").every((char2, j) => match[i + j] === char2);
      const consumeUntil = (chars) => {
        let minIndex = Infinity;
        for (const char2 of chars) {
          const index = match.indexOf(char2, i);
          if (index !== -1 && index < minIndex) minIndex = index;
        }
        const consumed = match.slice(i, minIndex);
        i += consumed.length - 1;
        return consumed;
      };
      const char = match[i];
      if (peek("var")) {
        result += consumeUntil([")", ","]);
      } else if (PREVENT_FORMATTING_KEYWORDS.some(peek)) {
        const keyword = PREVENT_FORMATTING_KEYWORDS.find(peek);
        result += keyword;
        i += keyword.length - 1;
      } else if (peek("theme")) {
        result += consumeUntil([")"]);
      } else if (peek("[")) {
        result += consumeUntil(["]"]);
      } else if (["+", "-", "*", "/"].includes(char) && !["(", "+", "-", "*", "/", ","].includes(lastChar())) {
        result += ` ${char} `;
      } else {
        result += char;
      }
    }
    return result.replace(/\s+/g, " ");
  });
}
function normalize(value, isRoot = true) {
  if (value.startsWith("--")) return `var(${value})`;
  if (value.includes("url(")) {
    return value.split(/(url\(.*?\))/g).filter(Boolean).map((part) => /^url\(.*?\)$/.test(part) ? part : normalize(part, false)).join("");
  }
  let result = value.replace(/([^\\])_+/g, (full, before) => before + " ".repeat(full.length - 1)).replace(/^_/g, " ").replace(/\\_/g, "_");
  if (isRoot) result = result.trim();
  return normalizeMathOperatorSpacing(result);
}
var isCSSFunction = (value) => ["min", "max", "clamp", "calc"].some((fn) => new RegExp(`^${fn}\\(.*\\)`).test(value));
var url = (value) => value.startsWith("url(");
var number = (value) => !isNaN(Number(value)) || isCSSFunction(value);
var percentage = (value) => value.endsWith("%") && number(value.slice(0, -1)) || isCSSFunction(value);
var LENGTH_UNITS = "cm|mm|Q|in|pc|pt|px|em|ex|ch|rem|lh|rlh|vw|vh|vmin|vmax|vb|vi|svw|svh|lvw|lvh|dvw|dvh|cqw|cqh|cqi|cqb|cqmin|cqmax";
var LENGTH = new RegExp(`^[+-]?[0-9]*\\.?[0-9]+(?:[eE][+-]?[0-9]+)?(?:${LENGTH_UNITS})$`);
var length = (value) => value === "0" || LENGTH.test(value) || isCSSFunction(value);
var lineWidth = (value) => ["thin", "medium", "thick"].includes(value);
var SHADOW_KEYWORDS = /* @__PURE__ */ new Set(["inset", "inherit", "initial", "revert", "unset"]);
function parseBoxShadowValue(input) {
  return splitAtTopLevelOnly(input, ",").map((shadow2) => {
    const value = shadow2.trim();
    const result = { raw: value, valid: false };
    const seen = /* @__PURE__ */ new Set();
    for (const part of value.split(/ +(?![^(]*\))/g)) {
      if (!seen.has("KEYWORD") && SHADOW_KEYWORDS.has(part)) {
        result.keyword = part;
        seen.add("KEYWORD");
      } else if (/^-?(\d+|\.\d+)(.*?)$/.test(part)) {
        for (const slot of ["x", "y", "blur", "spread"]) {
          if (!seen.has(slot)) {
            result[slot] = part;
            seen.add(slot);
            break;
          }
        }
      } else if (!result.color) {
        result.color = part;
      } else {
        (result.unknown ??= []).push(part);
      }
    }
    result.valid = result.x !== void 0 && result.y !== void 0;
    return result;
  });
}
var formatBoxShadowValue = (shadows) => shadows.map(
  (shadow2) => shadow2.valid ? [shadow2.keyword, shadow2.x, shadow2.y, shadow2.blur, shadow2.spread, shadow2.color].filter(Boolean).join(" ") : shadow2.raw
).join(", ");
var shadow = (value) => parseBoxShadowValue(normalize(value)).every((parsed) => parsed.valid);
function color(value) {
  let colors = 0;
  const valid = splitAtTopLevelOnly(value, "_").every((part) => {
    const normalized = normalize(part);
    if (normalized.startsWith("var(")) return true;
    if (parseColor(normalized, { loose: true }) !== null) {
      colors++;
      return true;
    }
    return false;
  });
  return valid && colors > 0;
}
var GRADIENTS = [
  "conic-gradient",
  "linear-gradient",
  "radial-gradient",
  "repeating-conic-gradient",
  "repeating-linear-gradient",
  "repeating-radial-gradient"
];
var gradient = (value) => {
  const normalized = normalize(value);
  return GRADIENTS.some((type) => normalized.startsWith(`${type}(`));
};
function image(value) {
  let images = 0;
  const valid = splitAtTopLevelOnly(value, ",").every((part) => {
    const normalized = normalize(part);
    if (normalized.startsWith("var(")) return true;
    if (url(normalized) || gradient(normalized) || ["element(", "image(", "cross-fade(", "image-set("].some((fn) => normalized.startsWith(fn))) {
      images++;
      return true;
    }
    return false;
  });
  return valid && images > 0;
}
function position(value) {
  let positions = 0;
  const valid = splitAtTopLevelOnly(value, "_").every((part) => {
    const normalized = normalize(part);
    if (normalized.startsWith("var(")) return true;
    if (["center", "top", "right", "bottom", "left"].includes(normalized) || length(normalized) || percentage(normalized)) {
      positions++;
      return true;
    }
    return false;
  });
  return valid && positions > 0;
}
function familyName(value) {
  let fonts2 = 0;
  const valid = splitAtTopLevelOnly(value, ",").every((part) => {
    const normalized = normalize(part);
    if (normalized.startsWith("var(")) return true;
    if (normalized.includes(" ") && !/(['"])([^"']+)\1/.test(normalized)) return false;
    if (/^\d/.test(normalized)) return false;
    fonts2++;
    return true;
  });
  return valid && fonts2 > 0;
}
var genericName = (value) => [
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui",
  "ui-serif",
  "ui-sans-serif",
  "ui-monospace",
  "ui-rounded",
  "math",
  "emoji",
  "fangsong"
].includes(value);
var absoluteSize = (value) => ["xx-small", "x-small", "small", "medium", "large", "x-large", "xxx-large"].includes(value);
var relativeSize = (value) => ["larger", "smaller"].includes(value);
var backgroundSize = (value) => splitAtTopLevelOnly(value, ",").every((part) => {
  const sizes = splitAtTopLevelOnly(part, "_").filter(Boolean);
  if (sizes.length === 1 && ["cover", "contain"].includes(sizes[0])) return true;
  if (sizes.length !== 1 && sizes.length !== 2) return false;
  return sizes.every((size) => length(size) || percentage(size) || size === "auto");
});
function negateValue(input) {
  const value = String(input);
  if (value === "0") return "0";
  if (/^[+-]?(\d+|\d*\.\d+)(e[+-]?\d+)?(%|\w+)?$/.test(value)) {
    return value.replace(/^[+-]?/, (sign) => sign === "-" ? "" : "-");
  }
  if (["var", "calc", "min", "max", "clamp"].some((fn) => value.includes(`${fn}(`))) {
    return `calc(${value} * -1)`;
  }
  return void 0;
}

// uno/tailwind/engine.ts
var isArbitraryValue = (input) => input.startsWith("[") && input.endsWith("]");
function isSyntacticallyValidPropertyValue(value) {
  const matching = { "{": "}", "[": "]", "(": ")" };
  const inverse = { "}": "{", "]": "[", ")": "(" };
  const stack = [];
  let inQuotes = false;
  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    if (char === ":" && !inQuotes && stack.length === 0) return false;
    if (['"', "'", "`"].includes(char) && value[i - 1] !== "\\") inQuotes = !inQuotes;
    if (inQuotes || value[i - 1] === "\\") continue;
    if (char in matching) stack.push(char);
    else if (char in inverse) {
      if (stack.length === 0 || stack.pop() !== inverse[char]) return false;
    }
  }
  return stack.length === 0;
}
function resolveArbitraryValue(modifier, validate) {
  if (!isArbitraryValue(modifier)) return void 0;
  const value = modifier.slice(1, -1);
  if (!validate(value)) return void 0;
  return normalize(value);
}
function asNegativeValue(modifier, lookup = {}, validate) {
  const positive = lookup[modifier];
  if (positive !== void 0) return negateValue(positive);
  if (isArbitraryValue(modifier)) {
    const resolved = resolveArbitraryValue(modifier, validate);
    return resolved === void 0 ? void 0 : negateValue(resolved);
  }
  return void 0;
}
function asValue(modifier, options = {}, validate = () => true) {
  const value = options.values?.[modifier];
  if (value !== void 0) return value;
  if (options.supportsNegativeValues && modifier.startsWith("-")) {
    return asNegativeValue(modifier.slice(1), options.values, validate);
  }
  return resolveArbitraryValue(modifier, validate);
}
function splitUtilityModifier(modifier) {
  let slashIdx = modifier.lastIndexOf("/");
  const arbitraryStartIdx = modifier.lastIndexOf("[", slashIdx);
  const arbitraryEndIdx = modifier.indexOf("]", slashIdx);
  const isNextToArbitrary = modifier[slashIdx - 1] === "]" || modifier[slashIdx + 1] === "[";
  if (!isNextToArbitrary && arbitraryStartIdx !== -1 && arbitraryEndIdx !== -1) {
    if (arbitraryStartIdx < slashIdx && slashIdx < arbitraryEndIdx) {
      slashIdx = modifier.lastIndexOf("/", arbitraryStartIdx);
    }
  }
  if (slashIdx === -1 || slashIdx === modifier.length - 1) return [modifier, void 0];
  if (isArbitraryValue(modifier) && !modifier.includes("]/[")) return [modifier, void 0];
  return [modifier.slice(0, slashIdx), modifier.slice(slashIdx + 1)];
}
var unwrapArbitraryModifier = (modifier) => normalize(modifier.slice(1, -1));
function asColor(modifier, options, context) {
  if (options.values?.[modifier] !== void 0) return options.values[modifier];
  const [base, alpha] = splitUtilityModifier(modifier);
  if (alpha !== void 0) {
    const normalized = options.values?.[base] ?? (isArbitraryValue(base) ? base.slice(1, -1) : void 0);
    if (normalized === void 0) return void 0;
    if (isArbitraryValue(alpha)) {
      return withAlphaValue(normalized, unwrapArbitraryModifier(alpha));
    }
    if (context.opacity[alpha] === void 0) return void 0;
    return withAlphaValue(normalized, String(context.opacity[alpha]));
  }
  return asValue(modifier, options, color);
}
var guess = (validate) => (modifier, options) => asValue(modifier, options, validate);
var typeMap = {
  any: (modifier, options) => asValue(modifier, options),
  color: asColor,
  url: guess(url),
  image: guess(image),
  length: guess(length),
  percentage: guess(percentage),
  position: guess(position),
  lookup: (modifier, options) => options.values?.[modifier],
  "generic-name": guess(genericName),
  "family-name": guess(familyName),
  number: guess(number),
  "line-width": guess(lineWidth),
  "absolute-size": guess(absoluteSize),
  "relative-size": guess(relativeSize),
  shadow: guess(shadow),
  size: guess(backgroundSize)
};
var supportedTypes = Object.keys(typeMap);
function* getMatchingTypes(types, rawModifier, options, context) {
  let [modifier, utilityModifier] = splitUtilityModifier(rawModifier);
  const canUseUtilityModifier = options.modifiers != null && (utilityModifier && isArbitraryValue(utilityModifier) || utilityModifier !== void 0 && utilityModifier in options.modifiers);
  if (!canUseUtilityModifier) {
    modifier = rawModifier;
    utilityModifier = void 0;
  }
  if (utilityModifier !== void 0 && modifier === "") modifier = "DEFAULT";
  if (utilityModifier !== void 0 && options.modifiers) {
    const configValue = options.modifiers[utilityModifier];
    if (configValue != null) utilityModifier = configValue;
    else if (isArbitraryValue(utilityModifier)) {
      utilityModifier = unwrapArbitraryModifier(utilityModifier);
    }
  }
  for (const { type } of types) {
    const result = typeMap[type](modifier, options, context);
    if (result === void 0) continue;
    yield [result, type, utilityModifier ?? null];
  }
}
function coerceValue(types, modifier, options, context) {
  if (options.values && modifier in options.values) {
    for (const { type } of types) {
      const result = typeMap[type](modifier, options, context);
      if (result !== void 0) return [result, type, null];
    }
  }
  if (isArbitraryValue(modifier)) {
    const arbitraryValue = modifier.slice(1, -1);
    const index = arbitraryValue.indexOf(":");
    let explicitType = index === -1 ? void 0 : arbitraryValue.slice(0, index);
    let value = index === -1 ? arbitraryValue : arbitraryValue.slice(index + 1);
    if (explicitType === void 0 || !/^[\w-_]+$/g.test(explicitType)) {
      explicitType = void 0;
      value = arbitraryValue;
    } else if (!supportedTypes.includes(explicitType)) {
      return [];
    }
    if (value.length > 0 && explicitType && supportedTypes.includes(explicitType)) {
      return [asValue(`[${value}]`, options), explicitType, null];
    }
  }
  const first = getMatchingTypes(types, modifier, options, context).next();
  return first.done ? [] : first.value;
}
var normalizeTypes = (type) => [].concat(type ?? "any").flat(0).map(
  (entry) => Array.isArray(entry) ? { type: entry[0], ...entry[1] } : { type: entry }
);
function nestUnder(template, declarations) {
  return toUno(declarations).map(
    (inner) => typeof inner === "string" ? inner : {
      ...inner,
      [symbols.selector]: (selector) => template.replace(/&/g, selector)
    }
  );
}
function toUno(output) {
  if (typeof output === "string") return [output];
  const own = {};
  const nested = [];
  for (const [key, value] of Object.entries(output)) {
    if (key.startsWith("@defaults")) continue;
    if (value === void 0) continue;
    if (typeof value === "object") {
      if (key.includes("&")) nested.push(...nestUnder(key, value));
      continue;
    }
    own[key] = String(value);
  }
  return Object.keys(own).length > 0 ? [own, ...nested] : nested;
}
function createEngine(context) {
  const byIdentifier = /* @__PURE__ */ new Map();
  function generate(entry, modifier) {
    const plugins = byIdentifier.get(entry.identifier) ?? [];
    const { options } = entry;
    const [value, coercedType, utilityModifier] = coerceValue(
      options.types,
      modifier,
      options,
      context
    );
    if (value === void 0) return void 0;
    if (!options.types.some(({ type }) => type === coercedType) && plugins.length > 1) {
      return void 0;
    }
    if (typeof value === "string" && !isSyntacticallyValidPropertyValue(value)) return void 0;
    const outputs = [].concat(entry.run(value, { modifier: utilityModifier ?? null }) ?? []).filter(Boolean);
    if (outputs.length === 0) return void 0;
    return outputs.flatMap(toUno);
  }
  function arbitraryOwner(identifier, modifier) {
    const plugins = byIdentifier.get(identifier) ?? [];
    const matching = plugins.filter((entry) => generate(entry, modifier) !== void 0);
    if (matching.length <= 1) return matching[0];
    const typesOf = (entry) => Array.from(getMatchingTypes(entry.options.types, modifier, entry.options, context)).map(
      ([, type]) => type
    );
    const withAny = matching.filter((entry) => entry.options.types.some((t) => t.type === "any"));
    const withoutAny = matching.filter((entry) => !withAny.includes(entry));
    const findFallback = (group) => {
      if (group.length === 1) return group[0];
      return group.find((entry) => {
        const types = typesOf(entry);
        return entry.options.types.some(
          ({ type, preferOnConflict }) => types.includes(type) && preferOnConflict
        );
      });
    };
    return findFallback(withoutAny) ?? findFallback(withAny);
  }
  function matchUtilities(utilities, options = {}) {
    const normalized = { ...options, types: normalizeTypes(options.type) };
    const entries = /* @__PURE__ */ new Map();
    for (const [identifier, run] of Object.entries(utilities)) {
      const entry = { identifier, run, options: normalized };
      if (!byIdentifier.has(identifier)) byIdentifier.set(identifier, []);
      byIdentifier.get(identifier)?.push(entry);
      entries.set(identifier, entry);
    }
    const alternatives = [...entries.keys()].sort((a, b) => b.length - a.length).map((identifier) => identifier.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")).join("|");
    return [
      [
        new RegExp(`^(-)?(${alternatives})(?:-(.+))?$`),
        ([, negative, identifier, rest]) => {
          const entry = entries.get(identifier);
          let modifier = rest ?? "DEFAULT";
          if (negative) modifier = `-${modifier}`;
          if (isArbitraryValue(modifier) && arbitraryOwner(identifier, modifier) !== entry) {
            return void 0;
          }
          return generate(entry, modifier);
        }
      ]
    ];
  }
  return { matchUtilities };
}
function addUtilities(utilities) {
  return Object.entries(utilities).map(
    ([selector, declarations]) => {
      const match = /^\.([\w-]+)(.*)$/.exec(selector);
      if (!match) throw new Error(`Not a class selector: ${selector}`);
      const [, name, rest] = match;
      const body = rest ? { [`&${rest}`]: declarations } : declarations;
      return [name, toUno(body)];
    }
  );
}

// uno/tailwind/plugins.ts
var kebab = (property) => property.startsWith("--") ? property : property.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
var isPlainObject2 = (value) => Object.prototype.toString.call(value) === "[object Object]";
var CSS_FILTER = [
  "blur",
  "brightness",
  "contrast",
  "grayscale",
  "hue-rotate",
  "invert",
  "saturate",
  "sepia",
  "drop-shadow"
].map((name) => `var(--blade-${name})`).join(" ");
var CSS_BACKDROP_FILTER = [
  "blur",
  "brightness",
  "contrast",
  "grayscale",
  "hue-rotate",
  "invert",
  "opacity",
  "saturate",
  "sepia"
].map((name) => `var(--blade-backdrop-${name})`).join(" ");
var CSS_TOUCH_ACTION = "var(--tw-pan-x) var(--tw-pan-y) var(--tw-pinch-zoom)";
var CSS_FONT_VARIANT_NUMERIC = "var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)";
function splitTopLevelCommas(value) {
  const parts = [];
  let depth = 0;
  let quote = "";
  let start = 0;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (quote) {
      if (char === quote && value[index - 1] !== "\\") quote = "";
    } else if (char === '"' || char === "'") {
      quote = char;
    } else if (char === "(" || char === "[") {
      depth += 1;
    } else if (char === ")" || char === "]") {
      depth = Math.max(0, depth - 1);
    } else if (char === "," && depth === 0) {
      parts.push(value.slice(start, index));
      start = index + 1;
    }
  }
  parts.push(value.slice(start));
  return parts.map((part) => part.trim()).filter(Boolean);
}
function transformThemeValue(themeKey) {
  if (["fontSize", "outline"].includes(themeKey)) {
    return (value) => Array.isArray(value) ? value[0] : value;
  }
  if (themeKey === "fontFamily") {
    return (value) => {
      const families = Array.isArray(value) && isPlainObject2(value[1]) ? value[0] : value;
      return Array.isArray(families) ? families.join(", ") : families;
    };
  }
  if ([
    "boxShadow",
    "transitionProperty",
    "transitionDuration",
    "transitionDelay",
    "transitionTimingFunction",
    "backgroundImage",
    "backgroundSize",
    "backgroundColor",
    "cursor",
    "animation"
  ].includes(themeKey)) {
    return (value) => Array.isArray(value) ? value.join(", ") : value;
  }
  if (["gridTemplateColumns", "gridTemplateRows", "objectPosition"].includes(themeKey)) {
    return (value) => typeof value === "string" ? splitTopLevelCommas(value).join(" ") : value;
  }
  return (value) => value;
}
var withoutDefault = ({ DEFAULT: _default, ...rest } = {}) => rest;
function animationNames(input) {
  const keywords2 = /* @__PURE__ */ new Set([
    "normal",
    "reverse",
    "alternate",
    "alternate-reverse",
    "running",
    "paused",
    "none",
    "forwards",
    "backwards",
    "both",
    "infinite",
    "linear",
    "ease",
    "ease-in",
    "ease-out",
    "ease-in-out",
    "step-start",
    "step-end"
  ]);
  return input.split(/,(?![^(]*\))/g).map((animation) => {
    const seen = /* @__PURE__ */ new Set();
    for (const part of animation.trim().split(/ +(?![^(]*\))/g)) {
      if (/^(-?[\d.]+m?s)$/.test(part) || /^(\d+)$/.test(part)) continue;
      if (["cubic-bezier(", "steps("].some((fn) => part.startsWith(fn))) continue;
      if (keywords2.has(part) && !seen.has(part)) {
        seen.add(part);
        continue;
      }
      return part;
    }
    return void 0;
  });
}
function keyframesCSS(name, frames) {
  const steps = Object.entries(frames).map(
    ([step, declarations]) => `${step}{${Object.entries(declarations).map(([property, value]) => `${kebab(property.trim())}:${value}`).join(";")}}`
  ).join("");
  return `@keyframes ${name}{${steps}}`;
}
function tailwindRules(theme) {
  const { matchUtilities } = createEngine({ opacity: theme.opacity ?? {} });
  const createUtilityPlugin = (themeKey, variations = [[[themeKey, [themeKey]]]], { filterDefault = false, ...options } = {}) => {
    const transform = transformThemeValue(themeKey);
    const values = filterDefault ? withoutDefault(theme[themeKey]) : theme[themeKey];
    return variations.flatMap(
      (group) => matchUtilities(
        Object.fromEntries(
          group.map(([prefix, properties]) => [
            prefix,
            (value) => Object.fromEntries(
              properties.map(
                (property) => Array.isArray(property) ? [kebab(property[0]), property[1]] : [kebab(property), transform(value)]
              )
            )
          ])
        ),
        { ...options, values }
      )
    );
  };
  const colors = (key) => flattenColors(theme[key]);
  const colorUtility = (identifier, key, output, { dropDefault = false, type = ["color", "any"] } = {}) => matchUtilities(
    { [identifier]: output },
    { values: dropDefault ? withoutDefault(colors(key)) : colors(key), type }
  );
  const filter = (identifier, key, name = identifier, negative = false) => matchUtilities(
    {
      [identifier]: (value) => ({
        [`--blade-${name}`]: `${name}(${value})`,
        filter: CSS_FILTER
      })
    },
    { values: theme[key], supportsNegativeValues: negative }
  );
  const backdrop = (identifier, key, name, negative = false) => matchUtilities(
    {
      [`backdrop-${identifier}`]: (value) => ({
        [`--blade-backdrop-${identifier}`]: `${name}(${value})`,
        "backdrop-filter": CSS_BACKDROP_FILTER
      })
    },
    { values: theme[key], supportsNegativeValues: negative }
  );
  const keyframes2 = Object.fromEntries(
    Object.entries(theme.keyframes ?? {}).map(([name, frames]) => [
      name,
      keyframesCSS(name, frames)
    ])
  );
  const boxShadowValue = transformThemeValue("boxShadow");
  return [
    // accessibility
    ...addUtilities({
      ".sr-only": {
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: "0",
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        "white-space": "nowrap",
        "border-width": "0"
      },
      ".not-sr-only": {
        position: "static",
        width: "auto",
        height: "auto",
        padding: "0",
        margin: "0",
        overflow: "visible",
        clip: "auto",
        "white-space": "normal"
      }
    }),
    ...addUtilities({
      ".pointer-events-none": { "pointer-events": "none" },
      ".pointer-events-auto": { "pointer-events": "auto" }
    }),
    ...addUtilities({
      ".visible": { visibility: "visible" },
      ".invisible": { visibility: "hidden" },
      ".collapse": { visibility: "collapse" }
    }),
    ...addUtilities({
      ".static": { position: "static" },
      ".fixed": { position: "fixed" },
      ".absolute": { position: "absolute" },
      ".relative": { position: "relative" },
      ".sticky": { position: "sticky" }
    }),
    ...createUtilityPlugin(
      "inset",
      [
        [["inset", ["inset"]]],
        [
          ["inset-x", ["left", "right"]],
          ["inset-y", ["top", "bottom"]]
        ],
        [
          ["start", ["inset-inline-start"]],
          ["end", ["inset-inline-end"]],
          ["top", ["top"]],
          ["right", ["right"]],
          ["bottom", ["bottom"]],
          ["left", ["left"]]
        ]
      ],
      { supportsNegativeValues: true }
    ),
    ...addUtilities({
      ".isolate": { isolation: "isolate" },
      ".isolation-auto": { isolation: "auto" }
    }),
    ...createUtilityPlugin("zIndex", [[["z", ["zIndex"]]]], { supportsNegativeValues: true }),
    ...createUtilityPlugin("order", void 0, { supportsNegativeValues: true }),
    ...createUtilityPlugin("gridColumn", [[["col", ["gridColumn"]]]]),
    ...createUtilityPlugin("gridColumnStart", [[["col-start", ["gridColumnStart"]]]]),
    ...createUtilityPlugin("gridColumnEnd", [[["col-end", ["gridColumnEnd"]]]]),
    ...createUtilityPlugin("gridRow", [[["row", ["gridRow"]]]]),
    ...createUtilityPlugin("gridRowStart", [[["row-start", ["gridRowStart"]]]]),
    ...createUtilityPlugin("gridRowEnd", [[["row-end", ["gridRowEnd"]]]]),
    ...addUtilities({
      ".float-start": { float: "inline-start" },
      ".float-end": { float: "inline-end" },
      ".float-right": { float: "right" },
      ".float-left": { float: "left" },
      ".float-none": { float: "none" }
    }),
    ...addUtilities({
      ".clear-start": { clear: "inline-start" },
      ".clear-end": { clear: "inline-end" },
      ".clear-left": { clear: "left" },
      ".clear-right": { clear: "right" },
      ".clear-both": { clear: "both" },
      ".clear-none": { clear: "none" }
    }),
    ...createUtilityPlugin(
      "margin",
      [
        [["m", ["margin"]]],
        [
          ["mx", ["margin-left", "margin-right"]],
          ["my", ["margin-top", "margin-bottom"]]
        ],
        [
          ["ms", ["margin-inline-start"]],
          ["me", ["margin-inline-end"]],
          ["mt", ["margin-top"]],
          ["mr", ["margin-right"]],
          ["mb", ["margin-bottom"]],
          ["ml", ["margin-left"]]
        ]
      ],
      { supportsNegativeValues: true }
    ),
    ...addUtilities({
      ".box-border": { "box-sizing": "border-box" },
      ".box-content": { "box-sizing": "content-box" }
    }),
    ...matchUtilities(
      {
        "line-clamp": (value) => ({
          overflow: "hidden",
          display: "-webkit-box",
          "-webkit-box-orient": "vertical",
          "-webkit-line-clamp": `${value}`
        })
      },
      { values: theme.lineClamp }
    ),
    ...addUtilities({
      ".line-clamp-none": {
        overflow: "visible",
        display: "block",
        "-webkit-box-orient": "horizontal",
        "-webkit-line-clamp": "none"
      }
    }),
    ...addUtilities(
      Object.fromEntries(
        [
          "block",
          "inline-block",
          "inline",
          "flex",
          "inline-flex",
          "table",
          "inline-table",
          "table-caption",
          "table-cell",
          "table-column",
          "table-column-group",
          "table-footer-group",
          "table-header-group",
          "table-row-group",
          "table-row",
          "flow-root",
          "grid",
          "inline-grid",
          "contents",
          "list-item"
        ].map((display) => [`.${display}`, { display }]).concat([[".hidden", { display: "none" }]])
      )
    ),
    ...createUtilityPlugin("aspectRatio", [[["aspect", ["aspect-ratio"]]]]),
    ...createUtilityPlugin("size", [[["size", ["width", "height"]]]]),
    ...createUtilityPlugin("height", [[["h", ["height"]]]]),
    ...createUtilityPlugin("maxHeight", [[["max-h", ["maxHeight"]]]]),
    ...createUtilityPlugin("minHeight", [[["min-h", ["minHeight"]]]]),
    ...createUtilityPlugin("width", [[["w", ["width"]]]]),
    ...createUtilityPlugin("minWidth", [[["min-w", ["minWidth"]]]]),
    ...createUtilityPlugin("maxWidth", [[["max-w", ["maxWidth"]]]]),
    ...createUtilityPlugin("flex"),
    // `flex-shrink-*`, `flex-grow-*`: Tailwind's deprecated names, not ported
    ...createUtilityPlugin("flexShrink", [[["shrink", ["flex-shrink"]]]]),
    ...createUtilityPlugin("flexGrow", [[["grow", ["flex-grow"]]]]),
    ...createUtilityPlugin("flexBasis", [[["basis", ["flex-basis"]]]]),
    ...addUtilities({
      ".table-auto": { "table-layout": "auto" },
      ".table-fixed": { "table-layout": "fixed" }
    }),
    ...addUtilities({
      ".caption-top": { "caption-side": "top" },
      ".caption-bottom": { "caption-side": "bottom" }
    }),
    ...addUtilities({
      ".border-collapse": { "border-collapse": "collapse" },
      ".border-separate": { "border-collapse": "separate" }
    }),
    ...matchUtilities(
      {
        "border-spacing": (value) => ({
          "--tw-border-spacing-x": value,
          "--tw-border-spacing-y": value,
          "border-spacing": "var(--tw-border-spacing-x) var(--tw-border-spacing-y)"
        }),
        "border-spacing-x": (value) => ({
          "--tw-border-spacing-x": value,
          "border-spacing": "var(--tw-border-spacing-x) var(--tw-border-spacing-y)"
        }),
        "border-spacing-y": (value) => ({
          "--tw-border-spacing-y": value,
          "border-spacing": "var(--tw-border-spacing-x) var(--tw-border-spacing-y)"
        })
      },
      { values: theme.borderSpacing }
    ),
    ...createUtilityPlugin("transformOrigin", [[["origin", ["transformOrigin"]]]]),
    // translate, rotate, skew, scale, transform: Blade's (see the header)
    ...matchUtilities(
      {
        animate: (value) => {
          const names = animationNames(value);
          return [
            ...names.flatMap((name) => name && keyframes2[name] ? [keyframes2[name]] : []),
            { animation: value }
          ];
        }
      },
      { values: theme.animation }
    ),
    ...createUtilityPlugin("cursor"),
    ...addUtilities({
      ".touch-auto": { "touch-action": "auto" },
      ".touch-none": { "touch-action": "none" },
      ".touch-pan-x": { "--tw-pan-x": "pan-x", "touch-action": CSS_TOUCH_ACTION },
      ".touch-pan-left": { "--tw-pan-x": "pan-left", "touch-action": CSS_TOUCH_ACTION },
      ".touch-pan-right": { "--tw-pan-x": "pan-right", "touch-action": CSS_TOUCH_ACTION },
      ".touch-pan-y": { "--tw-pan-y": "pan-y", "touch-action": CSS_TOUCH_ACTION },
      ".touch-pan-up": { "--tw-pan-y": "pan-up", "touch-action": CSS_TOUCH_ACTION },
      ".touch-pan-down": { "--tw-pan-y": "pan-down", "touch-action": CSS_TOUCH_ACTION },
      ".touch-pinch-zoom": { "--tw-pinch-zoom": "pinch-zoom", "touch-action": CSS_TOUCH_ACTION },
      ".touch-manipulation": { "touch-action": "manipulation" }
    }),
    ...addUtilities({
      ".select-none": { "user-select": "none" },
      ".select-text": { "user-select": "text" },
      ".select-all": { "user-select": "all" },
      ".select-auto": { "user-select": "auto" }
    }),
    ...addUtilities({
      ".resize-none": { resize: "none" },
      ".resize-y": { resize: "vertical" },
      ".resize-x": { resize: "horizontal" },
      ".resize": { resize: "both" }
    }),
    ...addUtilities({
      ".snap-none": { "scroll-snap-type": "none" },
      ".snap-x": { "scroll-snap-type": "x var(--tw-scroll-snap-strictness)" },
      ".snap-y": { "scroll-snap-type": "y var(--tw-scroll-snap-strictness)" },
      ".snap-both": { "scroll-snap-type": "both var(--tw-scroll-snap-strictness)" },
      ".snap-mandatory": { "--tw-scroll-snap-strictness": "mandatory" },
      ".snap-proximity": { "--tw-scroll-snap-strictness": "proximity" }
    }),
    ...addUtilities({
      ".snap-start": { "scroll-snap-align": "start" },
      ".snap-end": { "scroll-snap-align": "end" },
      ".snap-center": { "scroll-snap-align": "center" },
      ".snap-align-none": { "scroll-snap-align": "none" }
    }),
    ...addUtilities({
      ".snap-normal": { "scroll-snap-stop": "normal" },
      ".snap-always": { "scroll-snap-stop": "always" }
    }),
    ...createUtilityPlugin(
      "scrollMargin",
      [
        [["scroll-m", ["scroll-margin"]]],
        [
          ["scroll-mx", ["scroll-margin-left", "scroll-margin-right"]],
          ["scroll-my", ["scroll-margin-top", "scroll-margin-bottom"]]
        ],
        [
          ["scroll-ms", ["scroll-margin-inline-start"]],
          ["scroll-me", ["scroll-margin-inline-end"]],
          ["scroll-mt", ["scroll-margin-top"]],
          ["scroll-mr", ["scroll-margin-right"]],
          ["scroll-mb", ["scroll-margin-bottom"]],
          ["scroll-ml", ["scroll-margin-left"]]
        ]
      ],
      { supportsNegativeValues: true }
    ),
    ...createUtilityPlugin("scrollPadding", [
      [["scroll-p", ["scroll-padding"]]],
      [
        ["scroll-px", ["scroll-padding-left", "scroll-padding-right"]],
        ["scroll-py", ["scroll-padding-top", "scroll-padding-bottom"]]
      ],
      [
        ["scroll-ps", ["scroll-padding-inline-start"]],
        ["scroll-pe", ["scroll-padding-inline-end"]],
        ["scroll-pt", ["scroll-padding-top"]],
        ["scroll-pr", ["scroll-padding-right"]],
        ["scroll-pb", ["scroll-padding-bottom"]],
        ["scroll-pl", ["scroll-padding-left"]]
      ]
    ]),
    ...addUtilities({
      ".list-inside": { "list-style-position": "inside" },
      ".list-outside": { "list-style-position": "outside" }
    }),
    ...createUtilityPlugin("listStyleType", [[["list", ["listStyleType"]]]]),
    ...createUtilityPlugin("listStyleImage", [[["list-image", ["listStyleImage"]]]]),
    ...addUtilities({
      ".appearance-none": { appearance: "none" },
      ".appearance-auto": { appearance: "auto" }
    }),
    ...createUtilityPlugin("columns", [[["columns", ["columns"]]]]),
    ...addUtilities(
      Object.fromEntries(
        [
          ["before", ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"]],
          ["inside", ["auto", "avoid", "avoid-page", "avoid-column"]],
          ["after", ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"]]
        ].flatMap(
          ([side, values]) => values.map((value) => [`.break-${side}-${value}`, { [`break-${side}`]: value }])
        )
      )
    ),
    ...createUtilityPlugin("gridAutoColumns", [[["auto-cols", ["gridAutoColumns"]]]]),
    ...addUtilities({
      ".grid-flow-row": { "grid-auto-flow": "row" },
      ".grid-flow-col": { "grid-auto-flow": "column" },
      ".grid-flow-dense": { "grid-auto-flow": "dense" },
      ".grid-flow-row-dense": { "grid-auto-flow": "row dense" },
      ".grid-flow-col-dense": { "grid-auto-flow": "column dense" }
    }),
    ...createUtilityPlugin("gridAutoRows", [[["auto-rows", ["gridAutoRows"]]]]),
    ...createUtilityPlugin("gridTemplateColumns", [[["grid-cols", ["gridTemplateColumns"]]]]),
    ...createUtilityPlugin("gridTemplateRows", [[["grid-rows", ["gridTemplateRows"]]]]),
    ...addUtilities({
      ".flex-row": { "flex-direction": "row" },
      ".flex-row-reverse": { "flex-direction": "row-reverse" },
      ".flex-col": { "flex-direction": "column" },
      ".flex-col-reverse": { "flex-direction": "column-reverse" }
    }),
    ...addUtilities({
      ".flex-wrap": { "flex-wrap": "wrap" },
      ".flex-wrap-reverse": { "flex-wrap": "wrap-reverse" },
      ".flex-nowrap": { "flex-wrap": "nowrap" }
    }),
    ...addUtilities({
      ".place-content-center": { "place-content": "center" },
      ".place-content-start": { "place-content": "start" },
      ".place-content-end": { "place-content": "end" },
      ".place-content-between": { "place-content": "space-between" },
      ".place-content-around": { "place-content": "space-around" },
      ".place-content-evenly": { "place-content": "space-evenly" },
      ".place-content-baseline": { "place-content": "baseline" },
      ".place-content-stretch": { "place-content": "stretch" }
    }),
    ...addUtilities({
      ".place-items-start": { "place-items": "start" },
      ".place-items-end": { "place-items": "end" },
      ".place-items-center": { "place-items": "center" },
      ".place-items-baseline": { "place-items": "baseline" },
      ".place-items-stretch": { "place-items": "stretch" }
    }),
    ...addUtilities({
      ".content-normal": { "align-content": "normal" },
      ".content-center": { "align-content": "center" },
      ".content-start": { "align-content": "flex-start" },
      ".content-end": { "align-content": "flex-end" },
      ".content-between": { "align-content": "space-between" },
      ".content-around": { "align-content": "space-around" },
      ".content-evenly": { "align-content": "space-evenly" },
      ".content-baseline": { "align-content": "baseline" },
      ".content-stretch": { "align-content": "stretch" }
    }),
    ...addUtilities({
      ".items-start": { "align-items": "flex-start" },
      ".items-end": { "align-items": "flex-end" },
      ".items-center": { "align-items": "center" },
      ".items-baseline": { "align-items": "baseline" },
      ".items-stretch": { "align-items": "stretch" }
    }),
    ...addUtilities({
      ".justify-normal": { "justify-content": "normal" },
      ".justify-start": { "justify-content": "flex-start" },
      ".justify-end": { "justify-content": "flex-end" },
      ".justify-center": { "justify-content": "center" },
      ".justify-between": { "justify-content": "space-between" },
      ".justify-around": { "justify-content": "space-around" },
      ".justify-evenly": { "justify-content": "space-evenly" },
      ".justify-stretch": { "justify-content": "stretch" }
    }),
    ...addUtilities({
      ".justify-items-start": { "justify-items": "start" },
      ".justify-items-end": { "justify-items": "end" },
      ".justify-items-center": { "justify-items": "center" },
      ".justify-items-stretch": { "justify-items": "stretch" }
    }),
    ...createUtilityPlugin("gap", [
      [["gap", ["gap"]]],
      [
        ["gap-x", ["columnGap"]],
        ["gap-y", ["rowGap"]]
      ]
    ]),
    ...matchUtilities(
      {
        "space-x": (raw) => {
          const value = raw === "0" ? "0px" : raw;
          return {
            "& > :not([hidden]) ~ :not([hidden])": {
              "--tw-space-x-reverse": "0",
              "margin-right": `calc(${value} * var(--tw-space-x-reverse))`,
              "margin-left": `calc(${value} * calc(1 - var(--tw-space-x-reverse)))`
            }
          };
        },
        "space-y": (raw) => {
          const value = raw === "0" ? "0px" : raw;
          return {
            "& > :not([hidden]) ~ :not([hidden])": {
              "--tw-space-y-reverse": "0",
              "margin-top": `calc(${value} * calc(1 - var(--tw-space-y-reverse)))`,
              "margin-bottom": `calc(${value} * var(--tw-space-y-reverse))`
            }
          };
        }
      },
      { values: theme.space, supportsNegativeValues: true }
    ),
    ...addUtilities({
      ".space-y-reverse > :not([hidden]) ~ :not([hidden])": { "--tw-space-y-reverse": "1" },
      ".space-x-reverse > :not([hidden]) ~ :not([hidden])": { "--tw-space-x-reverse": "1" }
    }),
    ...matchUtilities(
      {
        "divide-x": (raw) => {
          const value = raw === "0" ? "0px" : raw;
          return {
            "& > :not([hidden]) ~ :not([hidden])": {
              "--tw-divide-x-reverse": "0",
              "border-right-width": `calc(${value} * var(--tw-divide-x-reverse))`,
              "border-left-width": `calc(${value} * calc(1 - var(--tw-divide-x-reverse)))`
            }
          };
        },
        "divide-y": (raw) => {
          const value = raw === "0" ? "0px" : raw;
          return {
            "& > :not([hidden]) ~ :not([hidden])": {
              "--tw-divide-y-reverse": "0",
              "border-top-width": `calc(${value} * calc(1 - var(--tw-divide-y-reverse)))`,
              "border-bottom-width": `calc(${value} * var(--tw-divide-y-reverse))`
            }
          };
        }
      },
      { values: theme.divideWidth, type: ["line-width", "length", "any"] }
    ),
    ...addUtilities({
      ".divide-y-reverse > :not([hidden]) ~ :not([hidden])": { "--tw-divide-y-reverse": "1" },
      ".divide-x-reverse > :not([hidden]) ~ :not([hidden])": { "--tw-divide-x-reverse": "1" }
    }),
    ...addUtilities(
      Object.fromEntries(
        ["solid", "dashed", "dotted", "double", "none"].map((style) => [
          `.divide-${style} > :not([hidden]) ~ :not([hidden])`,
          { "border-style": style }
        ])
      )
    ),
    ...colorUtility(
      "divide",
      "divideColor",
      (value) => ({
        "& > :not([hidden]) ~ :not([hidden])": withAlphaVariable(
          value,
          "border-color",
          "--tw-divide-opacity"
        )
      }),
      { dropDefault: true }
    ),
    ...matchUtilities(
      {
        "divide-opacity": (value) => ({
          "& > :not([hidden]) ~ :not([hidden])": { "--tw-divide-opacity": value }
        })
      },
      { values: theme.divideOpacity }
    ),
    ...addUtilities({
      ".place-self-auto": { "place-self": "auto" },
      ".place-self-start": { "place-self": "start" },
      ".place-self-end": { "place-self": "end" },
      ".place-self-center": { "place-self": "center" },
      ".place-self-stretch": { "place-self": "stretch" }
    }),
    ...addUtilities({
      ".self-auto": { "align-self": "auto" },
      ".self-start": { "align-self": "flex-start" },
      ".self-end": { "align-self": "flex-end" },
      ".self-center": { "align-self": "center" },
      ".self-stretch": { "align-self": "stretch" },
      ".self-baseline": { "align-self": "baseline" }
    }),
    ...addUtilities({
      ".justify-self-auto": { "justify-self": "auto" },
      ".justify-self-start": { "justify-self": "start" },
      ".justify-self-end": { "justify-self": "end" },
      ".justify-self-center": { "justify-self": "center" },
      ".justify-self-stretch": { "justify-self": "stretch" }
    }),
    ...addUtilities(
      Object.fromEntries(
        ["", "-x", "-y"].flatMap(
          (axis) => ["auto", "hidden", "clip", "visible", "scroll"].map((value) => [
            `.overflow${axis}-${value}`,
            { [`overflow${axis}`]: value }
          ])
        )
      )
    ),
    ...addUtilities(
      Object.fromEntries(
        ["", "-y", "-x"].flatMap(
          (axis) => ["auto", "contain", "none"].map((value) => [
            `.overscroll${axis}-${value}`,
            { [`overscroll-behavior${axis}`]: value }
          ])
        )
      )
    ),
    ...addUtilities({
      ".scroll-auto": { "scroll-behavior": "auto" },
      ".scroll-smooth": { "scroll-behavior": "smooth" }
    }),
    ...addUtilities({
      ".truncate": { overflow: "hidden", "text-overflow": "ellipsis", "white-space": "nowrap" },
      ".overflow-ellipsis": { "text-overflow": "ellipsis" },
      ".text-ellipsis": { "text-overflow": "ellipsis" },
      ".text-clip": { "text-overflow": "clip" }
    }),
    ...addUtilities({
      ".hyphens-none": { hyphens: "none" },
      ".hyphens-manual": { hyphens: "manual" },
      ".hyphens-auto": { hyphens: "auto" }
    }),
    ...addUtilities(
      Object.fromEntries(
        ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"].map((value) => [
          `.whitespace-${value}`,
          { "white-space": value }
        ])
      )
    ),
    ...addUtilities({
      ".text-wrap": { "text-wrap": "wrap" },
      ".text-nowrap": { "text-wrap": "nowrap" },
      ".text-balance": { "text-wrap": "balance" },
      ".text-pretty": { "text-wrap": "pretty" }
    }),
    ...addUtilities({
      ".break-normal": { "overflow-wrap": "normal", "word-break": "normal" },
      ".break-words": { "overflow-wrap": "break-word" },
      ".break-all": { "word-break": "break-all" },
      ".break-keep": { "word-break": "keep-all" }
    }),
    ...createUtilityPlugin("borderRadius", [
      [["rounded", ["border-radius"]]],
      [
        ["rounded-s", ["border-start-start-radius", "border-end-start-radius"]],
        ["rounded-e", ["border-start-end-radius", "border-end-end-radius"]],
        ["rounded-t", ["border-top-left-radius", "border-top-right-radius"]],
        ["rounded-r", ["border-top-right-radius", "border-bottom-right-radius"]],
        ["rounded-b", ["border-bottom-right-radius", "border-bottom-left-radius"]],
        ["rounded-l", ["border-top-left-radius", "border-bottom-left-radius"]]
      ],
      [
        ["rounded-ss", ["border-start-start-radius"]],
        ["rounded-se", ["border-start-end-radius"]],
        ["rounded-ee", ["border-end-end-radius"]],
        ["rounded-es", ["border-end-start-radius"]],
        ["rounded-tl", ["border-top-left-radius"]],
        ["rounded-tr", ["border-top-right-radius"]],
        ["rounded-br", ["border-bottom-right-radius"]],
        ["rounded-bl", ["border-bottom-left-radius"]]
      ]
    ]),
    ...createUtilityPlugin(
      "borderWidth",
      [
        [["border", ["border-width"]]],
        [
          ["border-x", ["border-left-width", "border-right-width"]],
          ["border-y", ["border-top-width", "border-bottom-width"]]
        ],
        [
          ["border-s", ["border-inline-start-width"]],
          ["border-e", ["border-inline-end-width"]],
          ["border-t", ["border-top-width"]],
          ["border-r", ["border-right-width"]],
          ["border-b", ["border-bottom-width"]],
          ["border-l", ["border-left-width"]]
        ]
      ],
      { type: ["line-width", "length"] }
    ),
    ...addUtilities(
      Object.fromEntries(
        ["solid", "dashed", "dotted", "double", "hidden", "none"].map((style) => [
          `.border-${style}`,
          { "border-style": style }
        ])
      )
    ),
    ...colorUtility(
      "border",
      "borderColor",
      (value) => withAlphaVariable(value, "border-color", "--tw-border-opacity"),
      { dropDefault: true }
    ),
    ...matchUtilities(
      {
        "border-x": (value) => withAlphaVariable(
          value,
          ["border-left-color", "border-right-color"],
          "--tw-border-opacity"
        ),
        "border-y": (value) => withAlphaVariable(
          value,
          ["border-top-color", "border-bottom-color"],
          "--tw-border-opacity"
        )
      },
      { values: withoutDefault(colors("borderColor")), type: ["color", "any"] }
    ),
    ...matchUtilities(
      {
        "border-s": (value) => withAlphaVariable(value, "border-inline-start-color", "--tw-border-opacity"),
        "border-e": (value) => withAlphaVariable(value, "border-inline-end-color", "--tw-border-opacity"),
        "border-t": (value) => withAlphaVariable(value, "border-top-color", "--tw-border-opacity"),
        "border-r": (value) => withAlphaVariable(value, "border-right-color", "--tw-border-opacity"),
        "border-b": (value) => withAlphaVariable(value, "border-bottom-color", "--tw-border-opacity"),
        "border-l": (value) => withAlphaVariable(value, "border-left-color", "--tw-border-opacity")
      },
      { values: withoutDefault(colors("borderColor")), type: ["color", "any"] }
    ),
    ...createUtilityPlugin("borderOpacity", [[["border-opacity", ["--tw-border-opacity"]]]]),
    ...colorUtility(
      "bg",
      "backgroundColor",
      (value) => withAlphaVariable(value, "background-color", "--tw-bg-opacity")
    ),
    ...createUtilityPlugin("backgroundOpacity", [[["bg-opacity", ["--tw-bg-opacity"]]]]),
    ...createUtilityPlugin("backgroundImage", [[["bg", ["background-image"]]]], {
      type: ["lookup", "image", "url"]
    }),
    ...gradientColorStops(),
    ...addUtilities({
      ".decoration-slice": { "box-decoration-break": "slice" },
      ".decoration-clone": { "box-decoration-break": "clone" },
      ".box-decoration-slice": { "box-decoration-break": "slice" },
      ".box-decoration-clone": { "box-decoration-break": "clone" }
    }),
    ...createUtilityPlugin("backgroundSize", [[["bg", ["background-size"]]]], {
      type: ["lookup", "length", "percentage", "size"]
    }),
    ...addUtilities({
      ".bg-fixed": { "background-attachment": "fixed" },
      ".bg-local": { "background-attachment": "local" },
      ".bg-scroll": { "background-attachment": "scroll" }
    }),
    ...addUtilities({
      ".bg-clip-border": { "background-clip": "border-box" },
      ".bg-clip-padding": { "background-clip": "padding-box" },
      ".bg-clip-content": { "background-clip": "content-box" },
      ".bg-clip-text": { "background-clip": "text" }
    }),
    ...createUtilityPlugin("backgroundPosition", [[["bg", ["background-position"]]]], {
      type: ["lookup", ["position", { preferOnConflict: true }]]
    }),
    ...addUtilities({
      ".bg-repeat": { "background-repeat": "repeat" },
      ".bg-no-repeat": { "background-repeat": "no-repeat" },
      ".bg-repeat-x": { "background-repeat": "repeat-x" },
      ".bg-repeat-y": { "background-repeat": "repeat-y" },
      ".bg-repeat-round": { "background-repeat": "round" },
      ".bg-repeat-space": { "background-repeat": "space" }
    }),
    ...addUtilities({
      ".bg-origin-border": { "background-origin": "border-box" },
      ".bg-origin-padding": { "background-origin": "padding-box" },
      ".bg-origin-content": { "background-origin": "content-box" }
    }),
    ...colorUtility("fill", "fill", (value) => ({ fill: toColorValue(value) })),
    ...colorUtility("stroke", "stroke", (value) => ({ stroke: toColorValue(value) }), {
      type: ["color", "url", "any"]
    }),
    ...createUtilityPlugin("strokeWidth", [[["stroke", ["stroke-width"]]]], {
      type: ["length", "number", "percentage"]
    }),
    ...addUtilities(
      Object.fromEntries(
        ["contain", "cover", "fill", "none", "scale-down"].map((fit) => [
          `.object-${fit}`,
          { "object-fit": fit }
        ])
      )
    ),
    ...createUtilityPlugin("objectPosition", [[["object", ["object-position"]]]]),
    ...createUtilityPlugin("padding", [
      [["p", ["padding"]]],
      [
        ["px", ["padding-left", "padding-right"]],
        ["py", ["padding-top", "padding-bottom"]]
      ],
      [
        ["ps", ["padding-inline-start"]],
        ["pe", ["padding-inline-end"]],
        ["pt", ["padding-top"]],
        ["pr", ["padding-right"]],
        ["pb", ["padding-bottom"]],
        ["pl", ["padding-left"]]
      ]
    ]),
    ...addUtilities(
      Object.fromEntries(
        ["left", "center", "right", "justify", "start", "end"].map((align) => [
          `.text-${align}`,
          { "text-align": align }
        ])
      )
    ),
    ...createUtilityPlugin("textIndent", [[["indent", ["text-indent"]]]], {
      supportsNegativeValues: true
    }),
    ...addUtilities(
      Object.fromEntries(
        [
          "baseline",
          "top",
          "middle",
          "bottom",
          "text-top",
          "text-bottom",
          "sub",
          "super"
        ].map((align) => [`.align-${align}`, { "vertical-align": align }])
      )
    ),
    ...matchUtilities({ align: (value) => ({ "vertical-align": value }) }),
    ...matchUtilities(
      {
        font: (value) => {
          const [families, options = {}] = Array.isArray(value) && isPlainObject2(value[1]) ? value : [value];
          return {
            "font-family": Array.isArray(families) ? families.join(", ") : families,
            "font-feature-settings": options.fontFeatureSettings,
            "font-variation-settings": options.fontVariationSettings
          };
        }
      },
      { values: theme.fontFamily, type: ["lookup", "generic-name", "family-name"] }
    ),
    ...matchUtilities(
      {
        text: (value, { modifier }) => {
          const [fontSize, options] = Array.isArray(value) ? value : [value];
          if (modifier) return { "font-size": fontSize, "line-height": modifier };
          const { lineHeight, letterSpacing, fontWeight } = isPlainObject2(options) ? options : { lineHeight: options };
          return {
            "font-size": fontSize,
            "line-height": lineHeight,
            "letter-spacing": letterSpacing,
            "font-weight": fontWeight
          };
        }
      },
      {
        values: theme.fontSize,
        modifiers: theme.lineHeight,
        type: ["absolute-size", "relative-size", "length", "percentage"]
      }
    ),
    ...createUtilityPlugin("fontWeight", [[["font", ["fontWeight"]]]], {
      type: ["lookup", "number", "any"]
    }),
    ...addUtilities({
      ".uppercase": { "text-transform": "uppercase" },
      ".lowercase": { "text-transform": "lowercase" },
      ".capitalize": { "text-transform": "capitalize" },
      ".normal-case": { "text-transform": "none" }
    }),
    ...addUtilities({
      ".italic": { "font-style": "italic" },
      ".not-italic": { "font-style": "normal" }
    }),
    ...addUtilities({
      ".normal-nums": { "font-variant-numeric": "normal" },
      ...Object.fromEntries(
        [
          ["ordinal", "ordinal"],
          ["slashed-zero", "slashed-zero"],
          ["lining-nums", "numeric-figure"],
          ["oldstyle-nums", "numeric-figure"],
          ["proportional-nums", "numeric-spacing"],
          ["tabular-nums", "numeric-spacing"],
          ["diagonal-fractions", "numeric-fraction"],
          ["stacked-fractions", "numeric-fraction"]
        ].map(([name, variable]) => [
          `.${name}`,
          { [`--tw-${variable}`]: name, "font-variant-numeric": CSS_FONT_VARIANT_NUMERIC }
        ])
      )
    }),
    ...createUtilityPlugin("lineHeight", [[["leading", ["lineHeight"]]]]),
    ...createUtilityPlugin("letterSpacing", [[["tracking", ["letterSpacing"]]]], {
      supportsNegativeValues: true
    }),
    ...colorUtility(
      "text",
      "textColor",
      (value) => withAlphaVariable(value, "color", "--tw-text-opacity")
    ),
    ...createUtilityPlugin("textOpacity", [[["text-opacity", ["--tw-text-opacity"]]]]),
    ...addUtilities({
      ".underline": { "text-decoration-line": "underline" },
      ".overline": { "text-decoration-line": "overline" },
      ".line-through": { "text-decoration-line": "line-through" },
      ".no-underline": { "text-decoration-line": "none" }
    }),
    ...colorUtility("decoration", "textDecorationColor", (value) => ({
      "text-decoration-color": toColorValue(value)
    })),
    ...addUtilities(
      Object.fromEntries(
        ["solid", "double", "dotted", "dashed", "wavy"].map((style) => [
          `.decoration-${style}`,
          { "text-decoration-style": style }
        ])
      )
    ),
    ...createUtilityPlugin(
      "textDecorationThickness",
      [[["decoration", ["text-decoration-thickness"]]]],
      { type: ["length", "percentage"] }
    ),
    ...createUtilityPlugin(
      "textUnderlineOffset",
      [[["underline-offset", ["text-underline-offset"]]]],
      { type: ["length", "percentage", "any"] }
    ),
    ...addUtilities({
      ".antialiased": {
        "-webkit-font-smoothing": "antialiased",
        "-moz-osx-font-smoothing": "grayscale"
      },
      ".subpixel-antialiased": {
        "-webkit-font-smoothing": "auto",
        "-moz-osx-font-smoothing": "auto"
      }
    }),
    ...colorUtility("placeholder", "placeholderColor", (value) => ({
      "&::placeholder": withAlphaVariable(value, "color", "--tw-placeholder-opacity")
    })),
    ...matchUtilities(
      {
        "placeholder-opacity": (value) => ({
          "&::placeholder": { "--tw-placeholder-opacity": value }
        })
      },
      { values: theme.placeholderOpacity }
    ),
    ...colorUtility("caret", "caretColor", (value) => ({ "caret-color": toColorValue(value) })),
    ...colorUtility("accent", "accentColor", (value) => ({ "accent-color": toColorValue(value) })),
    ...createUtilityPlugin("opacity", [[["opacity", ["opacity"]]]]),
    ...addUtilities(
      Object.fromEntries(
        [
          "normal",
          "multiply",
          "screen",
          "overlay",
          "darken",
          "lighten",
          "color-dodge",
          "color-burn",
          "hard-light",
          "soft-light",
          "difference",
          "exclusion",
          "hue",
          "saturation",
          "color",
          "luminosity"
        ].map((mode) => [`.bg-blend-${mode}`, { "background-blend-mode": mode }])
      )
    ),
    ...addUtilities(
      Object.fromEntries(
        [
          "normal",
          "multiply",
          "screen",
          "overlay",
          "darken",
          "lighten",
          "color-dodge",
          "color-burn",
          "hard-light",
          "soft-light",
          "difference",
          "exclusion",
          "hue",
          "saturation",
          "color",
          "luminosity",
          "plus-lighter"
        ].map((mode) => [`.mix-blend-${mode}`, { "mix-blend-mode": mode }])
      )
    ),
    ...matchUtilities(
      {
        shadow: (raw) => {
          const value = boxShadowValue(raw);
          const ast = parseBoxShadowValue(value);
          for (const parsed of ast) if (parsed.valid) parsed.color = "var(--tw-shadow-color)";
          return {
            "--tw-shadow": value === "none" ? "0 0 #0000" : value,
            "--tw-shadow-colored": value === "none" ? "0 0 #0000" : formatBoxShadowValue(ast),
            "box-shadow": "var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)"
          };
        }
      },
      { values: theme.boxShadow, type: ["shadow"] }
    ),
    ...colorUtility("shadow", "boxShadowColor", (value) => ({
      "--tw-shadow-color": toColorValue(value),
      "--tw-shadow": "var(--tw-shadow-colored)"
    })),
    ...addUtilities({
      ".outline-none": { outline: "2px solid transparent", "outline-offset": "2px" },
      ".outline": { "outline-style": "solid" },
      ".outline-dashed": { "outline-style": "dashed" },
      ".outline-dotted": { "outline-style": "dotted" },
      ".outline-double": { "outline-style": "double" }
    }),
    ...createUtilityPlugin("outlineWidth", [[["outline", ["outline-width"]]]], {
      type: ["length", "number", "percentage"]
    }),
    ...createUtilityPlugin("outlineOffset", [[["outline-offset", ["outline-offset"]]]], {
      type: ["length", "number", "percentage", "any"],
      supportsNegativeValues: true
    }),
    ...colorUtility("outline", "outlineColor", (value) => ({
      "outline-color": toColorValue(value)
    })),
    ...matchUtilities(
      {
        ring: (value) => ({
          "--tw-ring-offset-shadow": "var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)",
          "--tw-ring-shadow": `var(--tw-ring-inset) 0 0 0 calc(${value} + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
          "box-shadow": "var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)"
        })
      },
      { values: theme.ringWidth, type: "length" }
    ),
    ...addUtilities({ ".ring-inset": { "--tw-ring-inset": "inset" } }),
    ...colorUtility(
      "ring",
      "ringColor",
      (value) => withAlphaVariable(value, "--tw-ring-color", "--tw-ring-opacity"),
      { dropDefault: true }
    ),
    ...createUtilityPlugin("ringOpacity", [[["ring-opacity", ["--tw-ring-opacity"]]]], {
      filterDefault: true
    }),
    ...createUtilityPlugin("ringOffsetWidth", [[["ring-offset", ["--tw-ring-offset-width"]]]], {
      type: "length"
    }),
    ...colorUtility("ring-offset", "ringOffsetColor", (value) => ({
      "--tw-ring-offset-color": toColorValue(value)
    })),
    ...filter("blur", "blur"),
    ...filter("brightness", "brightness"),
    ...filter("contrast", "contrast"),
    ...matchUtilities(
      {
        "drop-shadow": (value) => ({
          "--blade-drop-shadow": Array.isArray(value) ? value.map((shadow2) => `drop-shadow(${shadow2})`).join(" ") : `drop-shadow(${value})`,
          filter: CSS_FILTER
        })
      },
      { values: theme.dropShadow }
    ),
    ...filter("grayscale", "grayscale"),
    ...filter("hue-rotate", "hueRotate", "hue-rotate", true),
    ...filter("invert", "invert"),
    ...filter("saturate", "saturate"),
    ...filter("sepia", "sepia"),
    ...addUtilities({
      ".filter": { filter: CSS_FILTER },
      ".filter-none": { filter: "none" }
    }),
    ...backdrop("blur", "backdropBlur", "blur"),
    ...backdrop("brightness", "backdropBrightness", "brightness"),
    ...backdrop("contrast", "backdropContrast", "contrast"),
    ...backdrop("grayscale", "backdropGrayscale", "grayscale"),
    ...backdrop("hue-rotate", "backdropHueRotate", "hue-rotate", true),
    ...backdrop("invert", "backdropInvert", "invert"),
    ...backdrop("opacity", "backdropOpacity", "opacity"),
    ...backdrop("saturate", "backdropSaturate", "saturate"),
    ...backdrop("sepia", "backdropSepia", "sepia"),
    ...addUtilities({
      ".backdrop-filter": { "backdrop-filter": CSS_BACKDROP_FILTER },
      ".backdrop-filter-none": { "backdrop-filter": "none" }
    }),
    ...matchUtilities(
      {
        transition: (value) => ({
          "transition-property": value,
          ...value === "none" ? {} : {
            "transition-timing-function": theme.transitionTimingFunction?.DEFAULT,
            "transition-duration": theme.transitionDuration?.DEFAULT
          }
        })
      },
      { values: theme.transitionProperty }
    ),
    ...createUtilityPlugin("transitionDelay", [[["delay", ["transitionDelay"]]]]),
    ...createUtilityPlugin("transitionDuration", [[["duration", ["transitionDuration"]]]], {
      filterDefault: true
    }),
    ...createUtilityPlugin("transitionTimingFunction", [[["ease", ["transitionTimingFunction"]]]], {
      filterDefault: true
    }),
    ...createUtilityPlugin("willChange", [[["will-change", ["will-change"]]]]),
    ...createUtilityPlugin("content", [
      [["content", ["--tw-content", ["content", "var(--tw-content)"]]]]
    ]),
    ...addUtilities({
      ".forced-color-adjust-auto": { "forced-color-adjust": "auto" },
      ".forced-color-adjust-none": { "forced-color-adjust": "none" }
    })
  ];
  function gradientColorStops() {
    const transparentTo = (value) => withAlphaValue(value, "0", "rgb(255 255 255 / 0)");
    const options = { values: colors("gradientColorStops"), type: ["color", "any"] };
    const positionOptions = {
      values: theme.gradientColorStopPositions,
      type: ["length", "percentage"]
    };
    return [
      ...matchUtilities(
        {
          from: (value) => ({
            "--tw-gradient-from": `${toColorValue(value)} var(--tw-gradient-from-position)`,
            "--tw-gradient-to": `${transparentTo(value)} var(--tw-gradient-to-position)`,
            "--tw-gradient-stops": "var(--tw-gradient-from), var(--tw-gradient-to)"
          })
        },
        options
      ),
      ...matchUtilities(
        { from: (value) => ({ "--tw-gradient-from-position": value }) },
        positionOptions
      ),
      ...matchUtilities(
        {
          via: (value) => ({
            "--tw-gradient-to": `${transparentTo(value)}  var(--tw-gradient-to-position)`,
            "--tw-gradient-stops": `var(--tw-gradient-from), ${toColorValue(
              value
            )} var(--tw-gradient-via-position), var(--tw-gradient-to)`
          })
        },
        options
      ),
      ...matchUtilities(
        { via: (value) => ({ "--tw-gradient-via-position": value }) },
        positionOptions
      ),
      ...matchUtilities(
        {
          to: (value) => ({
            "--tw-gradient-to": `${toColorValue(value)} var(--tw-gradient-to-position)`
          })
        },
        options
      ),
      ...matchUtilities(
        { to: (value) => ({ "--tw-gradient-to-position": value }) },
        positionOptions
      )
    ];
  }
}

// uno/tailwind/preflight.ts
var isPlainObject3 = (value) => Object.prototype.toString.call(value) === "[object Object]";
var family = (value, fallback) => {
  if (value === void 0) return fallback;
  const families = Array.isArray(value) && isPlainObject3(value[1]) ? value[0] : value;
  return Array.isArray(families) ? families.join(", ") : String(families);
};
var fontOption = (value, option) => Array.isArray(value) && isPlainObject3(value[1]) && value[1][option] !== void 0 ? String(value[1][option]) : "normal";
var preflightCSS = (theme) => `/*! tailwindcss v3.4.1 | MIT License | https://tailwindcss.com */
/*
1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)
2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)
*/

*,
::before,
::after {
  box-sizing: border-box; /* 1 */
  border-width: 0; /* 2 */
  border-style: solid; /* 2 */
  border-color: ${toColorValue(String(theme.borderColor?.DEFAULT ?? "currentColor"))}; /* 2 */
}

::before,
::after {
  --tw-content: '';
}

/*
1. Use a consistent sensible line-height in all browsers.
2. Prevent adjustments of font size after orientation changes in iOS.
3. Use a more readable tab size.
4. Use the user's configured \`sans\` font-family by default.
5. Use the user's configured \`sans\` font-feature-settings by default.
6. Use the user's configured \`sans\` font-variation-settings by default.
7. Disable tap highlights on iOS
*/

html,
:host {
  line-height: 1.5; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
  -moz-tab-size: 4; /* 3 */
  tab-size: 4; /* 3 */
  font-family: ${family(
  theme.fontFamily?.sans,
  'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
)}; /* 4 */
  font-feature-settings: ${fontOption(theme.fontFamily?.sans, "fontFeatureSettings")}; /* 5 */
  font-variation-settings: ${fontOption(theme.fontFamily?.sans, "fontVariationSettings")}; /* 6 */
  -webkit-tap-highlight-color: transparent; /* 7 */
}

/*
1. Remove the margin in all browsers.
2. Inherit line-height from \`html\` so users can set them as a class directly on the \`html\` element.
*/

body {
  margin: 0; /* 1 */
  line-height: inherit; /* 2 */
}

/*
1. Add the correct height in Firefox.
2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
3. Ensure horizontal rules are visible by default.
*/

hr {
  height: 0; /* 1 */
  color: inherit; /* 2 */
  border-top-width: 1px; /* 3 */
}

/*
Add the correct text decoration in Chrome, Edge, and Safari.
*/

abbr:where([title]) {
  text-decoration: underline dotted;
}

/*
Remove the default font size and weight for headings.
*/

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: inherit;
  font-weight: inherit;
}

/*
Reset links to optimize for opt-in styling instead of opt-out.
*/

a {
  color: inherit;
  text-decoration: inherit;
}

/*
Add the correct font weight in Edge and Safari.
*/

b,
strong {
  font-weight: bolder;
}

/*
1. Use the user's configured \`mono\` font-family by default.
2. Use the user's configured \`mono\` font-feature-settings by default.
3. Use the user's configured \`mono\` font-variation-settings by default.
4. Correct the odd \`em\` font sizing in all browsers.
*/

code,
kbd,
samp,
pre {
  font-family: ${family(
  theme.fontFamily?.mono,
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
)}; /* 1 */
  font-feature-settings: ${fontOption(theme.fontFamily?.mono, "fontFeatureSettings")}; /* 2 */
  font-variation-settings: ${fontOption(theme.fontFamily?.mono, "fontVariationSettings")}; /* 3 */
  font-size: 1em; /* 4 */
}

/*
Add the correct font size in all browsers.
*/

small {
  font-size: 80%;
}

/*
Prevent \`sub\` and \`sup\` elements from affecting the line height in all browsers.
*/

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

/*
1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
3. Remove gaps between table borders by default.
*/

table {
  text-indent: 0; /* 1 */
  border-color: inherit; /* 2 */
  border-collapse: collapse; /* 3 */
}

/*
1. Change the font styles in all browsers.
2. Remove the margin in Firefox and Safari.
3. Remove default padding in all browsers.
*/

button,
input,
optgroup,
select,
textarea {
  font-family: inherit; /* 1 */
  font-feature-settings: inherit; /* 1 */
  font-variation-settings: inherit; /* 1 */
  font-size: 100%; /* 1 */
  font-weight: inherit; /* 1 */
  line-height: inherit; /* 1 */
  color: inherit; /* 1 */
  margin: 0; /* 2 */
  padding: 0; /* 3 */
}

/*
Remove the inheritance of text transform in Edge and Firefox.
*/

button,
select {
  text-transform: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Remove default button styles.
*/

button,
[type='button'],
[type='reset'],
[type='submit'] {
  -webkit-appearance: button; /* 1 */
  background-color: transparent; /* 2 */
  background-image: none; /* 2 */
}

/*
Use the modern Firefox focus style for all focusable elements.
*/

:-moz-focusring {
  outline: auto;
}

/*
Remove the additional \`:invalid\` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)
*/

:-moz-ui-invalid {
  box-shadow: none;
}

/*
Add the correct vertical alignment in Chrome and Firefox.
*/

progress {
  vertical-align: baseline;
}

/*
Correct the cursor style of increment and decrement buttons in Safari.
*/

::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
  height: auto;
}

/*
1. Correct the odd appearance in Chrome and Safari.
2. Correct the outline style in Safari.
*/

[type='search'] {
  -webkit-appearance: textfield; /* 1 */
  outline-offset: -2px; /* 2 */
}

/*
Remove the inner padding in Chrome and Safari on macOS.
*/

::-webkit-search-decoration {
  -webkit-appearance: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Change font properties to \`inherit\` in Safari.
*/

::-webkit-file-upload-button {
  -webkit-appearance: button; /* 1 */
  font: inherit; /* 2 */
}

/*
Add the correct display in Chrome and Safari.
*/

summary {
  display: list-item;
}

/*
Removes the default spacing and border for appropriate elements.
*/

blockquote,
dl,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
figure,
p,
pre {
  margin: 0;
}

fieldset {
  margin: 0;
  padding: 0;
}

legend {
  padding: 0;
}

ol,
ul,
menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

/*
Reset default styling for dialogs.
*/
dialog {
  padding: 0;
}

/*
Prevent resizing textareas horizontally by default.
*/

textarea {
  resize: vertical;
}

/*
1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
2. Set the default placeholder color to the user's configured gray 400 color.
*/

input::placeholder,
textarea::placeholder {
  opacity: 1; /* 1 */
  color: ${toColorValue(String(theme.colors?.gray?.["400"] ?? "#9ca3af"))}; /* 2 */
}

/*
Set the default cursor for buttons.
*/

button,
[role="button"] {
  cursor: pointer;
}

/*
Make sure disabled buttons don't get the pointer cursor.
*/
:disabled {
  cursor: default;
}

/*
1. Make replaced elements \`display: block\` by default. (https://github.com/mozdevs/cssremedy/issues/14)
2. Add \`vertical-align: middle\` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)
   This can trigger a poorly considered lint error in some tools but is included by design.
*/

img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
  display: block; /* 1 */
  vertical-align: middle; /* 2 */
}

/*
Constrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)
*/

img,
video {
  max-width: 100%;
  height: auto;
}

/* Make elements with the HTML hidden attribute stay hidden by default */
[hidden] {
  display: none;
}
`;
function defaultsCSS(theme) {
  const ringOpacity = theme.ringOpacity?.DEFAULT ?? "0.5";
  const ringColor = theme.ringColor?.DEFAULT ? withAlphaValue(
    theme.ringColor.DEFAULT,
    String(ringOpacity),
    `rgb(147 197 253 / ${ringOpacity})`
  ) : `rgb(147 197 253 / ${ringOpacity})`;
  const variables = {
    "--tw-border-spacing-x": "0",
    "--tw-border-spacing-y": "0",
    "--tw-pan-x": " ",
    "--tw-pan-y": " ",
    "--tw-pinch-zoom": " ",
    "--tw-scroll-snap-strictness": "proximity",
    "--tw-gradient-from-position": " ",
    "--tw-gradient-via-position": " ",
    "--tw-gradient-to-position": " ",
    "--tw-ordinal": " ",
    "--tw-slashed-zero": " ",
    "--tw-numeric-figure": " ",
    "--tw-numeric-spacing": " ",
    "--tw-numeric-fraction": " ",
    "--tw-ring-inset": " ",
    "--tw-ring-offset-width": String(theme.ringOffsetWidth?.DEFAULT ?? "0px"),
    "--tw-ring-offset-color": toColorValue(String(theme.ringOffsetColor?.DEFAULT ?? "#fff")),
    "--tw-ring-color": ringColor,
    "--tw-ring-offset-shadow": "0 0 #0000",
    "--tw-ring-shadow": "0 0 #0000",
    "--tw-shadow": "0 0 #0000",
    "--tw-shadow-colored": "0 0 #0000"
    // The filter variables are Blade's (`filterVariables`), as are transforms'.
  };
  const body = Object.entries(variables).map(([name, value]) => `  ${name}: ${value};`).join("\n");
  return `*, ::before, ::after {
${body}
}

::backdrop {
${body}
}
`;
}

// uno/tailwind/variants.ts
function customVariants(variants = {}) {
  return Object.entries(variants).map(
    ([name, template]) => {
      const prefix = `${name}:`;
      const handle = template.trim().startsWith("@") ? { parent: template.trim() } : { selector: (selector) => template.replace(/&/g, selector) };
      return {
        match: (matcher) => matcher.startsWith(prefix) ? { matcher: matcher.slice(prefix.length), ...handle } : void 0,
        multiPass: true
      };
    }
  );
}

// uno/config.ts
var px = (value) => typeof value === "number" ? `${value}px` : value;
var rules = (prefix, property, scale, format = px) => Object.entries(scale).map(([key, value]) => [`${prefix}-${key}`, { [property]: format(value) }]);
var rulesFor = (prefixToProperty, scale, format) => Object.entries(prefixToProperty).flatMap(
  ([prefix, property]) => rules(prefix, property, scale, format)
);
var bladePrefixed = (scale) => Object.fromEntries(Object.entries(scale).map(([key, value]) => [`blade-${key}`, value]));
var arbitrary = (value) => {
  const spaced = value.replace(/_/g, " ");
  if (!/(calc|clamp|min|max)\(/.test(spaced)) return spaced;
  const names = [];
  return spaced.replace(/--[\w-]+/g, (name) => `\0${names.push(name) - 1}\0`).replace(/(?<=[\w%).])\s*([+-])\s*(?=[\d.(]|\0|var\()/g, " $1 ").replace(/\0(\d+)\0/g, (_, index) => names[Number(index)]);
};
var keywords = (property, classToValue) => Object.entries(classToValue).map(([className, value]) => [className, { [property]: value }]);
var colorPropertyToUtility = {
  background: { prefix: "bg", property: "background-color" },
  border: { prefix: "border", property: "border-color" },
  text: { prefix: "text", property: "color" },
  icon: { prefix: "icon", property: "color" }
};
var isColorProperty = (segment) => segment in colorPropertyToUtility;
var excludedColorCategories = /* @__PURE__ */ new Set(["data"]);
var deprecatedColorTokens = /* @__PURE__ */ new Set([
  "--popup-background-subtle",
  "--popup-background-intense",
  "--popup-border-subtle",
  "--popup-border-intense"
]);
var themed = (token, value) => `var(--${token}, ${value})`;
var lightColors = (() => {
  const neutral = colorsToCSSVariables(bladeNeutralTheme.colors.onLight);
  return Object.fromEntries(
    Object.entries(colorsToCSSVariables(bladeTheme.colors.onLight)).map(([token, value]) => [
      token,
      value === "transparent" ? neutral[token] ?? value : value
    ])
  );
})();
var getColorRules = () => {
  const colorRules = [];
  for (const [cssVariable, value] of Object.entries(lightColors)) {
    const [category, colorProperty, ...rest] = cssVariable.replace(/^--/, "").split("-");
    if (excludedColorCategories.has(category) || deprecatedColorTokens.has(cssVariable)) continue;
    if (!colorProperty || !isColorProperty(colorProperty) || rest.length === 0) continue;
    const { prefix, property } = colorPropertyToUtility[colorProperty];
    const tokenValue = themed(cssVariable.replace(/^--/, ""), value);
    colorRules.push([[prefix, category, ...rest].join("-"), { [property]: tokenValue }]);
    if (colorProperty === "background") {
      colorRules.push([["accent", category, ...rest].join("-"), { "accent-color": tokenValue }]);
    }
    if (colorProperty === "border") {
      colorRules.push([["outline", category, ...rest].join("-"), { "outline-color": tokenValue }]);
    }
  }
  return colorRules;
};
var color2 = (token) => {
  const value = lightColors[`--${token}`];
  if (!value) throw new Error(`Unknown color token: ${token}`);
  return themed(token, value);
};
var colorKeywordRules = [
  ...keywords("background-color", {
    "bg-transparent": "transparent",
    "bg-current": "currentColor"
  }),
  ...keywords("border-color", {
    "border-transparent": "transparent",
    "border-current": "currentColor"
  }),
  ...keywords("border-top-color", { "border-t-transparent": "transparent" }),
  ...keywords("outline-color", {
    "outline-transparent": "transparent",
    "outline-current": "currentColor"
  }),
  ...keywords("color", { "text-current": "currentColor", "text-inherit": "inherit" }),
  ...keywords("fill", { "fill-none": "none", "fill-current": "currentColor" }),
  ...keywords("stroke", { "stroke-none": "none", "stroke-current": "currentColor" }),
  // Blade's ProgressBar draws its circular track and fill in background tokens
  ...keywords(
    "stroke",
    Object.fromEntries(
      [
        "feedback-background-neutral-subtle",
        "feedback-background-neutral-intense",
        "feedback-background-information-intense",
        "feedback-background-positive-intense",
        "feedback-background-notice-intense",
        "feedback-background-negative-intense",
        "surface-background-primary-intense"
      ].map((token) => [`stroke-${token.replace("-background", "")}`, color2(token)])
    )
  ),
  ...keywords("accent-color", { "accent-current": "currentColor" })
];
var spacing = bladePrefixed(bladeTheme.spacing);
var builtInSpacing = {
  ...Object.fromEntries(
    [
      0,
      0.5,
      1,
      1.5,
      2,
      2.5,
      3,
      3.5,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      14,
      16,
      20,
      24,
      28,
      32,
      36,
      40,
      44,
      48,
      52,
      56,
      60,
      64,
      72,
      80,
      96
    ].map((unit) => [unit, unit * 4])
  ),
  px: 1
};
var paddingAndMargin = {
  p: "padding",
  px: "padding-inline",
  py: "padding-block",
  pt: "padding-top",
  pr: "padding-right",
  pb: "padding-bottom",
  pl: "padding-left",
  m: "margin",
  mx: "margin-inline",
  my: "margin-block",
  mt: "margin-top",
  mr: "margin-right",
  mb: "margin-bottom",
  ml: "margin-left"
};
var negativeMargin = {
  "-m": "margin",
  "-mx": "margin-inline",
  "-my": "margin-block",
  "-mt": "margin-top",
  "-mr": "margin-right",
  "-mb": "margin-bottom",
  "-ml": "margin-left"
};
var gap = {
  gap: "gap",
  "gap-x": "column-gap",
  "gap-y": "row-gap"
};
var inset = {
  inset: "inset",
  "inset-x": "inset-inline",
  "inset-y": "inset-block",
  top: "top",
  right: "right",
  bottom: "bottom",
  left: "left"
};
var negativeInset = {
  "-inset": "inset",
  "-inset-x": "inset-inline",
  "-inset-y": "inset-block",
  "-top": "top",
  "-right": "right",
  "-bottom": "bottom",
  "-left": "left"
};
var negativePx = (value) => `-${px(value)}`;
var spacingRules = [
  ...rulesFor({ ...paddingAndMargin, ...gap, ...inset }, { ...spacing, ...builtInSpacing }),
  // Negative margins and insets, e.g. `-mt-blade-1` → -2px, `-top-1` → -4px
  ...rulesFor(
    { ...negativeMargin, ...negativeInset },
    { ...spacing, ...builtInSpacing },
    negativePx
  ),
  ...keywords("margin", { "m-auto": "auto" }),
  ...keywords("margin-inline", { "mx-auto": "auto" }),
  // Any other length is the value itself, as for sizes: `mt-[10px]`,
  // `-left-[9px]`, `top-[calc(50%+1px)]`.
  [
    /^(-?)(p[xytrbl]?|m[xytrbl]?|m[se]|gap(?:-[xy])?|inset(?:-[xy])?|top|right|bottom|left)-\[(.+)\]$/,
    ([, negative, prefix, value]) => {
      const property = {
        ...paddingAndMargin,
        ...gap,
        ...inset,
        ms: "margin-inline-start",
        me: "margin-inline-end"
      }[prefix];
      if (!property || negative && prefix.startsWith("p")) return void 0;
      const css = arbitrary(value);
      if (!negative) return { [property]: css };
      return { [property]: /^[\d.]+[a-z%]*$/.test(css) ? `-${css}` : `calc(${css} * -1)` };
    }
  ]
];
var sizeProperties = {
  w: "width",
  h: "height",
  "min-w": "min-width",
  "min-h": "min-height",
  "max-w": "max-width",
  "max-h": "max-height"
};
var sizeRules = [
  ...rulesFor(sizeProperties, { ...spacing, ...builtInSpacing, full: "100%", auto: "auto" }),
  [
    /^(w|h|min-w|min-h|max-w|max-h)-\[(.+)\]$/,
    ([, prefix, value]) => ({
      [sizeProperties[prefix]]: arbitrary(value)
    })
  ]
];
var borderRules = [
  // e.g. `rounded-medium` → 12px, `rounded-tl-small` → 8px
  ...rulesFor(
    {
      rounded: "border-radius",
      "rounded-tl": "border-top-left-radius",
      "rounded-tr": "border-top-right-radius",
      "rounded-br": "border-bottom-right-radius",
      "rounded-bl": "border-bottom-left-radius"
    },
    border.radius
  ),
  // e.g. `border-thin` → 1px, `border-t-thicker` → 2px
  ...rulesFor(
    {
      border: "border-width",
      "border-t": "border-top-width",
      "border-r": "border-right-width",
      "border-b": "border-bottom-width",
      "border-l": "border-left-width"
    },
    border.width
  ),
  // No preflight sets a default border style, so it needs to be set explicitly
  ...keywords("border-style", {
    "border-solid": "solid",
    "border-dashed": "dashed",
    "border-dotted": "dotted",
    "border-none": "none"
  })
];
var FILTER_FUNCTIONS = [
  "blur",
  "brightness",
  "contrast",
  "grayscale",
  "hue-rotate",
  "invert",
  "saturate",
  "sepia",
  "drop-shadow"
];
var BACKDROP_FILTER_FUNCTIONS = [
  "blur",
  "brightness",
  "contrast",
  "grayscale",
  "hue-rotate",
  "invert",
  "opacity",
  "saturate",
  "sepia"
];
var FILTER = FILTER_FUNCTIONS.map((name) => `var(--blade-${name})`).join(" ");
var BACKDROP_FILTER = BACKDROP_FILTER_FUNCTIONS.map(
  (name) => `var(--blade-backdrop-${name})`
).join(" ");
var filterVariables = {
  getCSS: () => `*, ::before, ::after { ${[
    ...FILTER_FUNCTIONS.map((name) => `--blade-${name}: ;`),
    ...BACKDROP_FILTER_FUNCTIONS.map((name) => `--blade-backdrop-${name}: ;`)
  ].join(" ")} }`
};
var effectRules = [
  // e.g. `shadow-midRaised`, light mode only
  ...rules("shadow", "box-shadow", elevation.onLight),
  // e.g. `backdrop-blur-medium` → blur(8px), composed (see `FILTER`)
  ...Object.entries(backdropBlur).map(
    ([key, value]) => [
      `backdrop-blur-${key}`,
      { "--blade-backdrop-blur": `blur(${px(value)})`, "backdrop-filter": BACKDROP_FILTER }
    ]
  )
];
var { fonts, lineHeights, letterSpacings } = typography.onDesktop;
var ROOT_FONT_SIZE = 16;
var round = (value) => Number(value.toFixed(4));
var rem = (value) => `${round(Number(value) / ROOT_FONT_SIZE)}rem`;
var weightNames = {
  regular: "normal",
  medium: "medium",
  semibold: "semibold",
  bold: "bold"
};
var APP_FONT_KEYS = {
  ...Object.fromEntries(
    Object.entries(weightNames).map(([, name]) => [`font-${name}`, ["fontWeight", name]])
  ),
  "font-sans": ["fontFamily", "sans"],
  "font-mono": ["fontFamily", "mono"]
};
function appFontClasses(themes) {
  const sets = (theme, section, key) => [theme[section], theme.extend?.[section]].some(
    (entries) => typeof entries === "object" && entries !== null && key in entries
  );
  return new Set(
    Object.entries(APP_FONT_KEYS).filter(([, [section, key]]) => themes.some((theme) => sets(theme, section, key))).map(([name]) => name)
  );
}
var fontRules = [
  ...Object.entries(fonts.weight).map(
    ([name, value]) => [
      `font-${weightNames[name] ?? name}`,
      { "font-weight": String(value) }
    ]
  ),
  ["font-sans", { "font-family": themed("font-family-text", fonts.family.text) }],
  ["font-mono", { "font-family": themed("font-family-code", fonts.family.code) }],
  [
    "font-heading",
    { "font-family": themed("font-family-heading", 'Tasa, "TASA Orbiter Fallback Arial", Arial') }
  ]
];
var typographyRules = [
  // e.g. `text-100` → 0.875rem (14px)
  ...rules("text", "font-size", fonts.size, rem),
  // e.g. `leading-100` → 1.25rem (20px)
  ...rules("leading", "line-height", lineHeights, rem),
  // `font-normal`…`font-bold`, `font-sans`, `font-mono`, `font-heading`.
  ...fontRules,
  // The face of Icon: the consumer's build makes `blade-icons` from the glyphs
  // it enables (src/plugin). A glyph is text, so this resets everything
  // text inherits that would bend it. The glyph itself is generated content
  // (`::before` from `data-glyph`), never a text node: an icon acts like an
  // image, not selectable, copyable or found by find-in-page.
  [
    /^icon-font$/,
    () => [
      {
        "font-family": "'blade-icons'",
        "font-style": "normal",
        "font-weight": "normal",
        "font-variant": "normal",
        "text-transform": "none",
        "letter-spacing": "normal",
        "line-height": "1",
        speak: "never",
        "-webkit-font-smoothing": "antialiased",
        "-moz-osx-font-smoothing": "grayscale",
        "-webkit-user-select": "none",
        "user-select": "none"
      },
      {
        [symbols2.selector]: (selector) => `${selector}::before`,
        content: "attr(data-glyph)"
      }
    ]
  ],
  // Icon without a font plugin: the SVG (its URL inline, as `mask-image`)
  // stencils a fill of the text colour. Both spellings: older WebViews and
  // Safari before 15.4 only read the prefixed one.
  [
    "icon-mask",
    {
      "background-color": "currentColor",
      "-webkit-mask-size": "contain",
      "mask-size": "contain",
      "-webkit-mask-repeat": "no-repeat",
      "mask-repeat": "no-repeat",
      "-webkit-mask-position": "center",
      "mask-position": "center"
    }
  ],
  // Tokens are % of the font size, e.g. `tracking-25` → -3.3% → -0.033em
  ...rules(
    "tracking",
    "letter-spacing",
    letterSpacings,
    (value) => `${round(Number(value) / 100)}em`
  )
];
var layoutRules = [
  ...keywords("display", {
    block: "block",
    "inline-block": "inline-block",
    inline: "inline",
    flex: "flex",
    "inline-flex": "inline-flex",
    grid: "grid",
    hidden: "none"
  }),
  ...keywords("position", {
    static: "static",
    relative: "relative",
    absolute: "absolute",
    fixed: "fixed",
    sticky: "sticky"
  }),
  ...keywords("flex-direction", {
    "flex-row": "row",
    "flex-row-reverse": "row-reverse",
    "flex-col": "column",
    "flex-col-reverse": "column-reverse"
  }),
  ...keywords("flex-wrap", {
    "flex-wrap": "wrap",
    "flex-nowrap": "nowrap"
  }),
  ...keywords("flex", { "flex-1": "1 1 0%", "flex-auto": "1 1 auto", "flex-none": "none" }),
  ...keywords("flex-grow", { grow: "1", "grow-0": "0" }),
  ...keywords("flex-shrink", { shrink: "1", "shrink-0": "0" }),
  ...keywords("align-items", {
    "items-start": "flex-start",
    "items-center": "center",
    "items-end": "flex-end",
    "items-baseline": "baseline",
    "items-stretch": "stretch"
  }),
  ...keywords("justify-content", {
    "justify-start": "flex-start",
    "justify-center": "center",
    "justify-end": "flex-end",
    "justify-between": "space-between",
    "justify-around": "space-around",
    "justify-evenly": "space-evenly"
  }),
  ...keywords("align-self", {
    "self-auto": "auto",
    "self-start": "flex-start",
    "self-center": "center",
    "self-end": "flex-end",
    "self-stretch": "stretch"
  }),
  ...keywords("overflow", {
    "overflow-auto": "auto",
    "overflow-hidden": "hidden",
    "overflow-visible": "visible",
    "overflow-scroll": "scroll"
  })
];
var fractions = {
  "1/2": "50%",
  "1/3": "33.333333%",
  "2/3": "66.666667%",
  "1/4": "25%",
  "3/4": "75%",
  "5/6": "83.333333%",
  full: "100%"
};
var fractionRules = [
  ...rulesFor(
    { ...inset, w: "width", h: "height", "max-w": "max-width", "max-h": "max-height" },
    fractions
  ),
  ...rulesFor(negativeInset, fractions, (value) => `-${value}`),
  ...keywords("width", { "w-max": "max-content", "w-min": "min-content", "w-fit": "fit-content" }),
  ...keywords("margin-inline-start", { "ms-auto": "auto" }),
  ...keywords("margin-inline-end", { "me-auto": "auto" }),
  // Logical margins, e.g. `ms-1` → 4px
  ...rulesFor(
    { ms: "margin-inline-start", me: "margin-inline-end" },
    { ...spacing, ...builtInSpacing }
  )
];
var opacityRules = [
  ...rules(
    "opacity",
    "opacity",
    Object.fromEntries(
      [
        0,
        5,
        10,
        15,
        20,
        25,
        30,
        35,
        40,
        45,
        50,
        55,
        60,
        65,
        70,
        75,
        80,
        85,
        90,
        95,
        100
      ].map((percent) => [percent, percent / 100])
    ),
    String
  ),
  [/^opacity-\[(.+)\]$/, ([, value]) => ({ opacity: arbitrary(value) })]
];
var zIndexRules = rules(
  "z",
  "z-index",
  Object.fromEntries([0, 1, 5, 10, 20, 30, 50, 60].map((z) => [z, z])),
  String
);
var TRANSFORM = "translate(var(--blade-translate-x), var(--blade-translate-y)) rotate(var(--blade-rotate)) scale(var(--blade-scale-x), var(--blade-scale-y))";
var negate = (value) => /^[\d.]+[a-z%]*$/.test(value) ? `-${value}` : `calc(${value} * -1)`;
var translateAxis = (axis, value) => ({
  [`--blade-translate-${axis}`]: value,
  transform: TRANSFORM
});
var rotateBy = (value) => ({ "--blade-rotate": value, transform: TRANSFORM });
var scaleAxes = (axes, value) => ({
  ...Object.fromEntries([...axes || "xy"].map((axis) => [`--blade-scale-${axis}`, value])),
  transform: TRANSFORM
});
var translateScale = { ...builtInSpacing, ...fractions, "2/4": "50%" };
var rotateScale = [0, 1, 2, 3, 6, 12, 45, 90, 180];
var scaleScale = [0, 50, 75, 90, 95, 100, 105, 110, 125, 150];
var transformRules = [
  // e.g. `-translate-x-1/2` → -50% on x, `translate-y-[calc(var(--offset)*1px)]`
  ...Object.entries(translateScale).flatMap(
    ([key, value]) => ["x", "y"].flatMap((axis) => [
      [`translate-${axis}-${key}`, translateAxis(axis, px(value))],
      [`-translate-${axis}-${key}`, translateAxis(axis, negate(px(value)))]
    ])
  ),
  [
    /^(-?)translate-([xy])-\[(.+)\]$/,
    ([, negative, axis, value]) => translateAxis(axis, negative ? negate(arbitrary(value)) : arbitrary(value))
  ],
  // e.g. `rotate-45`, `-rotate-90`, `rotate-[270deg]`
  ...rotateScale.flatMap((degrees) => [
    [`rotate-${degrees}`, rotateBy(`${degrees}deg`)],
    [`-rotate-${degrees}`, rotateBy(`-${degrees}deg`)]
  ]),
  [
    /^(-?)rotate-\[(.+)\]$/,
    ([, negative, value]) => rotateBy(negative ? negate(arbitrary(value)) : arbitrary(value))
  ],
  // e.g. `scale-95`, `-scale-x-100` (a mirror), `scale-y-[var(--progress)]`
  ...scaleScale.flatMap(
    (percent) => ["", "x", "y"].flatMap((axes) => {
      const name = axes ? `scale-${axes}-${percent}` : `scale-${percent}`;
      return [
        [name, scaleAxes(axes, String(percent / 100))],
        [`-${name}`, scaleAxes(axes, String(-percent / 100))]
      ];
    })
  ),
  [
    /^(-?)scale-(?:([xy])-)?\[(.+)\]$/,
    ([, negative, axes = "", value]) => scaleAxes(axes, negative ? negate(arbitrary(value)) : arbitrary(value))
  ],
  ...keywords("transform-origin", {
    "origin-center": "center",
    "origin-top": "top",
    "origin-top-right": "top right",
    "origin-right": "right",
    "origin-bottom-right": "bottom right",
    "origin-bottom": "bottom",
    "origin-bottom-left": "bottom left",
    "origin-left": "left",
    "origin-top-left": "top left"
  }),
  [/^origin-\[(.+)\]$/, ([, value]) => ({ "transform-origin": arbitrary(value) })]
];
var transformVariables = {
  getCSS: () => "*, ::before, ::after { --blade-translate-x: 0; --blade-translate-y: 0; --blade-rotate: 0deg; --blade-scale-x: 1; --blade-scale-y: 1; }"
};
var TRANSITION_DEFAULTS = {
  "transition-duration": "150ms",
  "transition-timing-function": "cubic-bezier(0.4, 0, 0.2, 1)"
};
var transitionProperties = {
  transition: "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter",
  "transition-all": "all",
  "transition-colors": "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke",
  "transition-opacity": "opacity",
  "transition-shadow": "box-shadow",
  "transition-transform": "transform",
  "transition-size": "width, height"
};
var milliseconds = Object.fromEntries(
  [0, 75, 100, 150, 200, 300, 500, 700, 1e3].map((ms) => [ms, ms])
);
var transitionRules = [
  ...Object.entries(transitionProperties).map(
    ([name, property]) => [name, { "transition-property": property, ...TRANSITION_DEFAULTS }]
  ),
  ["transition-none", { "transition-property": "none" }],
  // e.g. `transition-[height]`, `transition-[background-color,border-color]`
  [
    /^transition-\[(.+)\]$/,
    ([, value]) => ({ "transition-property": arbitrary(value), ...TRANSITION_DEFAULTS })
  ],
  // e.g. `duration-moderate` → 280ms, `duration-300`, `duration-[350ms]`
  ...rules(
    "duration",
    "transition-duration",
    { ...milliseconds, ...motion.duration },
    (value) => `${value}ms`
  ),
  [/^duration-\[(.+)\]$/, ([, value]) => ({ "transition-duration": arbitrary(value) })],
  // e.g. `ease-standard` → cubic-bezier(0.3, 0, 0.2, 1); Tailwind's `ease-in`, `-out`, `-in-out`.
  // Blade's `linear` is `cubic-bezier(0, 0, 0, 0)`, which isn't linear, so it's replaced
  ...rules("ease", "transition-timing-function", {
    ...motion.easing,
    linear: "linear",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    "in-out": "cubic-bezier(0.4, 0, 0.2, 1)"
  }),
  [/^ease-\[(.+)\]$/, ([, value]) => ({ "transition-timing-function": arbitrary(value) })],
  // e.g. `delay-gentle` → 480ms, `delay-100`, `delay-[80ms]`
  ...rules(
    "delay",
    "transition-delay",
    { ...milliseconds, ...motion.delay },
    (value) => `${value}ms`
  ),
  [/^delay-\[(.+)\]$/, ([, value]) => ({ "transition-delay": arbitrary(value) })]
];
var focusRing = (tint) => `0px 0px 0px 4px ${tint}`;
var FOCUS_PRIMARY = color2("surface-border-primary-muted");
var FOCUS_NEGATIVE = color2("feedback-border-negative-subtle");
var FOCUS_NEUTRAL = color2("interactive-border-neutral-faded");
var filledFrame = ({
  rim,
  edge,
  bevel
}) => {
  const frame = `inset 0 1.5px 0 0 ${bevel}, inset 0 -2px 0 0 ${bevel}`;
  const highlighted = `inset 0 -1.5px 0 0 ${edge}, inset 0 0 0 0.5px ${edge}, ${frame}`;
  return {
    rest: `inset 0 -1.5px 0 0 ${edge}, inset 0 0 0 0.5px ${rim}, ${frame}`,
    highlighted
  };
};
var buttonAccents = {
  primary: {
    rim: color2("interactive-border-primary-default"),
    edge: color2("interactive-border-primary-highlighted"),
    bevel: "hsla(0, 0%, 100%, 0.18)",
    ring: FOCUS_PRIMARY
  },
  neutral: {
    rim: color2("interactive-background-neutral-default"),
    edge: "hsla(0, 0%, 0%, 0.88)",
    bevel: "hsla(0, 0%, 100%, 0.32)",
    ring: FOCUS_NEUTRAL
  },
  positive: {
    rim: color2("interactive-background-positive-default"),
    edge: color2("interactive-background-positive-highlighted"),
    bevel: "hsla(0, 0%, 100%, 0.18)",
    ring: FOCUS_PRIMARY
  },
  negative: {
    rim: color2("interactive-background-negative-default"),
    edge: color2("interactive-background-negative-highlighted"),
    bevel: "hsla(0, 0%, 100%, 0.18)",
    ring: FOCUS_PRIMARY
  }
};
var outlinedFrame = (rim) => `inset 0 -1px 0.5px 0 ${color2(
  "interactive-border-static-black-faded-highlighted"
)}, inset 0 0 0 1px ${rim}, inset 0 -1.5px 0 0 ${color2("interactive-border-gray-default")}`;
var outlined = {
  rest: outlinedFrame(color2("interactive-border-gray-default")),
  highlighted: outlinedFrame(color2("interactive-border-gray-highlighted"))
};
var namedShadows = {
  // Blade's elevated card (`drop-shadow-01`)
  card: "0 6px 32px 4px hsla(205, 8%, 71%, 0.06)",
  // Blade's focus ring, on its own and inset
  focus: focusRing(FOCUS_PRIMARY),
  "focus-inset": `inset ${focusRing(FOCUS_PRIMARY)}`,
  // Blade's CardGroup: the raised surface's rim and lip, redrawn over the rows
  // (their fills cover the surface's own); a picked row's 1.5px primary ring,
  // and the 4px faded primary focus ring, both inset as the group clips.
  "card-group-rim": `inset 0px 0px 0px 1px ${color2(
    "interactive-border-gray-disabled"
  )}, inset 0px -1.5px 0px 1px ${color2("surface-background-gray-intense")}`,
  "card-group-picked": `inset 0 0 0 1.5px ${color2("surface-border-primary-normal")}`,
  "card-group-focus": `inset 0 0 0 4px ${color2("interactive-border-primary-faded")}`,
  "focus-negative": focusRing(FOCUS_NEGATIVE),
  "focus-neutral": focusRing(FOCUS_NEUTRAL),
  ...Object.fromEntries(
    Object.entries(buttonAccents).flatMap(([accent, { ring, ...colors }]) => {
      const { rest, highlighted } = filledFrame(colors);
      return [
        [`button-${accent}`, rest],
        [`button-${accent}-highlighted`, highlighted],
        [`button-${accent}-focus`, `${highlighted}, ${focusRing(ring)}`]
      ];
    })
  ),
  "button-outlined": outlined.rest,
  "button-outlined-highlighted": outlined.highlighted,
  "button-outlined-focus": `${focusRing(FOCUS_PRIMARY)}, ${outlined.highlighted}`,
  "button-outlined-neutral-focus": `${focusRing(FOCUS_NEUTRAL)}, ${outlined.highlighted}`,
  // Blade's DropdownOverlay: a 1px popup rim drawn inside, over the raised shadow
  dropdown: `inset 0px 0px 0px 1px ${color2("popup-border-gray-subtle")}, ${elevation.onLight.midRaised}`,
  // Blade DSL's Bottom Bar (Figma's Bottom Nav effect): 8px up, 24px blur
  bottomBar: `0px -8px 24px 0px ${color2("surface-border-gray-muted")}`,
  // Blade's bottom sheet: an upward drop shadow
  bottomSheet: "0px -24px 48px -12px hsla(217, 56%, 17%, 0.18)",
  // Blade's toast: a white bevel along the top edge, under its popup border
  "toast-bevel": `inset 0 1.5px 0 0 ${color2(
    "interactive-background-static-white-faded-highlighted"
  )}`,
  // Blade's Toast: a 1px rim in its colour's popup border, inside, over the bevel
  ...Object.fromEntries(
    ["neutral", "information", "positive", "notice", "negative"].map((intent) => [
      `toast-${intent}`,
      `inset 0 0 0 1px ${color2(`popup-border-${intent}-moderate`)}, inset 0 1.5px 0 0 ${color2(
        "interactive-background-static-white-faded-highlighted"
      )}`
    ])
  ),
  "button-outlined-disabled": `inset 0 0 0 1px ${color2("interactive-border-gray-disabled")}`,
  // Blade's white buttons, for dark surfaces: filled, and outlined (secondary and tertiary)
  "button-white": `inset 0 -1.5px 0 0 ${color2(
    "interactive-border-static-black-faded-highlighted"
  )}, inset 0 0 0 0.5px ${color2("interactive-border-static-black-faded-highlighted")}`,
  "button-white-outlined": `inset 0 -1.5px 0 0 ${color2(
    "interactive-border-static-black-faded-highlighted"
  )}, inset 0 0 0 1px ${color2("interactive-border-static-white-highlighted")}`,
  "button-white-outlined-disabled": `inset 0 0 0 1px ${color2(
    "interactive-border-static-white-disabled"
  )}`,
  "button-white-focus": `${focusRing(FOCUS_PRIMARY)}, inset 0 -1.5px 0 0 ${color2(
    "interactive-border-static-black-faded-highlighted"
  )}, inset 0 0 0 0.5px ${color2("interactive-border-static-black-faded-highlighted")}`,
  "button-white-outlined-focus": `${focusRing(FOCUS_PRIMARY)}, inset 0 -1.5px 0 0 ${color2(
    "interactive-border-static-black-faded-highlighted"
  )}, inset 0 0 0 1px ${color2("interactive-border-static-white-highlighted")}`
};
var sheen = (size) => `radial-gradient(${size}px ${size}px at 0% 0%, hsla(0, 0%, 100%, 0.18) 0%, transparent 100%)`;
var backgroundImages = {
  "button-sheen-xsmall": sheen(48),
  "button-sheen-small": sheen(56),
  "button-sheen-medium": sheen(64),
  "button-sheen-large": sheen(72)
};
var surfaceGradient = (from, to) => `linear-gradient(to bottom, ${from} 0%, ${to} 100%)`;
var SURFACE_WHITE = "hsla(0, 0%, 100%, 1)";
var SURFACE_TINT = "hsla(0, 0%, 97%, 1)";
var surfaceRaised = [
  "surface-raised",
  {
    "box-shadow": `inset 0px 0px 0px 1px ${color2("interactive-border-gray-disabled")}, ${namedShadows.card}, inset 0px -1.5px 0px 1px ${color2("surface-background-gray-intense")}`,
    border: "none",
    "background-image": `${surfaceGradient(SURFACE_WHITE, SURFACE_WHITE)}, ${surfaceGradient(
      SURFACE_WHITE,
      SURFACE_TINT
    )}`,
    "background-position": "center top, center calc(100% - 2px)",
    "background-size": "calc(100% - 2px) 16px, calc(100% - 2px) 16px",
    "background-repeat": "no-repeat"
  }
];
var surfaceRaisedBorderless = [
  "surface-raised-borderless",
  {
    ...surfaceRaised[1],
    "box-shadow": `${namedShadows.card}, inset 0px -1.5px 0px 1px ${color2(
      "surface-background-gray-intense"
    )}`
  }
];
var dividerFillRules = keywords("background-color", {
  "bg-divider-gray-subtle": color2("surface-border-gray-subtle")
});
var visualRules = [
  surfaceRaised,
  surfaceRaisedBorderless,
  ...dividerFillRules,
  ...rules("shadow", "box-shadow", namedShadows, String),
  ...rules("bg", "background-image", backgroundImages, String),
  ...keywords("background-image", { "bg-none": "none" }),
  // e.g. `blur-medium` → blur(8px), `grayscale` → grayscale(1), composed (see `FILTER`)
  ...Object.entries(backdropBlur).map(
    ([key, value]) => [
      `blur-${key}`,
      { "--blade-blur": `blur(${px(value)})`, filter: FILTER }
    ]
  ),
  ["grayscale", { "--blade-grayscale": "grayscale(1)", filter: FILTER }],
  ...keywords("filter", { "filter-none": "none" }),
  ...keywords("border-radius", { "rounded-inherit": "inherit" }),
  // `::before` and `::after` render only with content
  ...keywords("content", { "content-empty": "''" }),
  // Outlines, for rings that have to sit beside a box shadow, e.g. `outline-thick` → 1.5px
  ...rules("outline", "outline-width", border.width),
  // Blade's focus outline: 4px, offset 1px (`outline-4 outline-offset-1`)
  ...rules("outline", "outline-width", { 4: 4 }),
  // Tailwind's `outline-none`: a transparent outline, not none, so forced
  // colours (Windows high contrast) still draw the focus.
  ["outline-none", { outline: "2px solid transparent", "outline-offset": "2px" }],
  ...keywords("outline-style", { "outline-solid": "solid" }),
  ...rules("outline-offset", "outline-offset", { 0: 0, 1: 1, 2: 2 }),
  ...rules("-outline-offset", "outline-offset", { 1: 1, 2: 2, 4: 4 }, negativePx)
];
var keyframes = {
  spin: "from { transform: rotate(0deg) } to { transform: rotate(360deg) }",
  pulse: "50% { opacity: 0.5 }",
  // Tailwind's: falls fast, eases up
  bounce: "0%, 100% { transform: translateY(-50%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1) } 50% { transform: none; animation-timing-function: cubic-bezier(0, 0, 0.2, 1) }",
  shake: "0%, 100% { transform: none } 12.5% { transform: translateX(-6px) } 37.5% { transform: translateX(5px) } 62.5% { transform: translateX(-3px) } 87.5% { transform: translateX(2px) }",
  // Blade's DotLoader: each dot lifts by its `--lift` and brightens, a third of the way in
  dot: "0%, 60%, 100% { transform: none; opacity: 0.42 } 30% { transform: translateY(calc(var(--lift) * -1)); opacity: 1 }",
  // Blade's Skeleton: the gray fill rests, then brightens to its highlighted step
  skeleton: `0%, 25% { background-color: ${color2(
    "interactive-background-gray-default"
  )} } 100% { background-color: ${color2("interactive-background-gray-highlighted")} }`,
  // …after fading in once
  "skeleton-in": "0% { opacity: 0 } 100% { opacity: 1 }"
};
var counterKeyframes = {
  "slide-up": "0% { transform: translateY(30%); opacity: 0 } 100% { transform: none; opacity: 1 }",
  "slide-down": "0% { transform: translateY(-30%); opacity: 0 } 100% { transform: none; opacity: 1 }",
  oscillate: "0%, 100% { left: -40% } 25%, 75% { left: 50% } 50% { left: 100% }"
};
var progressBarKeyframes = {
  "progress-pulse": "0%, 100% { opacity: 0 } 50% { opacity: 0.25 }",
  "progress-slide": "0% { left: -8%; transform: scaleX(1) } 50% { left: 50%; transform: scaleX(5) } 100% { left: 103%; transform: scaleX(1) }",
  "progress-ring-pulse": "0%, 100% { opacity: 1 } 50% { opacity: 0.65 }"
};
var skeletonPulse = `skeleton-in ${motion.duration["2xgentle"]}ms ${motion.easing.standard} both, skeleton ${motion.duration["2xgentle"] + motion.duration.xmoderate}ms ${motion.easing.standard} ${motion.duration["2xgentle"]}ms infinite alternate`;
var animationRules = keywords("animation", {
  "animate-none": "none",
  "animate-spin": "spin 1s linear infinite",
  "animate-pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
  "animate-bounce": "bounce 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite",
  "animate-shake": "shake 400ms ease-in-out 1",
  "animate-skeleton": skeletonPulse,
  "animate-dot": "dot 1200ms ease-in-out infinite",
  "animate-slide-up": `slide-up ${motion.duration.quick}ms ease-out`,
  "animate-slide-down": `slide-down ${motion.duration.quick}ms ease-out`,
  "animate-oscillate": `oscillate ${motion.duration["2xgentle"]}ms linear infinite`,
  "animate-progress-pulse": `progress-pulse ${motion.duration["2xgentle"]}ms ${motion.easing.emphasized} ${motion.delay.long}ms infinite`,
  "animate-progress-slide": `progress-slide ${motion.duration["2xgentle"]}ms linear infinite`,
  "animate-progress-ring-pulse": `progress-ring-pulse ${motion.duration["2xgentle"]}ms ${motion.easing.emphasized} infinite`
});
var interactionRules = [
  ...keywords("cursor", {
    "cursor-auto": "auto",
    "cursor-default": "default",
    "cursor-pointer": "pointer",
    "cursor-text": "text",
    "cursor-not-allowed": "not-allowed",
    "cursor-grab": "grab",
    "cursor-grabbing": "grabbing"
  }),
  ...keywords("pointer-events", { "pointer-events-none": "none", "pointer-events-auto": "auto" }),
  ...keywords("user-select", {
    "select-none": "none",
    "select-auto": "auto",
    "select-text": "text"
  }),
  ...keywords("touch-action", {
    "touch-none": "none",
    "touch-auto": "auto",
    "touch-pan-y": "pan-y"
  }),
  ...keywords("resize", { resize: "both", "resize-none": "none", "resize-y": "vertical" }),
  ...keywords("scroll-snap-type", { "snap-x-mandatory": "x mandatory", "snap-none": "none" }),
  ...keywords("scroll-snap-align", { "snap-start": "start", "snap-center": "center" }),
  ...keywords("overscroll-behavior", { "overscroll-contain": "contain" }),
  ...keywords("overscroll-behavior-x", { "overscroll-x-contain": "contain" }),
  // No scrollbar on the element, in every engine; it still scrolls.
  // `[&_*]:scrollbar-none` reaches its descendants too.
  [
    "scrollbar-none",
    [
      { "scrollbar-width": "none", "-ms-overflow-style": "none" },
      {
        [symbols2.selector]: (selector) => `${selector}::-webkit-scrollbar`,
        display: "none"
      }
    ]
  ]
];
var moreLayoutRules = [
  ...keywords("display", { table: "table", contents: "contents", "display-box": "-webkit-box" }),
  ...keywords("visibility", { visible: "visible", invisible: "hidden" }),
  ...keywords("box-sizing", { "box-border": "border-box", "box-content": "content-box" }),
  ...keywords("isolation", { isolate: "isolate" }),
  ...keywords("overflow-x", { "overflow-x-auto": "auto", "overflow-x-hidden": "hidden" }),
  ...keywords("overflow-y", { "overflow-y-auto": "auto", "overflow-y-hidden": "hidden" }),
  ...keywords("object-fit", { "object-contain": "contain", "object-cover": "cover" }),
  ...keywords("order", { "order-first": "-9999", "order-last": "9999", "order-none": "0" }),
  ...keywords("-webkit-box-orient", { "box-vertical": "vertical" }),
  // Tailwind's `line-clamp-*`: the box it needs comes with it
  ...[1, 2, 3, 4, 5, 6].map(
    (lines) => [
      `line-clamp-${lines}`,
      {
        overflow: "hidden",
        display: "-webkit-box",
        "-webkit-box-orient": "vertical",
        "-webkit-line-clamp": String(lines)
      }
    ]
  ),
  // e.g. `grid-cols-12` → repeat(12, minmax(0, 1fr)), `col-span-6` → span 6 / span 6
  ...Array.from({ length: 12 }, (_, i) => [
    [`grid-cols-${i + 1}`, { "grid-template-columns": `repeat(${i + 1}, minmax(0, 1fr))` }],
    [`col-span-${i + 1}`, { "grid-column": `span ${i + 1} / span ${i + 1}` }],
    [`col-start-${i + 1}`, { "grid-column-start": String(i + 1) }]
  ]).flat(),
  ...keywords("grid-column", { "col-span-full": "1 / -1" })
];
var textRules = [
  ...keywords("text-align", {
    "text-left": "left",
    "text-center": "center",
    "text-right": "right",
    "text-start": "start",
    "text-end": "end"
  }),
  ...keywords("white-space", {
    "whitespace-normal": "normal",
    "whitespace-nowrap": "nowrap",
    "whitespace-pre": "pre",
    "whitespace-pre-wrap": "pre-wrap"
  }),
  ...keywords("text-decoration-line", {
    underline: "underline",
    "line-through": "line-through",
    "no-underline": "none"
  }),
  ...rules("underline-offset", "text-underline-offset", { 1: 1, 2: 2, 4: 4 }),
  ...keywords("text-overflow", { "text-ellipsis": "ellipsis" }),
  ...keywords("font-variant-numeric", { "tabular-nums": "tabular-nums" }),
  // A list's markers: `list-none` for a trail or a menu built on `<ol>`/`<ul>`.
  ...keywords("list-style", { "list-none": "none" }),
  ...keywords("vertical-align", {
    "align-middle": "middle",
    "align-top": "top",
    "align-baseline": "baseline"
  })
];
var arbitraryPropertyRule = [
  /^\[(--[\w-]+|[a-z-]+):(.+)\]$/,
  ([, property, value]) => /\btheme\(/.test(value) ? void 0 : { [property]: arbitrary(value) }
];
var shortcuts = {
  truncate: "overflow-hidden text-ellipsis whitespace-nowrap",
  ...Object.fromEntries([1, 2, 3, 4].map((lines) => [`clamp-${lines}`, `line-clamp-${lines}`])),
  "sr-only": "absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-none [clip:rect(0,0,0,0)]"
};
var pseudoClasses = {
  hover: ":hover",
  focus: ":focus",
  "focus-visible": ":focus-visible",
  "focus-within": ":focus-within",
  active: ":active",
  // `aria-disabled` too: a busy control keeps focus (so it is not `disabled`)
  // yet must look it, as Blade's loading button does
  disabled: ":is(:disabled,[aria-disabled=true])",
  enabled: ":not(:disabled):not([aria-disabled=true])",
  checked: ":checked",
  first: ":first-child",
  last: ":last-child",
  only: ":only-child",
  odd: ":nth-child(odd)",
  even: ":nth-child(even)",
  "first-of-type": ":first-of-type",
  "last-of-type": ":last-of-type",
  empty: ":empty",
  before: "::before",
  after: "::after",
  "first-letter": "::first-letter",
  placeholder: "::placeholder"
};
var withState = (selector, state) => {
  const pseudoElement = /::[\w-]+$/.exec(selector);
  if (!pseudoElement || state.startsWith("::")) return `${selector}${state}`;
  return `${selector.slice(0, pseudoElement.index)}${state}${pseudoElement[0]}`;
};
var HOVER_MEDIA = "@media (hover: hover) and (pointer: fine)";
var pseudoClassVariant = (matcher) => {
  const [name, ...rest] = matcher.split(":");
  const pseudoClass = pseudoClasses[name];
  if (!pseudoClass || rest.length === 0) return void 0;
  return {
    matcher: rest.join(":"),
    selector: (selector) => withState(selector, pseudoClass),
    ...name === "hover" ? { parent: HOVER_MEDIA } : {}
  };
};
var dataAttribute = (condition) => {
  const [key, value] = condition.split("=");
  return value === void 0 ? `[data-${key}]` : `[data-${key}="${value}"]`;
};
var stateSelector = (state) => {
  const data = /^data-\[(.+)\]$/.exec(state);
  if (data) return dataAttribute(data[1]);
  return pseudoClasses[state];
};
var dataVariant = (matcher) => {
  const match = /^data-\[([^\]]+)\]:(.+)$/.exec(matcher);
  if (!match) return void 0;
  return {
    matcher: match[2],
    selector: (selector) => withState(selector, dataAttribute(match[1]))
  };
};
var groupPeerVariant = (matcher) => {
  const match = /^(group|peer)-(data-\[[^\]]+\]|[a-z-]+)(?:\/([\w-]+))?:(.+)$/.exec(matcher);
  if (!match) return void 0;
  const [, kind, state, name, rest] = match;
  const pseudo = stateSelector(state);
  if (!pseudo) return void 0;
  const marker = `.${kind}${name ? `\\/${name}` : ""}${pseudo}`;
  return {
    matcher: rest,
    selector: (selector) => kind === "group" ? `${marker} ${selector}` : `${marker} ~ ${selector}`,
    ...state === "hover" ? { parent: HOVER_MEDIA } : {}
  };
};
var leadingBracket = (matcher) => {
  if (!matcher.startsWith("[")) return void 0;
  let depth = 0;
  for (let at = 0; at < matcher.length; at += 1) {
    if (matcher[at] === "[") depth += 1;
    else if (matcher[at] === "]" && --depth === 0) {
      return matcher[at + 1] === ":" ? { inner: matcher.slice(1, at), rest: matcher.slice(at + 2) } : void 0;
    }
  }
  return void 0;
};
var selectorVariant = (matcher) => {
  if (matcher.startsWith("*:")) {
    return { matcher: matcher.slice(2), selector: (selector) => `${selector} > *` };
  }
  const bracket = leadingBracket(matcher);
  if (!bracket?.rest) return void 0;
  const template = bracket.inner.replace(/_/g, " ");
  if (template.includes("\\\\")) return void 0;
  if (template.startsWith("@")) return { matcher: bracket.rest, parent: template };
  if (!template.includes("&")) return void 0;
  return { matcher: bracket.rest, selector: (selector) => template.replace(/&/g, selector) };
};
function desktopMedia(options = {}) {
  return `(min-width: ${options.desktop ?? "62.5rem"})`;
}
var desktopVariant = (media) => (matcher) => matcher.startsWith("d:") ? { matcher: matcher.slice(2), parent: `@media ${media}` } : void 0;
var belowDesktopVariant = (media) => (matcher) => matcher.startsWith("max-d:") ? { matcher: matcher.slice("max-d:".length), parent: `@media not all and ${media}` } : void 0;
var motionReduceVariant = (matcher) => {
  if (!matcher.startsWith("motion-reduce:")) return void 0;
  return {
    matcher: matcher.slice("motion-reduce:".length),
    parent: "@media (prefers-reduced-motion: reduce)"
  };
};
var hasVariant = (name) => {
  let depth = 0;
  for (const char of name) {
    if (char === "[") depth += 1;
    else if (char === "]") depth -= 1;
    else if (char === ":" && depth === 0) return true;
  }
  return false;
};
var importantVariant = (matcher) => {
  const leading = matcher.startsWith("!") && !hasVariant(matcher);
  if (!leading && !matcher.endsWith("!")) return void 0;
  return {
    matcher: leading ? matcher.slice(1) : matcher.slice(0, -1),
    body: (body) => {
      for (const entry of body) {
        if (entry[1] != null && !String(entry[1]).endsWith("!important")) {
          entry[1] = `${entry[1]} !important`;
        }
      }
      return body;
    }
  };
};
var preflights = [
  transformVariables,
  filterVariables,
  // Resets, in the `base` layer with Tailwind's preflight: an app that puts
  // its base in a cascade layer (`@layer x { @unocss base; }`) puts these
  // there too, under its components' layers.
  // Borders are opt-in per side: `border-t-thin border-solid` draws only the top edge
  { layer: "base", getCSS: () => "*, ::before, ::after { border-width: 0; }" },
  // Buttons show they are pressable, as the browser leaves them on the arrow
  {
    layer: "base",
    getCSS: () => 'button, [role="button"] { cursor: pointer; } :disabled { cursor: default; }'
  },
  {
    getCSS: () => Object.entries({ ...keyframes, ...counterKeyframes, ...progressBarKeyframes }).map(([name, frames]) => `@keyframes ${name} { ${frames} }`).join("\n")
  }
];
function bladeVariants(options = {}) {
  const matchers = [
    importantVariant,
    selectorVariant,
    groupPeerVariant,
    dataVariant,
    desktopVariant(desktopMedia(options)),
    belowDesktopVariant(desktopMedia(options)),
    motionReduceVariant,
    pseudoClassVariant
  ];
  return matchers.map((match) => ({ match, multiPass: true }));
}
var isStatic = (rule) => typeof rule[0] === "string";
function mergeOwnership(tailwind, blade, bladeShortcuts, appFirst = /* @__PURE__ */ new Set()) {
  const tailwindStatic = new Set(
    tailwind.filter(isStatic).map((rule) => rule[0])
  );
  const tailwindDynamic = tailwind.filter((rule) => !isStatic(rule)).reverse();
  const bladeStatic = new Map(
    blade.filter(isStatic).map((rule) => [rule[0], rule[1]])
  );
  const bladeDynamic = blade.filter((rule) => !isStatic(rule)).reverse();
  const firstOf = (rules3, name, context) => {
    for (const [pattern, handle] of rules3) {
      const match = pattern.exec(name);
      if (!match) continue;
      const result = handle(match, context);
      if (result != null) return result;
    }
    return void 0;
  };
  const claims = /* @__PURE__ */ new Map();
  const tailwindClaims = (name, context) => {
    let claimed = claims.get(name);
    if (claimed === void 0) {
      claimed = tailwindStatic.has(name) || firstOf(tailwindDynamic, name, context) !== void 0;
      claims.set(name, claimed);
    }
    return claimed;
  };
  const bladeCSS = (name, context) => {
    if (appFirst.has(name)) return void 0;
    return bladeStatic.has(name) ? bladeStatic.get(name) : firstOf(bladeDynamic, name, context);
  };
  const rules2 = [
    ...tailwind.map(
      (rule) => {
        if (isStatic(rule)) {
          const [name, , meta2] = rule;
          const css = bladeCSS(name, {});
          return css === void 0 ? rule : [name, css, meta2];
        }
        const [pattern, handle, meta] = rule;
        return [
          pattern,
          (match, context) => {
            const css = handle(match, context);
            if (css == null) return void 0;
            return bladeCSS(match[0], context) ?? css;
          },
          meta
        ];
      }
    ),
    ...blade.flatMap((rule) => {
      if (isStatic(rule)) return tailwindClaims(rule[0], {}) ? [] : [rule];
      const [pattern, handle, meta] = rule;
      return [
        [
          pattern,
          (match, context) => tailwindClaims(match[0], context) ? void 0 : handle(match, context),
          meta
        ]
      ];
    })
  ];
  const shortcuts2 = Object.fromEntries(
    Object.entries(bladeShortcuts).filter(([name]) => !tailwindClaims(name, {}))
  );
  return { rules: rules2, shortcuts: shortcuts2 };
}
function bladeUnoConfig(options = {}) {
  const theme = options.theme === void 0 ? void 0 : resolveTheme([
    options.theme,
    ...(options.presets ?? []).map((preset) => preset.theme ?? {}),
    defaultTheme
  ]);
  const bladeRules = [
    ...getColorRules(),
    ...colorKeywordRules,
    ...spacingRules,
    ...sizeRules,
    ...fractionRules,
    ...borderRules,
    ...effectRules,
    ...opacityRules,
    ...zIndexRules,
    ...transformRules,
    ...transitionRules,
    ...visualRules,
    ...animationRules,
    ...interactionRules,
    ...typographyRules,
    ...textRules,
    ...layoutRules,
    ...moreLayoutRules,
    arbitraryPropertyRule
  ];
  const merged = theme ? mergeOwnership(
    tailwindRules(theme),
    bladeRules,
    shortcuts,
    appFontClasses([
      options.theme ?? {},
      ...(options.presets ?? []).map((preset) => preset.theme ?? {})
    ])
  ) : { rules: bladeRules, shortcuts };
  return defineConfig({
    presets: [],
    separators: [":"],
    rules: merged.rules,
    shortcuts: merged.shortcuts,
    // A rule stays where its class sorts: merging equal bodies into one
    // selector list would move rules in the cascade (Tailwind never does),
    // and one selector a browser rejects would drop the whole list.
    mergeSelectors: false,
    variants: [...customVariants(options.variants), ...bladeVariants(options)],
    preflights: [
      ...theme ? [
        {
          layer: "base",
          getCSS: () => (options.preflight === false ? "" : preflightCSS(theme)) + defaultsCSS(theme)
        }
      ] : [],
      ...preflights
    ],
    layers: { base: -200 },
    ...theme ? {
      // Tailwind's `before:`/`after:` give the pseudo-element its
      // `content` (`var(--tw-content)`, set by `content-[…]`), unless the
      // rule sets one itself (Blade's icon glyph does).
      postprocess: (util) => {
        if (/::(before|after)$/.test(util.selector) && !util.entries.some(([property]) => property === "content")) {
          util.entries.unshift(["content", "var(--tw-content)"]);
        }
      }
    } : {}
  });
}
var ruleGroups = {
  /** `p-*`, `m-*`, `-m*-*`, `gap-*`, `inset-*`, `top-*`…, `m*-auto` */
  spacing: spacingRules,
  /** `w-*`, `h-*`, `min-*`, `max-*`, and their arbitrary values */
  size: sizeRules,
  /** `w-1/2`, `-top-1/2`…, `w-fit`, `ms-*`, `me-*` */
  fraction: fractionRules,
  /** `opacity-*`: Tailwind's percentage scale */
  opacity: opacityRules,
  /** `font-sans`, `font-mono`, `font-heading` (each over its `--font-family-*`), weights */
  font: fontRules,
  /** `translate-*`, `rotate-*`, `scale-*`, `origin-*`: needs `transformVariables` among the preflights */
  transform: transformRules,
  /** `transition*`, `duration-*`, `ease-*`, `delay-*` */
  transition: transitionRules
};
export {
  BACKDROP_FILTER_FUNCTIONS,
  FILTER_FUNCTIONS,
  arbitrary,
  bladeVariants,
  bladeUnoConfig as default,
  desktopMedia,
  filterVariables,
  ruleGroups,
  transformVariables
};
