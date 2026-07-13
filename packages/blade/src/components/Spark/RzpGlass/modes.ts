import type { ColorSchemeNames } from '~tokens/theme';
import type { RzpGlassPreset } from './presets';
import { getRazorSenseFallbackVideoSource } from './razorSenseAssets';

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

const AUTHORED_PRESET_MODES: Partial<Record<RzpGlassPreset, RazorSenseOperationalMode>> = {
  default: 'neutral',
  zoomed: 'thinking',
  bottomWave: 'typing',
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
  typing: { startTime: 0, endTime: 3.32, loop: false },
  thinking: { startTime: 0, endTime: 4.5, loop: false, crossfadeDuration: 0.6 },
  loading: { startTime: 0, endTime: 3.125, loop: false },
};

const getFallbackVideoSources = <Mode extends RazorSenseMode>(
  assetsPath: string,
  modes: readonly Mode[],
  colorScheme: ColorSchemeNames,
  viewport: 'desktop' | 'mobile',
): Record<Mode, string> =>
  Object.fromEntries(
    modes.map((mode) => [
      mode,
      getRazorSenseFallbackVideoSource({ assetsPath, mode, colorScheme, viewport }).src,
    ]),
  ) as Record<Mode, string>;

const getRazorSenseModeVideoSources = (
  assetsPath: string,
): Record<RazorSenseEmotionalMode, string> =>
  getFallbackVideoSources(assetsPath, RAZOR_SENSE_EMOTIONAL_MODES, 'light', 'desktop');

const getRazorSenseMobileModeVideoSources = (
  assetsPath: string,
  colorScheme: ColorSchemeNames = 'light',
): Record<RazorSenseEmotionalMode, string> =>
  getFallbackVideoSources(assetsPath, RAZOR_SENSE_EMOTIONAL_MODES, colorScheme, 'mobile');

const getRazorSenseOperationalModeVideoSources = (
  assetsPath: string,
  colorScheme: ColorSchemeNames = 'light',
): Record<RazorSenseOperationalMode, string> =>
  getFallbackVideoSources(assetsPath, RAZOR_SENSE_OPERATIONAL_MODES, colorScheme, 'desktop');

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
  AUTHORED_PRESET_MODES,
  getRazorSenseModeVideoSources,
  getRazorSenseMobileModeVideoSources,
  getRazorSenseOperationalModeVideoSources,
  getRazorSenseModeIndex,
  isRazorSenseEmotionalMode,
  isRazorSenseOperationalMode,
};

export type { RazorSenseMode, RazorSenseEmotionalMode, RazorSenseOperationalMode };
