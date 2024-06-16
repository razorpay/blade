import { componentIds } from './componentIds';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { size } from '~tokens/global';

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
const _ActionListItemAsset = (props: ActionListItemAssetProps): React.ReactElement => {
  return <img src={props.src} alt={props.alt} width={size[16]} height={size[12]} />;
};

const ActionListItemAsset = assignWithoutSideEffects(_ActionListItemAsset, {
  componentId: componentIds.ActionListItemAsset,
});

export type { ActionListItemAssetProps };
export { ActionListItemAsset };
