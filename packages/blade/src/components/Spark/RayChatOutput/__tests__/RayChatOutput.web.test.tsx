import React from 'react';
import ReactMarkdown from 'react-markdown';
import { act } from '@testing-library/react';
import type { Components } from 'react-markdown';
import { RayChatOutput } from '../RayChatOutput';
import { remarkRayChat } from '../remarkRayChat';
import { getComponentId } from '~utils/isValidAllowedChildren';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { BladeProvider } from '~components/BladeProvider';
import { bladeTheme } from '~tokens/theme';

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

  describe('the opening paragraph growing into the main title', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    const drawParagraph = (): React.ComponentType<Record<string, unknown>> => {
      renderWithTheme(<RayChatOutput>x</RayChatOutput>);
      const Paragraph = markdownProps().components.p as React.ComponentType<
        Record<string, unknown>
      >;
      return Paragraph;
    };

    it('crossfades from body text when a title arrives after it, for 320 ms', () => {
      const Paragraph = drawParagraph();
      const body = { 'data-ray-chat-opening': true, children: 'Your payouts are on time.' };
      const { container, rerender } = renderWithTheme(<Paragraph {...body} />);
      expect(container.querySelector('[data-ray-chat-was]')).toBeNull();

      rerender(
        <BladeProvider themeTokens={bladeTheme} colorScheme="light">
          <Paragraph {...body} data-ray-chat-lead />
        </BladeProvider>,
      );
      const was = container.querySelector('[data-ray-chat-was]');
      expect(was).toHaveAttribute('aria-hidden', 'true');
      expect(was).toHaveTextContent('Your payouts are on time.');
      expect(container.querySelector('p')).toHaveAttribute('data-ray-chat-growing');

      act(() => {
        jest.advanceTimersByTime(319);
      });
      expect(container.querySelector('[data-ray-chat-was]')).not.toBeNull();
      act(() => {
        jest.advanceTimersByTime(1);
      });
      expect(container.querySelector('[data-ray-chat-was]')).toBeNull();
      expect(container.querySelector('p')).not.toHaveAttribute('data-ray-chat-growing');
    });

    it('does not grow a paragraph that is the main title from the start', () => {
      const Paragraph = drawParagraph();
      const { container } = renderWithTheme(
        <Paragraph data-ray-chat-opening data-ray-chat-lead>
          Done.
        </Paragraph>,
      );
      expect(container.querySelector('[data-ray-chat-was]')).toBeNull();
      expect(container.querySelector('p')).toHaveAttribute('data-ray-chat-lead');
    });

    it('leaves other paragraphs as plain paragraphs', () => {
      const Paragraph = drawParagraph();
      const { container } = renderWithTheme(<Paragraph data-ray-chat-gap="16">Two.</Paragraph>);
      expect(container.querySelector('p')?.innerHTML).toBe('Two.');
      expect(container.querySelector('p')).toHaveAttribute('data-ray-chat-gap', '16');
    });
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
