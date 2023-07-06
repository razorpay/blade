export interface BaseNode {
  layerName: string;
  id: string;
  type: SceneNode['type'];
  parent: BladeNode | null;
}

type BladeComponentProperties = {
  [key: string]: { type: ComponentPropertyType; value: string | boolean } | undefined;
};

export interface BladeComponentInstanceNode extends BaseNode {
  componentProperties: BladeComponentProperties;
  type: InstanceNode['type'];
  children: BladeNode[];
  name: string | null;
  fills: InstanceNode['fills'];
  fillStyleId: InstanceNode['fillStyleId'];
  width: InstanceNode['width'];
  height: InstanceNode['height'];
}

export type BladeNode =
  | BladeComponentInstanceNode
  | BladeFrameNode
  | BladeTextNode
  | BladeGroupNode
  | BladeVectorNode
  | BladeRectangleNode
  | BaseNode;

export interface BladeFrameNode extends BaseNode {
  type: FrameNode['type'];
  children: BladeNode[];
  layoutMode: FrameNode['layoutMode'];
  primaryAxisAlignItems: FrameNode['primaryAxisAlignItems'];
  primaryAxisSizingMode: FrameNode['primaryAxisSizingMode'];
  counterAxisAlignItems: FrameNode['counterAxisAlignItems'];
  counterAxisSizingMode: FrameNode['counterAxisSizingMode'];
  paddingLeft: FrameNode['paddingLeft'];
  paddingRight: FrameNode['paddingRight'];
  paddingBottom: FrameNode['paddingBottom'];
  paddingTop: FrameNode['paddingTop'];
  itemSpacing: FrameNode['itemSpacing'];
  width: FrameNode['width'];
  height: FrameNode['height'];
  fills: FrameNode['fills'];
  fillStyleId: FrameNode['fillStyleId'];
  layoutSizingVertical: FrameNode['layoutSizingVertical'];
  layoutSizingHorizontal: FrameNode['layoutSizingHorizontal'];
  inferredAutoLayout: FrameNode['inferredAutoLayout'];
}

export interface BladeTextNode extends BaseNode {
  characters: TextNode['characters'];
  type: TextNode['type'];
  textStyleId: TextNode['textStyleId'];
}

export interface BladeGroupNode extends BaseNode {
  type: 'GROUP';
  children: BladeNode[];
  rotation: GroupNode['rotation'];
  layoutAlign: GroupNode['layoutAlign'];
  layoutGrow: GroupNode['layoutGrow'];
  layoutPositioning: GroupNode['layoutPositioning'];
}

export interface BladeVectorNode extends BaseNode {
  type: VectorNode['type'];
  fillStyleId: VectorNode['fillStyleId'];
  fills: VectorNode['fills'];
}

export interface BladeRectangleNode extends BaseNode {
  type: RectangleNode['type'];
  fills: RectangleNode['fills'];
  height: RectangleNode['height'];
  width: RectangleNode['width'];
}

type JSXType = 'string' | 'boolean' | 'number' | 'instance' | 'array';

export type JSXValue = {
  type: JSXType;
  value: string;
  isCommented?: boolean;
  comment?: string;
};

export type BladeProps = Record<string, JSXValue>;

export type BladeHelperProps = Record<string, JSXType>;
