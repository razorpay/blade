import { convertFigmaIconNameToBladeIconName, isIconInstance } from '../../utils/iconUtils';
import { findNode } from '../../utils/findNode';
import type { BladeComponentInstanceNode } from '~/code/types/Blade';

export const getLinkIcon = (
  bladeInstance: BladeComponentInstanceNode,
  iconLayerName: 'Icon Left' | 'Icon Right',
): string => {
  let icon = '';
  let iconLeftNode = findNode(bladeInstance, (bladeNode) => bladeNode.layerName === iconLayerName);

  if (iconLeftNode !== null) {
    iconLeftNode = findNode(
      iconLeftNode,
      (bladeNode) => bladeNode.layerName === 'Icon (change here)',
    );
    if (isIconInstance(iconLeftNode as BladeComponentInstanceNode)) {
      icon = convertFigmaIconNameToBladeIconName(
        (iconLeftNode as BladeComponentInstanceNode)?.name || 'unidentified-icon',
      );
    }
  }

  return icon;
};

export const getLinkIconProps = (
  bladeInstance: BladeComponentInstanceNode,
): { icon: string; iconPosition: '' | 'left' | 'right' } => {
  const leftIcon = getLinkIcon(bladeInstance, 'Icon Left');
  if (leftIcon) {
    return { icon: leftIcon, iconPosition: 'left' };
  }

  const rightIcon = getLinkIcon(bladeInstance, 'Icon Right');
  if (rightIcon) {
    return { icon: rightIcon, iconPosition: 'right' };
  }

  return { icon: '', iconPosition: '' };
};
