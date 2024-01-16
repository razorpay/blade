import type { CSSProperties } from 'styled-components';
import type { Theme } from '../../components/BladeProvider';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getFocusRingStyles(_: { theme: Theme; negativeOffset?: boolean }): CSSProperties {
  // React Native does not need focus rings
  return {};
}

export { getFocusRingStyles };
