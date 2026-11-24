/**
 * A remark plugin that applies RAY's chat rules to the Markdown tree's top-level blocks:
 *
 *   paragraph with line breaks       ─▶  one paragraph per line
 *   paragraph that is only **bold**   ─▶  a title (heading, depth 3)
 *   a reply with any title           ─▶  its first paragraph is the main title  (data-ray-chat-lead)
 *   ---                              ─▶  removed; the block after it opens a section
 *   every block after the first      ─▶  data-ray-chat-gap:
 *                                          24  a title, or the block after a divider  (before a section)
 *                                          12  the block under a title, or the next line of a paragraph
 *                                              (Figma: 11, its paragraph spacing; 12 is Blade's nearest)
 *                                          16  any other block
 *
 * Gaps live on the blocks as attributes so the styles map them to spacing tokens, and so they
 * can be tested without a layout engine.
 */

type MarkdownNode = {
  type: string;
  value?: string;
  depth?: number;
  children?: MarkdownNode[];
  data?: { hProperties?: Record<string, unknown> } & Record<string, unknown>;
};

type RayChatGap = '12' | '16' | '24';

// Top-level nodes that draw nothing: link definitions, and raw HTML (left out by skipHtml).
const DRAWS_NOTHING = new Set(['definition', 'html']);

const isBlank = (node: MarkdownNode): boolean => node.type === 'text' && !node.value?.trim();

/** "A line break inside a paragraph starts a new paragraph." */
const splitAtLineBreaks = (paragraph: MarkdownNode): MarkdownNode[] => {
  const lines: MarkdownNode[][] = [[]];
  for (const child of paragraph.children ?? []) {
    if (child.type === 'break') {
      lines.push([]);
    } else if (child.type === 'text' && child.value?.includes('\n')) {
      child.value.split('\n').forEach((piece, index) => {
        if (index > 0) lines.push([]);
        if (piece) lines[lines.length - 1].push({ ...child, value: piece });
      });
    } else {
      lines[lines.length - 1].push(child);
    }
  }
  return lines
    .filter((line) => line.some((node) => !isBlank(node)))
    .map((children) => ({ ...paragraph, children }));
};

/** "A bold line on its own becomes the smaller title." */
const asTitleIfBoldLine = (paragraph: MarkdownNode): MarkdownNode => {
  const parts = (paragraph.children ?? []).filter((node) => !isBlank(node));
  if (parts.length !== 1 || parts[0].type !== 'strong') return paragraph;
  return { type: 'heading', depth: 3, children: parts[0].children, data: paragraph.data };
};

const setProperties = (node: MarkdownNode, properties: Record<string, unknown>): void => {
  node.data = { ...node.data, hProperties: { ...node.data?.hProperties, ...properties } };
};

const remarkRayChat = () => (tree: MarkdownNode): void => {
  // Blocks that are the second or later line of one paragraph in the source.
  const nextLines = new WeakSet<MarkdownNode>();
  const blocks = (tree.children ?? []).flatMap((node) => {
    if (node.type !== 'paragraph') return [node];
    return splitAtLineBreaks(node).map((line, index) => {
      const block = asTitleIfBoldLine(line);
      if (index > 0) nextLines.add(block);
      return block;
    });
  });
  const hasSections = blocks.some((node) => node.type === 'heading');

  const kept: MarkdownNode[] = [];
  let previous: MarkdownNode | undefined;
  let opensSection = false;
  for (const node of blocks) {
    if (node.type === 'thematicBreak') {
      opensSection = previous !== undefined;
      continue;
    }
    kept.push(node);
    if (DRAWS_NOTHING.has(node.type)) continue;

    if (previous === undefined) {
      if (hasSections && node.type === 'paragraph') setProperties(node, { dataRayChatLead: true });
    } else {
      let gap: RayChatGap = '16';
      if (node.type === 'heading' || opensSection) gap = '24';
      else if (previous.type === 'heading' || nextLines.has(node)) gap = '12';
      setProperties(node, { dataRayChatGap: gap });
    }
    previous = node;
    opensSection = false;
  }
  tree.children = kept;
};

export { remarkRayChat };
