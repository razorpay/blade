import type { Theme } from '~components/BladeProvider';

export type AnimatedChipProps = {
  isPressed?: boolean;
  isDisabled?: boolean;
  isDesktop?: boolean;
  theme: Theme;
  children: React.ReactNode;
};
