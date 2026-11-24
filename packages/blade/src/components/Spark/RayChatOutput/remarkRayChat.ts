/**
 * A remark plugin that applies RAY's chat rules to the Markdown tree's top-level blocks:
 *
 *   paragraph with line breaks       ─▶  one paragraph per line
 *   the opening paragraph            ─▶  the main title  (data-ray-chat-lead)
 *   ---                              ─▶  removed; the block after it opens a section
 *   every block after the first      ─▶  data-ray-chat-gap:
 *                                          24  a title, or the block after a divider  (before a section)
 *                                          12  the block under a title, or the next line of a paragraph
 *                                              (Figma: 11, its paragraph spacing; 12 is Blade's nearest)
 *                                          16  any other block
 *
 * Every rule looks only at a block and the blocks before it, never after, so a reply streaming
 * in never restyles a block it has drawn: the main title is decided by the first block alone.
 * A bold line on its own stays bold body text, as in Figma (a title rule would only apply once
 * its `**` closed).
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

type RemarkRayChatOptions = {
  /** Whether the opening paragraph is the main title. Off for a later part of one reply. */
  hasMainTitle?: boolean;
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

const setProperties = (node: MarkdownNode, properties: Record<string, unknown>): void => {
  node.data = { ...node.data, hProperties: { ...node.data?.hProperties, ...properties } };
};

const remarkRayChat = ({ hasMainTitle = true }: RemarkRayChatOptions = {}) => (
  tree: MarkdownNode,
): void => {
  // Blocks that are the second or later line of one paragraph in the source.
  const nextLines = new WeakSet<MarkdownNode>();
  const blocks = (tree.children ?? []).flatMap((node) => {
    if (node.type !== 'paragraph') return [node];
    const lines = splitAtLineBreaks(node);
    lines.slice(1).forEach((line) => nextLines.add(line));
    return lines;
  });

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
      if (hasMainTitle && node.type === 'paragraph') setProperties(node, { dataRayChatLead: true });
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
export type { RemarkRayChatOptions };
