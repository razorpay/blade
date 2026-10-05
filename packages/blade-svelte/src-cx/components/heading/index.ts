import type { HeadingComponent } from '../shared/typography';
import HeadingImpl from './Heading.svelte';

export { HEADING_AXES, resolveHeading } from '../shared/typography';
export type {
  HeadingStyleProps,
  HeadingBehaviourProps,
  HeadingComponent,
} from '../shared/typography';

export const Heading: HeadingComponent = HeadingImpl;
