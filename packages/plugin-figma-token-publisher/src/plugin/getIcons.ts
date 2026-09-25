import showNotification from './showNotification';

const CONTAINER_TYPES: NodeType[] = ['FRAME', 'GROUP', 'SECTION'];
const SHAPE_TYPES: NodeType[] = [
  'VECTOR',
  'BOOLEAN_OPERATION',
  'ELLIPSE',
  'RECTANGLE',
  'LINE',
  'POLYGON',
  'STAR',
];

const isVisible = (node: SceneNode): boolean => node.visible;

/**
 * A lone frame whose children are all shapes is an icon drawn directly in a frame, not a board of
 * icons. Exporting its children would turn every path into its own "icon".
 */
const isBoardOfIcons = (node: SceneNode): node is FrameNode | GroupNode | SectionNode =>
  CONTAINER_TYPES.includes(node.type) &&
  'children' in node &&
  node.children.some((child) => !SHAPE_TYPES.includes(child.type));

/** A variant set holds icons, never is one; its variants are exported individually. */
const expandVariantSets = (nodes: readonly SceneNode[]): SceneNode[] =>
  nodes.flatMap((node) =>
    node.type === 'COMPONENT_SET' ? node.children.filter(isVisible) : [node],
  );

/**
 * One selected board exports each icon on it; anything else exports the selected nodes themselves.
 * `generateIcons.mjs` turns each entry into a component, so the order here is the order of the
 * layers, not the order the exports happen to resolve in.
 */
const getIconNodes = (selection: readonly SceneNode[]): SceneNode[] => {
  if (selection.length === 1 && isBoardOfIcons(selection[0])) {
    return expandVariantSets(selection[0].children.filter(isVisible));
  }
  return expandVariantSets(selection.filter(isVisible));
};

/** Variant layer names are always `prop=value, prop=value`. */
const parseVariantName = (name: string): Map<string, string> =>
  new Map(
    name.split(',').map((pair) => {
      const [property = '', value = ''] = pair.split('=');
      return [property.trim(), value.trim()];
    }),
  );

/**
 * A variant's layer name (`variant=filled`) says nothing about which icon it is. The icon is the
 * set's name plus every value that differs from the set's default variant, so the default keeps the
 * existing name (`star` → `StarIcon`) and the rest extend it (`star filled` → `StarFilledIcon`).
 */
const getIconName = (node: SceneNode): string => {
  const variantSet = node.parent;
  if (node.type !== 'COMPONENT' || variantSet?.type !== 'COMPONENT_SET') {
    return node.name.trim();
  }

  const defaultValues = parseVariantName(variantSet.defaultVariant.name);
  const distinctValues = [...parseVariantName(node.name)]
    .filter(([property, value]) => defaultValues.get(property) !== value)
    .map(([, value]) => value);

  return [variantSet.name.trim(), ...distinctValues].join(' ');
};

const getDuplicateNames = (names: string[]): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  names.forEach((name) => {
    if (seen.has(name)) duplicates.add(name);
    seen.add(name);
  });
  return [...duplicates];
};

const getIcons = async (): Promise<void> => {
  const iconNodes = getIconNodes(figma.currentPage.selection);

  if (!iconNodes.length) {
    showNotification({
      figma,
      type: 'error',
      text: '⛔️ Select a frame of icons, or the icons themselves, before exporting.',
    });
    return;
  }

  // Two icons with one name become one component, and the second silently replaces the first.
  const iconNames = iconNodes.map(getIconName);
  const duplicateNames = getDuplicateNames(iconNames);
  if (duplicateNames.length) {
    showNotification({
      figma,
      type: 'error',
      text: `⛔️ Icon names must be unique. Rename: ${duplicateNames.join(', ')}`,
    });
    return;
  }

  const svgStrings = await Promise.all(
    iconNodes.map(async (node, index) => ({
      [iconNames[index]]: await node.exportAsync({ format: 'SVG_STRING' }),
    })),
  );

  showNotification({
    figma,
    type: 'information',
    text: `✅ ${svgStrings.length} icon${svgStrings.length === 1 ? '' : 's'} exported`,
  });
  figma.ui.postMessage({
    type: 'export-svg-icons',
    data: svgStrings,
  });
  // the exported SVG blob needs a readable textarea, not the default token-field sized window
  figma.ui.resize(460, 560);
  figma.ui.show();
};

export default getIcons;
