import { componentIds } from './componentIds';
import type { WithComponentId } from '~utils';
import sizes from '~tokens/global/sizes';

type ActionListItemAssetProps = {
  /**
   * Source of the image.
   */
  src: string;
  /**
   * Alt tag for the image
   */
  alt: string;
};
const ActionListItemAsset: WithComponentId<ActionListItemAssetProps> = (props) => {
  return <img src={props.src} alt={props.alt} width={sizes[400]} height={sizes[300]} />;
};

ActionListItemAsset.componentId = componentIds.ActionListItemAsset;

export { ActionListItemAsset, ActionListItemAssetProps };
