import { Image, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { componentIds } from './componentIds';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { size } from '~tokens/global';

type ActionListItemAssetProps = {
  /**
   * Source of the image.
   *
   * Can be a string URI (rendered as SVG), `{ uri: string }`, or `require('./image')` for local assets.
   */
  src: string | { uri: string } | ImageSourcePropType;
  /**
   * Alt tag for the image
   */
  alt: string;
};

const _ActionListItemAsset = (props: ActionListItemAssetProps): React.ReactElement => {
  if (typeof props.src === 'string') {
    return (
      <View style={{ width: size[16], height: size[12], borderRadius: 2, overflow: 'hidden' }}>
        <SvgUri uri={props.src} width={size[16]} height={size[12]} />
      </View>
    );
  }

  return (
    <Image
      source={props.src as ImageSourcePropType}
      style={{ width: size[16], height: size[12], borderRadius: 2 }}
      accessibilityLabel={props.alt}
    />
  );
};

const ActionListItemAsset = assignWithoutSideEffects(_ActionListItemAsset, {
  componentId: componentIds.ActionListItemAsset,
});

export type { ActionListItemAssetProps };
export { ActionListItemAsset };
