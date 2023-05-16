import type {
  BladeNode,
  BladeComponentInstanceNode,
  BladeFrameNode,
  BladeTextNode,
  BladeGroupNode,
} from '../types/Blade';
import type { TransformFunctionReturnType } from '../types/TransformFunction';
import {
  generateBladeComponentInstanceCode,
  generateBladeFrameCode,
  generateTextNodeCode,
  generateGroupNodeCode,
} from './components';
import { mergeImports } from './utils/imports';

export const generateBladeCode = ({
  bladeNodes,
}: {
  bladeNodes: BladeNode[];
}): TransformFunctionReturnType => {
  let componentCode = '';
  let allImports = {};

  bladeNodes.forEach((bladeNode) => {
    switch (bladeNode.type) {
      case 'INSTANCE': {
        const { component, imports } = generateBladeComponentInstanceCode(
          bladeNode as BladeComponentInstanceNode,
        );
        componentCode += component;
        allImports = mergeImports(allImports, imports ?? {});
        break;
      }
      case 'FRAME': {
        const { component, imports } = generateBladeFrameCode(bladeNode as BladeFrameNode);
        componentCode += component;
        allImports = mergeImports(allImports, imports ?? {});
        break;
      }
      case 'TEXT': {
        const { component, imports } = generateTextNodeCode(bladeNode as BladeTextNode);
        componentCode += component;
        allImports = mergeImports(allImports, imports ?? {});
        break;
      }

      case 'GROUP': {
        const { component, imports } = generateGroupNodeCode(bladeNode as BladeGroupNode);
        componentCode += component;
        allImports = mergeImports(allImports, imports ?? {});
        break;
      }

      default:
        break;
    }
  });

  return { component: componentCode, imports: allImports };
};
