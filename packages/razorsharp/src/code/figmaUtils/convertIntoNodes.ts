import type {
  BladeComponentInstanceNode,
  BladeFrameNode,
  BladeGroupNode,
  BladeNode,
  BladeRectangleNode,
  BladeTextNode,
  BladeVectorNode,
} from '../types/Blade';

const convertBaseNode = (
  figmaNode: Readonly<SceneNode>,
  bladeParent: BladeNode | null,
): BladeNode => {
  const bladeNode: BladeNode = {
    id: figmaNode.id,
    layerName: figmaNode.name,
    type: figmaNode.type,
    parent: bladeParent,
  };

  return bladeNode;
};

/**
 * Blade component structures aren't simple
 * In case of icons, name of the component can be found in the main component property
 * In case of other components, use the parent's name instead
 * @param figmaNode
 * @returns name of the component in figma
 */
const getComponentName = (figmaNode: Readonly<InstanceNode>): string | null => {
  return figmaNode.mainComponent?.parent?.name ?? figmaNode.mainComponent?.name ?? null;
};

const convertInstanceToNode = (
  figmaNode: Readonly<InstanceNode>,
  bladeNode: BladeNode,
): BladeComponentInstanceNode => {
  const bladeComponentInstance: BladeComponentInstanceNode = {
    ...bladeNode,
    componentProperties: figmaNode.componentProperties,
    type: 'INSTANCE',
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    children: convertIntoBladeNodes(figmaNode.children, bladeNode),
    name: getComponentName(figmaNode),
    fills: Array.isArray(figmaNode.fills)
      ? figmaNode.fills.filter((fill) => fill.visible)
      : figmaNode.fills,
    fillStyleId: figmaNode.fillStyleId,
    width: figmaNode.width,
    height: figmaNode.height,
  };
  return bladeComponentInstance;
};

const convertTextToNode = (figmaNode: Readonly<TextNode>, bladeNode: BladeNode): BladeTextNode => {
  const bladeTextNode: BladeTextNode = {
    ...bladeNode,
    type: 'TEXT',
    characters: figmaNode.characters,
    textStyleId: figmaNode.textStyleId,
  };

  return bladeTextNode;
};

const convertFrameToNode = (
  figmaNode: Readonly<FrameNode>,
  bladeNode: BladeNode,
): BladeFrameNode => {
  const bladeFrame: BladeFrameNode = {
    ...bladeNode,
    type: 'FRAME',
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    children: convertIntoBladeNodes(figmaNode.children, bladeNode),
    counterAxisAlignItems: figmaNode.counterAxisAlignItems,
    counterAxisSizingMode: figmaNode.counterAxisSizingMode,
    primaryAxisAlignItems: figmaNode.primaryAxisAlignItems,
    primaryAxisSizingMode: figmaNode.primaryAxisSizingMode,
    paddingTop: figmaNode.paddingTop,
    paddingRight: figmaNode.paddingRight,
    paddingLeft: figmaNode.paddingLeft,
    paddingBottom: figmaNode.paddingBottom,
    layoutMode: figmaNode.layoutMode,
    itemSpacing: figmaNode.itemSpacing,
    height: figmaNode.height,
    width: figmaNode.width,
    fills: Array.isArray(figmaNode.fills)
      ? figmaNode.fills.filter((fill) => fill.visible)
      : figmaNode.fills,
    fillStyleId: figmaNode.fillStyleId,
    layoutSizingHorizontal: figmaNode.layoutSizingHorizontal,
    layoutSizingVertical: figmaNode.layoutSizingVertical,
    inferredAutoLayout: figmaNode.inferredAutoLayout,
  };
  return bladeFrame;
};

const convertGroupToNode = (
  figmaNode: Readonly<GroupNode>,
  bladeNode: BladeNode,
): BladeGroupNode => {
  const bladeGroupNode: BladeGroupNode = {
    ...bladeNode,
    type: 'GROUP',
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    children: convertIntoBladeNodes(figmaNode.children, bladeNode),
    rotation: figmaNode.rotation,
    layoutAlign: figmaNode.layoutAlign,
    layoutGrow: figmaNode.layoutGrow,
    layoutPositioning: figmaNode.layoutPositioning,
  };
  return bladeGroupNode;
};

const convertVectorToNode = (
  figmaNode: Readonly<VectorNode>,
  bladeNode: BladeNode,
): BladeVectorNode => {
  const bladeVectorNode: BladeVectorNode = {
    ...bladeNode,
    type: 'VECTOR',
    fills: Array.isArray(figmaNode.fills)
      ? figmaNode.fills.filter((fill) => fill.visible)
      : figmaNode.fills,
    fillStyleId: figmaNode.fillStyleId,
  };
  return bladeVectorNode;
};

const convertRectangleToNode = (
  figmaNode: Readonly<RectangleNode>,
  bladeNode: BladeNode,
): BladeRectangleNode => {
  const bladeVectorNode: BladeRectangleNode = {
    ...bladeNode,
    type: 'RECTANGLE',
    fills: Array.isArray(figmaNode.fills)
      ? figmaNode.fills.filter((fill) => fill.visible)
      : figmaNode.fills,
    height: figmaNode.height,
    width: figmaNode.width,
  };
  return bladeVectorNode;
};

export const convertIntoBladeNodes = (
  figmaNodes: ReadonlyArray<SceneNode>,
  bladeParent: BladeNode | null,
): Array<BladeNode> => {
  const bladeNodes: BladeNode[] = [];
  figmaNodes.forEach((figmaNode) => {
    if (!figmaNode.visible) {
      return;
    }

    let bladeNode = convertBaseNode(figmaNode, bladeParent);

    switch (figmaNode.type) {
      case 'INSTANCE':
        bladeNode = convertInstanceToNode(figmaNode, bladeNode);
        break;
      case 'TEXT':
        bladeNode = convertTextToNode(figmaNode, bladeNode);
        break;
      case 'FRAME':
        bladeNode = convertFrameToNode(figmaNode, bladeNode);
        break;
      case 'GROUP':
        bladeNode = convertGroupToNode(figmaNode, bladeNode);
        break;
      case 'VECTOR':
        bladeNode = convertVectorToNode(figmaNode, bladeNode);
        break;
      case 'RECTANGLE':
        bladeNode = convertRectangleToNode(figmaNode, bladeNode);
        break;
      default:
        break;
    }

    bladeNodes.push(bladeNode);
  });

  return bladeNodes;
};
