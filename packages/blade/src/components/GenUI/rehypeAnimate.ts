import type { Element, Root, Text, Node, Parent } from 'hast';
import { SKIP, visitParents } from 'unist-util-visit-parents';

export interface AnimateOptions {
  duration?: number;
  easing?: string;
  sep?: 'word' | 'char';
}

const SKIP_TAGS = new Set(['code', 'pre', 'svg', 'math', 'annotation']);

const isElement = (node: unknown): node is Element =>
  typeof node === 'object' &&
  node !== null &&
  'type' in node &&
  (node as Element).type === 'element';

const hasSkipAncestor = (ancestors: Node[]): boolean =>
  ancestors.some((ancestor) => isElement(ancestor) && SKIP_TAGS.has(ancestor.tagName));

const splitByWord = (text: string): string[] => {
  const parts: string[] = [];
  let current = '';
  let inWhitespace = false;

  for (const char of text) {
    const isWs = /\s/.test(char);
    if (isWs !== inWhitespace && current) {
      parts.push(current);
      current = '';
    }
    current += char;
    inWhitespace = isWs;
  }

  if (current) {
    parts.push(current);
  }

  return parts;
};

const splitByChar = (text: string): string[] => {
  const parts: string[] = [];
  let wsBuffer = '';

  for (const char of text) {
    if (/\s/.test(char)) {
      wsBuffer += char;
    } else {
      if (wsBuffer) {
        parts.push(wsBuffer);
        wsBuffer = '';
      }
      parts.push(char);
    }
  }

  if (wsBuffer) {
    parts.push(wsBuffer);
  }

  return parts;
};

const makeSpan = (word: string, duration: number, easing: string): Element => ({
  type: 'element',
  tagName: 'span',
  properties: {
    'data-animate-word': true,
    style: `--animate-duration:${duration}ms;--animate-easing:${easing}`,
  },
  children: [{ type: 'text', value: word }],
});

/**
 * Creates a rehype plugin that animates text by wrapping words/characters in spans.
 * Words fade in as they mount, creating a smooth text-reveal effect during AI streaming.
 *
 * @param options - Animation configuration options
 * @returns A rehype plugin function
 */
export function createRehypeAnimate(options?: AnimateOptions): () => (tree: Root) => void {
  const duration = options?.duration ?? 300;
  const easing = options?.easing ?? 'ease-in-out';
  const sep = options?.sep ?? 'word';

  return () => (tree: Root) => {
    visitParents(tree, 'text', (node: Text, ancestors: Node[]) => {
      const parent = ancestors[ancestors.length - 1] as Parent | undefined;
      if (!parent || !('children' in parent)) {
        return undefined;
      }

      if (hasSkipAncestor(ancestors)) {
        return SKIP;
      }

      const index = parent.children.indexOf(node);
      if (index === -1) {
        return undefined;
      }

      const text = node.value;
      if (!text.trim()) {
        return undefined;
      }

      const parts = sep === 'char' ? splitByChar(text) : splitByWord(text);

      const nodes: (Element | Text)[] = parts.map((part) => {
        if (/^\s+$/.test(part)) {
          return { type: 'text', value: part } as Text;
        }
        return makeSpan(part, duration, easing);
      });

      parent.children.splice(index, 1, ...nodes);
      return index + nodes.length;
    });
  };
}

// Default animate plugin with fadeIn animation
export const rehypeAnimate = createRehypeAnimate();
