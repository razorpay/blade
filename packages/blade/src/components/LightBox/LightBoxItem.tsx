import type { LightBoxItemProps } from './types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

/**
 * LightBoxItem renders null — it is a declarative data container.
 * LightBoxBody reads its props via React.Children to build slides and thumbnail strip.
 */
const _LightBoxItem = (_props: LightBoxItemProps): null => null;

const LightBoxItem = assignWithoutSideEffects(_LightBoxItem, {
  displayName: 'LightBoxItem',
});

export { LightBoxItem };
