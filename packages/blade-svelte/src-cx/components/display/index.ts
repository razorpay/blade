import type { DisplayComponent } from '../shared/typography';
import DisplayImpl from './Display.svelte';

export { DISPLAY_AXES, resolveDisplay } from '../shared/typography';
export type {
  DisplayStyleProps,
  DisplayBehaviourProps,
  DisplayComponent,
} from '../shared/typography';

export const Display: DisplayComponent = DisplayImpl;
