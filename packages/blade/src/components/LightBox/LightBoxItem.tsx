import type { LightBoxItemProps } from './types';

/**
 * LightBoxItem renders null — it is a declarative data container.
 * LightBoxBody reads its props via React.Children to build slides and thumbnail strip.
 */
const LightBoxItem = (_props: LightBoxItemProps): null => null;

LightBoxItem.displayName = 'LightBoxItem';

export { LightBoxItem };
