import type { TextComponent } from '../shared/typography';
import TextImpl from './Text.svelte';

export { TEXT_AXES, resolveText } from '../shared/typography';
export type { TextStyleProps, TextBehaviourProps, TextComponent } from '../shared/typography';

export const Text: TextComponent = TextImpl;
