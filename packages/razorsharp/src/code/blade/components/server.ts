/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-cycle */
import { btoa } from '../utils/base64';
import { transformFrameOrGroup } from './box';
import { transformButton } from './button';
import { transformTitle, transformHeading, transformText } from './typography';
import type { ServerFunctionReturnType } from '~/code/types/TransformFunction';
import type {
  BladeComponentInstanceNode,
  BladeFrameNode,
  BladeGroupNode,
  BladeRectangleNode,
} from '~/code/types/Blade';

export const generateBladeComponentInstanceCodeForServer = (
  bladeComponentInstance: BladeComponentInstanceNode,
): ServerFunctionReturnType => {
  switch (bladeComponentInstance.name) {
    case 'Button':
      return transformButton(bladeComponentInstance);
    case 'Title':
      return transformTitle(bladeComponentInstance);
    case 'Heading':
      return transformHeading(bladeComponentInstance);
    case 'Text':
      return transformText(bladeComponentInstance);
    default:
      return {
        componentName: bladeComponentInstance.name ?? '',
        props: {},
      };
  }
};

export const generateBladeFrameCode = (
  bladeNode: BladeFrameNode,
): Promise<ServerFunctionReturnType> => {
  return transformFrameOrGroup(bladeNode);
};

export const generateGroupNodeCode = (
  bladeNode: BladeGroupNode,
): Promise<ServerFunctionReturnType> => {
  return transformFrameOrGroup(bladeNode);
};

export const generateRectangleNodeCode = async (
  bladeNode: BladeRectangleNode,
): Promise<ServerFunctionReturnType> => {
  if (bladeNode.fills !== figma.mixed) {
    for (const paint of bladeNode.fills) {
      if (paint.type === 'IMAGE' && paint.imageHash) {
        const image = figma.getImageByHash(paint.imageHash);
        if (image === null) {
          continue;
        }
        const bytes = await image.getBytesAsync();
        const height = bladeNode.height.toFixed(0);
        const width = bladeNode.width.toFixed(0);

        if (bytes) {
          const base64String = btoa(String.fromCharCode(...bytes));
          const src = `data:image/png;base64,${base64String}`;

          return {
            componentName: 'Image',
            props: {
              src: {
                value: src,
                type: 'string',
              },
              width: {
                value: width,
                type: 'string',
              },
              height: {
                value: height,
                type: 'string',
              },
            },
          };
        }
      }
    }
  }

  return {
    componentName: 'Box',
    props: {},
  };
};
