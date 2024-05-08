import { findNode } from './findNode';
import { convertFigmaIconNameToBladeIconName, isIconInstance } from './iconUtils';
import type { BladeComponentInstanceNode, BladeNode } from '~/code/types/Blade';

const isBladeComponentInstanceNode = (
  node: BladeNode | null,
): node is BladeComponentInstanceNode => {
  if (node === null) return false;
  return node.type === 'INSTANCE';
};

export const findIconByLayerName = (bladeNode: BladeNode, layerName: string): string | null => {
  const validateNode: (node: BladeNode) => boolean = (node) =>
    node.layerName === layerName && node.type === 'INSTANCE';

  const iconNode = findNode(bladeNode, validateNode);
  if (isBladeComponentInstanceNode(iconNode) && isIconInstance(iconNode)) {
    return convertFigmaIconNameToBladeIconName(iconNode.name || 'unidentified-icon');
  }

  return null;
};
