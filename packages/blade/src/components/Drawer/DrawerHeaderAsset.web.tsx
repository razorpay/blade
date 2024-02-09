import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { size } from '~tokens/global';
import { drawerComponentIds } from './drawerComponentIds';

type DrawerHeaderAssetProps = {
  /**
   * Source of the image.
   */
  src: string;
  /**
   * Alt tag for the image
   */
  alt: string;
};
const _DrawerHeaderAsset = (props: DrawerHeaderAssetProps): React.ReactElement => {
  return <img src={props.src} alt={props.alt} width={size[16]} height={size[12]} />;
};

const DrawerHeaderAsset = assignWithoutSideEffects(_DrawerHeaderAsset, {
  componentId: drawerComponentIds.DrawerHeaderAsset,
});

export type { DrawerHeaderAssetProps };
export { DrawerHeaderAsset };
