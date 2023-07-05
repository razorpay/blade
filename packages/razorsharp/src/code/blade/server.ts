import type {
  BladeNode,
  BladeComponentInstanceNode,
  BladeFrameNode,
  BladeGroupNode,
} from '../types/Blade';
import type { ServerFunctionReturnType } from '../types/TransformFunction';
// eslint-disable-next-line import/no-cycle
import {
  generateBladeFrameCode,
  generateGroupNodeCode,
  generateBladeComponentInstanceCodeForServer,
} from './components/server';

export const generateServerCode = ({
  bladeNodes,
}: {
  bladeNodes: BladeNode[];
}): ServerFunctionReturnType[] => {
  const componentSchema: ServerFunctionReturnType[] = [];

  bladeNodes.forEach((bladeNode) => {
    switch (bladeNode.type) {
      case 'INSTANCE': {
        const json = generateBladeComponentInstanceCodeForServer(
          bladeNode as BladeComponentInstanceNode,
        );
        componentSchema.push(json);
        break;
      }
      case 'FRAME': {
        const json = generateBladeFrameCode(bladeNode as BladeFrameNode);
        componentSchema.push(json);

        break;
      }

      case 'GROUP': {
        const json = generateGroupNodeCode(bladeNode as BladeGroupNode);
        componentSchema.push(json);
        break;
      }

      default:
        break;
    }
  });

  return componentSchema;
};
