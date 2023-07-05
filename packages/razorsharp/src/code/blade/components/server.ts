// eslint-disable-next-line import/no-cycle
import { transformFrameOrGroup } from './box';
import { transformButton } from './button';
import { transformTitle, transformHeading, transformText } from './typography';
import type { ServerFunctionReturnType } from '~/code/types/TransformFunction';
import type {
  BladeComponentInstanceNode,
  BladeFrameNode,
  BladeGroupNode,
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

export const generateBladeFrameCode = (bladeNode: BladeFrameNode): ServerFunctionReturnType => {
  return transformFrameOrGroup(bladeNode);
};

export const generateGroupNodeCode = (bladeNode: BladeGroupNode): ServerFunctionReturnType => {
  return transformFrameOrGroup(bladeNode);
};
