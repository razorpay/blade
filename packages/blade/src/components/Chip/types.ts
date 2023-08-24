import type { Theme } from '~components/BladeProvider';
import type { DotNotationColorStringToken } from '~utils/types';

export type AnimatedChipProps = {
  borderColor: DotNotationColorStringToken<Theme['colors']>;
  isPressed?: boolean;
  isDisabled?: boolean;
  isDesktop?: boolean;
  theme: Theme;
  children: React.ReactNode;
};
