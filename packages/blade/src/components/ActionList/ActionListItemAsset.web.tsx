import { componentIds } from './componentIds';
import { useTheme } from '~components/BladeProvider';
import type { WithComponentId } from '~utils';
import { makeSize } from '~utils';

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
  const { theme } = useTheme();
  return (
    <img
      src={props.src}
      alt={props.alt}
      width={makeSize(theme.spacing[5])}
      height={makeSize(theme.spacing[4])}
    />
  );
};

ActionListItemAsset.componentId = componentIds.ActionListItemAsset;

export { ActionListItemAsset, ActionListItemAssetProps };
