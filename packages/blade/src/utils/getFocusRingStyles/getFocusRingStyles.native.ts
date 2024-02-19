import type { CSSProperties } from 'styled-components';
import type { GetFocusRingArgs } from './focusRingTypes';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getFocusRingStyles(_: GetFocusRingArgs): CSSProperties {
  // React Native does not need focus rings
  return {};
}

export { getFocusRingStyles };
