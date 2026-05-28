import { View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { componentIds } from './componentIds';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { size } from '~tokens/global';

type ActionListItemAssetProps = {
  /**
   * Source of the image (SVG URI string).
   */
  src: string | { uri: string };
  /**
   * Alt tag for the image
   */
  alt: string;
};

const _ActionListItemAsset = (props: ActionListItemAssetProps): React.ReactElement => {
  const uri = typeof props.src === 'string' ? props.src : props.src.uri;

  return (
    <View style={{ width: size[16], height: size[12], borderRadius: 2, overflow: 'hidden' }}>
      <SvgUri uri={uri} width={size[16]} height={size[12]} />
    </View>
  );
};

const ActionListItemAsset = assignWithoutSideEffects(_ActionListItemAsset, {
  componentId: componentIds.ActionListItemAsset,
});

export type { ActionListItemAssetProps };
export { ActionListItemAsset };
