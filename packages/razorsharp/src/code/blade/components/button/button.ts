import { jsxValue } from '../../utils/attributes';
import { findNode } from '../../utils/findNode';
import { findTextByLayerName } from '../../utils/findTextByLayerName';
import { findIconByLayerName } from '../../utils/findIconByLayerName';
import { transformButtonVariant } from './utils';
import type { ServerFunctionReturnType } from '~/code/types/TransformFunction';
import type { BladeComponentInstanceNode, BladeProps } from '~/code/types/Blade';

export const transformButton = (
  bladeComponentInstance: BladeComponentInstanceNode,
): ServerFunctionReturnType => {
  const componentProperties = bladeComponentInstance.componentProperties;

  const size = componentProperties.size?.value;
  const variant = componentProperties.variant?.value;
  let icon = '';
  let iconPosition = '';

  const children = findTextByLayerName(bladeComponentInstance, 'Text') ?? '';

  const iconLeftNode = findNode(
    bladeComponentInstance,
    (bladeNode) => bladeNode.layerName === 'Icon Left',
  );

  if (iconLeftNode) {
    icon = findIconByLayerName(iconLeftNode, 'Icon (change here)') ?? '';
    iconPosition = 'left';
  }

  const iconRightNode = findNode(
    bladeComponentInstance,
    (bladeNode) => bladeNode.layerName === 'Icon Right',
  );

  if (iconRightNode) {
    icon = findIconByLayerName(iconRightNode, 'Icon (change here)') ?? '';
    iconPosition = 'right';
  }

  const props: BladeProps = {
    size: { value: jsxValue(size).toLowerCase(), type: 'string' },
    variant: {
      value: transformButtonVariant(jsxValue(variant)),
      type: 'string',
    },
    isFullWidth: {
      value: jsxValue(componentProperties.isFullWidth?.value),
      type: 'boolean',
    },
    icon: {
      value: icon,
      type: 'instance',
    },
    iconPosition: {
      value: iconPosition,
      type: 'string',
    },
  };

  return {
    componentName: 'Button',
    props,
    children: [children],
  };
};
