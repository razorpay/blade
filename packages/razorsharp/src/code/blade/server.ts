/* eslint-disable no-await-in-loop */
import type {
  BladeNode,
  BladeComponentInstanceNode,
  BladeFrameNode,
  BladeGroupNode,
  BladeRectangleNode,
} from '../types/Blade';
import type { ServerFunctionReturnType } from '../types/TransformFunction';
// eslint-disable-next-line import/no-cycle
import {
  generateBladeFrameCode,
  generateGroupNodeCode,
  generateBladeComponentInstanceCodeForServer,
  generateRectangleNodeCode,
} from './components/server';

export const generateServerCode = async ({
  bladeNodes,
}: {
  bladeNodes: BladeNode[];
}): Promise<ServerFunctionReturnType[]> => {
  const componentSchema: ServerFunctionReturnType[] = [];

  for (const bladeNode of bladeNodes) {
    switch (bladeNode.type) {
      case 'INSTANCE': {
        const json = generateBladeComponentInstanceCodeForServer(
          bladeNode as BladeComponentInstanceNode,
        );
        componentSchema.push(json);
        break;
      }
      case 'FRAME': {
        const json = await generateBladeFrameCode(bladeNode as BladeFrameNode);
        componentSchema.push(json);

        break;
      }

      case 'GROUP': {
        const json = await generateGroupNodeCode(bladeNode as BladeGroupNode);
        componentSchema.push(json);
        break;
      }

      case 'RECTANGLE': {
        const json = await generateRectangleNodeCode(bladeNode as BladeRectangleNode);
        componentSchema.push(json);
        break;
      }

      default:
        break;
    }
  }

  return componentSchema;
};
