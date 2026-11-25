import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { RayChatOutput } from '../RayChatOutput';
import { remarkRayChat } from '../remarkRayChat';
import { getComponentId } from '~utils/isValidAllowedChildren';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

/**
 * Jest can't load the ESM-only react-markdown (jest-setup.web.js mocks it), so these tests check
 * what RayChatOutput hands it and how each element override draws. The full Markdown → DOM path
 * runs in a browser in RayChatOutput.test.stories.tsx.
 */
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: jest.fn(({ children }: { children: string }) => children),
}));

type MarkdownProps = {
  children: string;
  skipHtml?: boolean;
  remarkPlugins?: unknown[];
  rehypePlugins?: unknown[];
  components: Components;
};

const markdownProps = (): MarkdownProps => {
  const { calls } = ((ReactMarkdown as unknown) as jest.Mock).mock;
  return calls[calls.length - 1][0] as MarkdownProps;
};

/** Draws one element override the way react-markdown would call it. */
const drawOverride = (tag: keyof Components, props: Record<string, unknown>): HTMLElement => {
  renderWithTheme(<RayChatOutput>x</RayChatOutput>);
  const Override = markdownProps().components[tag] as React.ComponentType<Record<string, unknown>>;
  return renderWithTheme(<Override {...props} />).container;
};

describe('<RayChatOutput />', () => {
  it('hands the tidied text to the Markdown renderer with the chat rules', () => {
    renderWithTheme(
      <RayChatOutput>{'```json\n{"assistant_reply": "Done 🎉\\\\nAll paid."}\n```'}</RayChatOutput>,
    );
    expect(markdownProps().children).toBe('Done\nAll paid.');
    expect(markdownProps().skipHtml).toBe(true);
    expect(markdownProps().remarkPlugins).toEqual([remarkRayChat]);
    expect(markdownProps().rehypePlugins).toBeUndefined();
  });

  it('holds its opening paragraph back while it streams', () => {
    renderWithTheme(<RayChatOutput isStreaming>Your payouts are</RayChatOutput>);
    expect(markdownProps().remarkPlugins).toEqual([[remarkRayChat, { isStreaming: true }]]);
  });

  it('draws nothing for a missing reply, as when a stream has not started', () => {
    renderWithTheme(<RayChatOutput />);
    expect(markdownProps().children).toBe('');
  });

  it('draws italic as plain text', () => {
    const drawn = drawOverride('em', { children: 'usually' });
    expect(drawn.querySelector('em, i')).toBeNull();
    expect(drawn).toHaveTextContent('usually');
  });

  it('draws links with Blade’s Link, opening in a new tab', () => {
    const drawn = drawOverride('a', { href: 'https://razorpay.com/docs', children: 'the docs' });
    const link = drawn.querySelector('a');
    expect(link).toHaveAttribute('data-blade-component', 'link');
    expect(link).toHaveAttribute('href', 'https://razorpay.com/docs');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveTextContent('the docs');
  });

  it('draws an image as its alt text', () => {
    const drawn = drawOverride('img', { alt: 'a chart', src: 'https://x.test/c.png' });
    expect(drawn.querySelector('img')).toBeNull();
    expect(drawn).toHaveTextContent('a chart');
  });

  const codeBlock = {
    type: 'element',
    tagName: 'pre',
    properties: {},
    children: [
      { type: 'element', tagName: 'code', properties: { dataRayChatGap: '16' }, children: [] },
    ],
  };

  it('gives a code block the gap set on its code', () => {
    const drawn = drawOverride('pre', { node: codeBlock, children: <code>npm i</code> });
    const block = drawn.firstElementChild;
    expect(block).toHaveAttribute('data-ray-chat-gap', '16');
    expect(block?.querySelector('pre')).toHaveTextContent('npm i');
  });

  it('keeps GenUI’s code block: its language and copy button', () => {
    const drawn = drawOverride('pre', {
      node: codeBlock,
      children: <code className="language-bash">npm i</code>,
    });
    expect(drawn.querySelector('button[aria-label="Copy code block"]')).not.toBeNull();
    expect(drawn).toHaveTextContent('bash');
  });

  it('names itself, so DevTools shows RayChatOutput rather than ForwardRef', () => {
    expect(Reflect.get(RayChatOutput, 'displayName')).toBe('RayChatOutput');
    expect(getComponentId(<RayChatOutput />)).toBe('ray-chat-output');
  });

  it('marks itself as a Blade component', () => {
    const { getByTestId } = renderWithTheme(
      <RayChatOutput testID="out" data-analytics-name="answer">
        Hi
      </RayChatOutput>,
    );
    expect(getByTestId('out')).toHaveAttribute('data-blade-component', 'ray-chat-output');
    expect(getByTestId('out')).toHaveAttribute('data-analytics-name', 'answer');
  });
});
