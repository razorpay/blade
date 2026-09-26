import type { TextComponent } from '../shared/typography';
import TextImpl from './Text.svelte';

export {
  TEXT_AXES,
  resolveText,
  type TextStyleProps,
  type TextBehaviourProps,
  type TextComponent,
} from '../shared/typography';

export const Text: TextComponent = TextImpl;
