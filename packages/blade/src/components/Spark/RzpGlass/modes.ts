import type { ColorSchemeNames } from '~tokens/theme';

const RAZOR_SENSE_OPERATIONAL_MODES = ['neutral', 'typing', 'thinking', 'loading'] as const;
const RAZOR_SENSE_EMOTIONAL_MODES = ['calm', 'joyful', 'caution', 'regret'] as const;
const RAZOR_SENSE_MODES = [
  ...RAZOR_SENSE_OPERATIONAL_MODES,
  ...RAZOR_SENSE_EMOTIONAL_MODES,
] as const;

type RazorSenseOperationalMode = typeof RAZOR_SENSE_OPERATIONAL_MODES[number];
type RazorSenseEmotionalMode = typeof RAZOR_SENSE_EMOTIONAL_MODES[number];
type RazorSenseMode = typeof RAZOR_SENSE_MODES[number];

const RAZOR_SENSE_MODE_LABELS: Record<RazorSenseMode, string> = {
  neutral: 'Neutral',
  typing: 'Typing',
  thinking: 'Thinking',
  loading: 'Loading',
  calm: 'Calm',
  joyful: 'Joyful',
  caution: 'Caution',
  regret: 'Regret',
};

const RAZOR_SENSE_MODE_VIDEO_FILES: Record<RazorSenseEmotionalMode, string> = {
  calm: 'razorsense-calm.mp4',
  joyful: 'razorsense-joyful.mp4',
  caution: 'razorsense-caution.mp4',
  regret: 'razorsense-regret.mp4',
};

const RAZOR_SENSE_MOBILE_MODE_VIDEO_FILES: Record<
  ColorSchemeNames,
  Record<RazorSenseEmotionalMode, string>
> = {
  light: {
    calm: 'razorsense-calm-mobile.mp4',
    joyful: 'razorsense-joyful-mobile.mp4',
    caution: 'razorsense-caution-mobile.mp4',
    regret: 'razorsense-regret-mobile.mp4',
  },
  dark: {
    calm: 'razorsense-calm-mobile-dark.mp4',
    joyful: 'razorsense-joyful-mobile-dark.mp4',
    caution: 'razorsense-caution-mobile-dark.mp4',
    regret: 'razorsense-regret-mobile-dark.mp4',
  },
};

const RAZOR_SENSE_OPERATIONAL_MODE_VIDEO_FILES: Record<
  ColorSchemeNames,
  Record<RazorSenseOperationalMode, string>
> = {
  light: {
    neutral: 'razorsense-neutral.mp4',
    typing: 'razorsense-typing.mp4',
    thinking: 'razorsense-thinking.mp4',
    loading: 'razorsense-loading.mp4',
  },
  dark: {
    neutral: 'razorsense-neutral-dark.mp4',
    typing: 'razorsense-typing-dark.mp4',
    thinking: 'razorsense-thinking-dark.mp4',
    loading: 'razorsense-loading-dark.mp4',
  },
};

const RAZOR_SENSE_OPERATIONAL_MODE_BACKGROUNDS: Record<
  ColorSchemeNames,
  Record<RazorSenseOperationalMode, string>
> = {
  light: {
    neutral: '#EDF3F4',
    typing: '#F8F8F8',
    thinking: '#F1FDEE',
    loading: '#FAFAFA',
  },
  dark: {
    neutral: '#16181A',
    typing: '#15191E',
    thinking: '#13171E',
    loading: '#17161B',
  },
};

const RAZOR_SENSE_OPERATIONAL_MODE_TIMINGS: Record<
  RazorSenseOperationalMode,
  { startTime: number; endTime: number; loop: boolean; crossfadeDuration?: number }
> = {
  neutral: { startTime: 0, endTime: 8.708, loop: true },
  typing: { startTime: 6.68, endTime: 10, loop: false },
  thinking: { startTime: 0, endTime: 4.5, loop: false, crossfadeDuration: 0.6 },
  loading: { startTime: 0, endTime: 3.125, loop: false },
};

const getVideoSources = (
  assetsPath: string,
  files: Record<RazorSenseEmotionalMode, string>,
): Record<RazorSenseEmotionalMode, string> => {
  const normalizedPath = assetsPath.replace(/\/$/, '');

  return Object.fromEntries(
    RAZOR_SENSE_EMOTIONAL_MODES.map((mode) => [
      mode,
      `${normalizedPath}/razorsense-modes/${files[mode]}`,
    ]),
  ) as Record<RazorSenseEmotionalMode, string>;
};

const getRazorSenseModeVideoSources = (
  assetsPath: string,
): Record<RazorSenseEmotionalMode, string> =>
  getVideoSources(assetsPath, RAZOR_SENSE_MODE_VIDEO_FILES);

const getRazorSenseMobileModeVideoSources = (
  assetsPath: string,
  colorScheme: ColorSchemeNames = 'light',
): Record<RazorSenseEmotionalMode, string> =>
  getVideoSources(assetsPath, RAZOR_SENSE_MOBILE_MODE_VIDEO_FILES[colorScheme]);

const getRazorSenseOperationalModeVideoSources = (
  assetsPath: string,
  colorScheme: ColorSchemeNames = 'light',
): Record<RazorSenseOperationalMode, string> => {
  const normalizedPath = assetsPath.replace(/\/$/, '');

  return Object.fromEntries(
    RAZOR_SENSE_OPERATIONAL_MODES.map((mode) => [
      mode,
      `${normalizedPath}/razorsense-states/${RAZOR_SENSE_OPERATIONAL_MODE_VIDEO_FILES[colorScheme][mode]}`,
    ]),
  ) as Record<RazorSenseOperationalMode, string>;
};

const getRazorSenseModeIndex = (mode: RazorSenseEmotionalMode): number =>
  RAZOR_SENSE_EMOTIONAL_MODES.indexOf(mode);

const isRazorSenseEmotionalMode = (mode: RazorSenseMode): mode is RazorSenseEmotionalMode =>
  RAZOR_SENSE_EMOTIONAL_MODES.includes(mode as RazorSenseEmotionalMode);

const isRazorSenseOperationalMode = (mode: RazorSenseMode): mode is RazorSenseOperationalMode =>
  RAZOR_SENSE_OPERATIONAL_MODES.includes(mode as RazorSenseOperationalMode);

export {
  RAZOR_SENSE_MODES,
  RAZOR_SENSE_EMOTIONAL_MODES,
  RAZOR_SENSE_OPERATIONAL_MODES,
  RAZOR_SENSE_MODE_LABELS,
  RAZOR_SENSE_OPERATIONAL_MODE_BACKGROUNDS,
  RAZOR_SENSE_OPERATIONAL_MODE_TIMINGS,
  getRazorSenseModeVideoSources,
  getRazorSenseMobileModeVideoSources,
  getRazorSenseOperationalModeVideoSources,
  getRazorSenseModeIndex,
  isRazorSenseEmotionalMode,
  isRazorSenseOperationalMode,
};

export type { RazorSenseMode, RazorSenseEmotionalMode, RazorSenseOperationalMode };
