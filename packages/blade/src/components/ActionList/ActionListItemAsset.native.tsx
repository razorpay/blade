import { Image } from 'react-native';
import { componentIds } from './componentIds';
import { useTheme } from '~components/BladeProvider';
import type { WithComponentId } from '~utils';

const ActionListItemAsset: WithComponentId<{ src: string; alt: string }> = (props) => {
  const { theme } = useTheme();
  return (
    <Image
      source={{ uri: props.src }}
      style={{ width: theme.spacing[5], height: theme.spacing[4] }}
      accessibilityIgnoresInvertColors
    />
  );
};

ActionListItemAsset.componentId = componentIds.ActionListItemAsset;

export { ActionListItemAsset };
