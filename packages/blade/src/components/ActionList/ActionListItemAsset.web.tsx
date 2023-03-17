import { componentIds } from './componentIds';
import size from '~tokens/global/size';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';

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
const _ActionListItemAsset = (props: ActionListItemAssetProps): JSX.Element => {
  return <img src={props.src} alt={props.alt} width={size[16]} height={size[12]} />;
};

const ActionListItemAsset = assignWithoutSideEffects(_ActionListItemAsset, {
  componentId: componentIds.ActionListItemAsset,
});

export { ActionListItemAsset, ActionListItemAssetProps };
