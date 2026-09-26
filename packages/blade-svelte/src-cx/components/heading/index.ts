import type { HeadingComponent } from '../shared/typography';
import HeadingImpl from './Heading.svelte';

export {
  HEADING_AXES,
  resolveHeading,
  type HeadingStyleProps,
  type HeadingBehaviourProps,
  type HeadingComponent,
} from '../shared/typography';

export const Heading: HeadingComponent = HeadingImpl;
