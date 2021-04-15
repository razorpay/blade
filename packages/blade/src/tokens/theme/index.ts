import { Spacing } from '../global/spacing';
import { Border } from '../global/border';
export { default as lightTheme } from './lightTheme';
export { default as neoTheme } from './neoTheme';

type ColorSchemes = {
  onLight: string;
  onDark: string;
};

type ShadowLevels = 1 | 2 | 3 | 4 | 5;
export type Shadows = {
  offsetX: {
    level: Record<ShadowLevels, number>;
  };
  offsetY: {
    level: Record<ShadowLevels, number>;
  };
  blurRadius: {
    level: Record<ShadowLevels, number>;
  };
  color: {
    level: Record<ShadowLevels, ColorSchemes>;
  };
  androidElevation: {
    level: Record<ShadowLevels, number>;
  };
};

type FeedbackCategory = 'positive' | 'negative' | 'notice' | 'information';

type ColorContrast = {
  highContrast: ColorSchemes;
  lowContrast: ColorSchemes;
};

export type Colors = {
  brand: {
    primary: Record<300 | 400 | 500 | 600 | 700, ColorSchemes>;
    secondary: Record<500, ColorSchemes>;
    gray: Record<300 | 400 | 500 | 600 | 700, ColorSchemes>;
  };
  feedback: {
    background: Record<FeedbackCategory, ColorContrast>;
    border: Record<FeedbackCategory, ColorContrast>;
    text: Record<FeedbackCategory, ColorContrast>;
    icon: Record<FeedbackCategory, ColorContrast>;
  };
  surface: {
    background: Record<'level1' | 'level2' | 'level3', ColorContrast>;
    border: Record<'normal' | 'subtle', ColorContrast>;
    text: Record<'normal' | 'subtle' | 'subdued' | 'muted' | 'placeholder', ColorContrast>;
  };
};

export type Theme = {
  colors: Colors;
  border: Border;
  spacing: Spacing;
  shadows: Shadows;
};
