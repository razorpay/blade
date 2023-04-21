import type {
  BladeComponentInstanceNode,
  BladeFrameNode,
  BladeGroupNode,
  BladeNode,
} from '~/code/types/Blade';

const canHaveChildren = (
  node: BladeNode,
): node is BladeGroupNode | BladeFrameNode | BladeComponentInstanceNode => {
  return node.type === 'GROUP' || node.type === 'FRAME' || node.type === 'INSTANCE';
};

export const findNode = (
  node: BladeNode,
  processNode: (node: BladeNode) => boolean,
): null | BladeNode => {
  if (node) {
    const shouldStopTraversal = processNode(node);
    if (shouldStopTraversal) {
      return node;
    }

    if (canHaveChildren(node)) {
      const children = node.children;

      for (const child of children) {
        const newNode = findNode(child, processNode);
        if (newNode) {
          return newNode;
        }
      }
    }

    return null;
  }

  return null;
};
