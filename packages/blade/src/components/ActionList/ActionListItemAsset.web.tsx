import { componentIds } from './componentIds';
import { useTheme } from '~components/BladeProvider';
import type { WithComponentId } from '~utils';
import { makeSize } from '~utils';

const ActionListItemAsset: WithComponentId<{ src: string; alt: string }> = (props) => {
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

export { ActionListItemAsset };
