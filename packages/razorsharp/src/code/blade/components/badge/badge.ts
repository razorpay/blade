import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { convertFigmaIconNameToBladeIconName, isIconInstance } from '../../utils/iconUtils';
import { isPresent } from '../../utils/isPresent';
import { findNode } from '../../utils/findNode';
import { findTextByLayerName } from '../../utils/findTextByLayerName';
import { bladeImports } from '../../utils/imports';
import { defaultProps } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { BladeComponentInstanceNode, BladeGroupNode, BladeProps } from '~/code/types/Blade';

export const transformBadge = (
  bladeInstance: BladeComponentInstanceNode,
): TransformFunctionReturnType => {
  const isIconPresent = isPresent(bladeInstance.componentProperties.Icon?.value);

  // TODO figure out why this prop does not exist in Blade code
  // const isAllCaps = isPresent(bladeInstance.componentProperties.allCaps?.value);

  const contrast = jsxValue(bladeInstance.componentProperties.contrast?.value).toLowerCase();
  const intent = jsxValue(bladeInstance.componentProperties.intent?.value).toLowerCase();
  const size = jsxValue(bladeInstance.componentProperties.size?.value).toLowerCase();

  const children = findTextByLayerName(bladeInstance, 'badge-text') ?? '';

  // TODO figure out why figma structure for Badge icon is
  // different from the way it is done in other places
  let icon = '';
  if (isIconPresent) {
    const iconNodeWrapper = findNode(
      bladeInstance,
      (bladeNode) => bladeNode.layerName === 'badge-icon',
    ) as BladeGroupNode;
    const iconNode = iconNodeWrapper.children[0];
    if (iconNode && isIconInstance(iconNode as BladeComponentInstanceNode)) {
      icon = convertFigmaIconNameToBladeIconName(
        (iconNode as BladeComponentInstanceNode)?.name || 'unidentified-icon',
      );
    }
  }

  const props: BladeProps = {
    contrast: {
      type: 'string',
      value: contrast,
    },
    variant: {
      type: 'string',
      value: intent,
    },
    size: {
      type: 'string',
      value: size,
    },
    icon: {
      type: 'instance',
      value: icon,
    },
  };

  return {
    component: component('Badge', {
      props,
      defaultValues: defaultProps,
      children,
    }),
    imports: bladeImports([icon, 'Badge']),
  };
};
