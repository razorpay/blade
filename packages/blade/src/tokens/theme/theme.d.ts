import { Spacing } from '../global/spacing';
import { Border } from '../global/border';

export type ColorSchemeNames = 'light' | 'dark' | 'system';

export type ColorSchemeModes = {
  onLight: string;
  onDark: string;
};

export type ShadowLevels = 1 | 2 | 3 | 4 | 5;
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
    level: Record<ShadowLevels, ColorSchemeModes>;
  };
  androidElevation: {
    level: Record<ShadowLevels, number>;
  };
};

export type Feedback = 'positive' | 'negative' | 'notice' | 'information';

export type ColorContrast = {
  highContrast: ColorSchemeModes;
  lowContrast: ColorSchemeModes;
};

export type Colors = {
  brand: {
    primary: Record<300 | 400 | 500 | 600 | 700, ColorSchemeModes>;
    secondary: Record<500, ColorSchemeModes>;
    gray: Record<300 | 400 | 500 | 600 | 700, ColorSchemeModes>;
  };
  feedback: {
    background: Record<Feedback, ColorContrast>;
    border: Record<Feedback, ColorContrast>;
    text: Record<Feedback, ColorContrast>;
    icon: Record<Feedback, ColorContrast>;
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
