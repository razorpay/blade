import type { ButtonRayProps } from './types';

/** Button's Ray hover (`aiHover="ray-…"`) is web only (WebGL2): on React Native the button keeps its own press state. */
const ButtonRay = (_props: ButtonRayProps): null => null;

export { ButtonRay };
