import { componentIds } from './componentIds';
import type { WithComponentId } from '~utils';
import size from '~tokens/global/size';

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
  return <img src={props.src} alt={props.alt} width={size[16]} height={size[12]} />;
};

ActionListItemAsset.componentId = componentIds.ActionListItemAsset;

export { ActionListItemAsset, ActionListItemAssetProps };
