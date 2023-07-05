import { convertStyleNameToBladeName, isIconColorToken } from '../../utils/color';
import { component } from '../../utils/component';
import { findNode } from '../../utils/findNode';
import { convertFigmaIconNameToBladeIconName } from '../../utils/iconUtils';
import { bladeImports } from '../../utils/imports';
import { defaultValues } from './constants';
import type { ServerFunctionReturnType } from '~/code/types/TransformFunction';
import type {
  BladeComponentInstanceNode,
  BladeNode,
  BladeProps,
  BladeVectorNode,
} from '~/code/types/Blade';

const isBladeVectorNode = (node: BladeNode): node is BladeVectorNode => {
  return node.type === 'VECTOR';
};

export const transformIcon = (
  bladeInstance: BladeComponentInstanceNode,
): ServerFunctionReturnType => {
  const props: BladeProps = {};

  const bladeIconName = convertFigmaIconNameToBladeIconName(
    bladeInstance?.name || 'unidentified-icon',
  );

  // TODO fix mapping of pixels to size
  props.size = {
    value: 'medium',
    type: 'string',
  };

  const vectorNode = findNode(bladeInstance, (node) => node.type === 'VECTOR');
  if (vectorNode && isBladeVectorNode(vectorNode)) {
    if (vectorNode.fillStyleId !== figma.mixed) {
      const fillStyle = figma.getStyleById(vectorNode.fillStyleId);
      if (fillStyle) {
        const styleName = fillStyle.name;
        const bladeTokenName = convertStyleNameToBladeName(styleName);
        const isValidToken = isIconColorToken(bladeTokenName);

        props.color = {
          value: bladeTokenName,
          type: 'string',
          isCommented: !isValidToken,
          comment: isValidToken ? '' : 'Unsupported color token for Icon',
        };
      }
    }
  }

  return {
    component: component(bladeIconName, {
      props,
      defaultValues,
    }),
    imports: bladeImports([bladeIconName]),
  };
};
