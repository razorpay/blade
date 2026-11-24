import React from 'react';
import ReactMarkdown from 'react-markdown';
import { rayChatOutputGenUI } from '../rayChatOutputGenUI';
import { remarkRayChat } from '../remarkRayChat';
import { GenUIProvider, GenUISchemaRenderer } from '~components/GenUI';
import type { GenUIComponent } from '~components/GenUI';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

// react-markdown is ESM-only, so Jest mocks it (see RayChatOutput.web.test.tsx).
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: jest.fn(({ children }: { children: string }) => children),
}));

const markdownCalls = (): {
  children: string;
  rehypePlugins?: unknown[];
  remarkPlugins?: unknown[];
}[] => ((ReactMarkdown as unknown) as jest.Mock).mock.calls.map(([props]) => props);

const drawWithRayText = (
  components: GenUIComponent[],
  isAnimating?: boolean,
): ReturnType<typeof renderWithTheme> =>
  renderWithTheme(
    <GenUIProvider config={{ components: { TEXT: rayChatOutputGenUI } }}>
      <GenUISchemaRenderer components={components} isAnimating={isAnimating} />
    </GenUIProvider>,
  );

describe('rayChatOutputGenUI', () => {
  beforeEach(() => ((ReactMarkdown as unknown) as jest.Mock).mockClear());

  it('draws GenUI’s TEXT with RayChatOutput', () => {
    const { container } = drawWithRayText([
      { component: 'TEXT', content: '### Fees\n\nTwo kinds.' },
    ]);
    expect(container.querySelector('[data-blade-component="ray-chat-output"]')).toHaveTextContent(
      '### Fees',
    );
    expect(markdownCalls()[0].rehypePlugins).toEqual([]);
  });

  it('keeps GenUI’s word fade while the reply streams', () => {
    drawWithRayText([{ component: 'TEXT', content: 'Your payout' }], true);
    const { rehypePlugins } = markdownCalls()[markdownCalls().length - 1];
    expect(rehypePlugins).toHaveLength(1);
    expect(typeof rehypePlugins?.[0]).toBe('function');
  });

  it('gives only the reply’s first TEXT a main title', () => {
    drawWithRayText([
      { component: 'TEXT', content: 'Your payouts are on time.' },
      { component: 'TEXT', content: 'Want me to check another date?' },
    ]);
    const [first, second] = markdownCalls() as { remarkPlugins?: unknown[] }[];
    expect(first.remarkPlugins).toEqual([remarkRayChat]);
    expect(second.remarkPlugins).toEqual([[remarkRayChat, { hasMainTitle: false }]]);
  });

  it('draws nothing for an empty TEXT', () => {
    const { container } = drawWithRayText([{ component: 'TEXT', content: '' }]);
    expect(container.querySelector('[data-blade-component="ray-chat-output"]')).toBeNull();
  });
});
