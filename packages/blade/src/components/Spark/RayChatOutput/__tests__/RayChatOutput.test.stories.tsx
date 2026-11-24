/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable import/no-extraneous-dependencies */
import type { StoryFn } from '@storybook/react-vite';
import { within, expect } from 'storybook/test';
import React from 'react';
import { RayChatOutput, rayChatOutputGenUI } from '../';
import { Box } from '~components/Box';
import { GenUIProvider, GenUISchemaRenderer } from '~components/GenUI';
import type { GenUIComponent } from '~components/GenUI';

/**
 * The full Markdown → DOM path in a real browser (Jest mocks the ESM-only react-markdown):
 * which blocks are drawn, the main title, the 12 / 16 / 24 gaps and the picked type sizes.
 */

const blocksOf = (canvasElement: HTMLElement, testID = 'answer'): HTMLElement[] =>
  Array.from(within(canvasElement).getByTestId(testID).children);
const style = (element: Element) => window.getComputedStyle(element);
const marginsTop = (blocks: HTMLElement[]) => blocks.map((block) => style(block).marginTop);

// `sb-unstyled` opts the stories out of Storybook's preview-head font overrides (they force
// Inter on every <p> with !important); apps don't have them.
const Unstyled = ({ children }: { children: React.ReactNode }) => (
  <div className="sb-unstyled">{children}</div>
);

const Answer = ({ children }: { children: string }) => (
  <Unstyled>
    <Box width="752px">
      <RayChatOutput testID="answer">{children}</RayChatOutput>
    </Box>
  </Unstyled>
);

export const SectionedReply: StoryFn = () => (
  <Answer>
    {[
      'Costs are mostly FX and tax.',
      '',
      '### First',
      'For a **resident**',
      'buy directly.',
      '',
      '- one',
      '- two',
      '',
      '---',
      '',
      'After 🎉',
    ].join('\n')}
  </Answer>
);
SectionedReply.play = async ({ canvasElement }) => {
  const blocks = blocksOf(canvasElement);
  await expect(blocks.map((block) => block.tagName)).toEqual(['P', 'H3', 'P', 'P', 'UL', 'P']);
  await expect(blocks[0]).toHaveAttribute('data-ray-chat-lead');
  await expect(canvasElement.querySelector('hr')).toBeNull();
  await expect(blocks[5]).toHaveTextContent(/^After$/);
  // none for the first, 24 before a section, 12 under a title, 12 for a paragraph's next line,
  // 16 between blocks, 24 after a divider
  await expect(marginsTop(blocks)).toEqual(['0px', '24px', '12px', '12px', '16px', '24px']);

  // the main title and titles: TASA Orbiter 500, 20/26
  const titleType = (title: Element) => {
    const { fontFamily, fontWeight, fontSize, lineHeight } = style(title);
    return [fontFamily.split(',')[0], fontWeight, fontSize, lineHeight];
  };
  await expect([titleType(blocks[0]), titleType(blocks[1])]).toEqual([
    ['"TASA Orbiter"', '500', '20px', '26px'],
    ['"TASA Orbiter"', '500', '20px', '26px'],
  ]);
  // body: Inter 400, 14/24, -1.3%
  await expect(style(blocks[2]).fontFamily).toContain('Inter');
  await expect(style(blocks[2]).fontSize).toBe('14px');
  await expect(style(blocks[2]).lineHeight).toBe('24px');
  await expect(style(blocks[2]).letterSpacing).toBe('-0.182px');
  // lists: 14/26
  await expect(style(blocks[4].querySelector('li') as Element).lineHeight).toBe('26px');
  // bold: the titles' colour, 600 in light
  const bold = blocks[2].querySelector('strong') as Element;
  await expect(style(bold).fontWeight).toBe('600');
  await expect(style(bold).color).toBe(style(blocks[1]).color);
};

export const BoldLineAndHeadings: StoryFn = () => (
  <>
    <Answer>
      {'Two things matter.\n\n**Important nuance:**\n\nYou can remit up to $250,000.'}
    </Answer>
    <Unstyled>
      <Box width="752px">
        <RayChatOutput testID="headings">{'# Big\n\nText'}</RayChatOutput>
      </Box>
    </Unstyled>
  </>
);
BoldLineAndHeadings.play = async ({ canvasElement }) => {
  // A bold line on its own stays bold body text, as Figma draws it.
  const blocks = blocksOf(canvasElement);
  await expect(blocks.map((block) => block.tagName)).toEqual(['P', 'P', 'P']);
  await expect(blocks[1]).toHaveTextContent('Important nuance:');
  await expect(style(blocks[1]).fontSize).toBe('14px');
  await expect(marginsTop(blocks)).toEqual(['0px', '16px', '16px']);

  const headings = blocksOf(canvasElement, 'headings');
  await expect(headings.map((block) => block.tagName)).toEqual(['H1', 'P']);
  await expect(style(headings[0]).fontSize).toBe('20px');
};

export const NoSections: StoryFn = () => (
  <Answer>{'No paid orders were found on 21 Sep 2026.\n\nTry another date.'}</Answer>
);
NoSections.play = async ({ canvasElement }) => {
  // The opening paragraph is the main title with or without sections (decided on its own).
  const blocks = blocksOf(canvasElement);
  await expect(blocks.map((block) => block.hasAttribute('data-ray-chat-lead'))).toEqual([
    true,
    false,
  ]);
  await expect([style(blocks[0]).fontSize, style(blocks[1]).fontSize]).toEqual(['20px', '14px']);
  await expect(marginsTop(blocks)).toEqual(['0px', '16px']);
};

export const LinksHtmlImagesAndCode: StoryFn = () => (
  <Answer>
    {
      'See [the docs](https://razorpay.com/docs), *usually* fine. A <b>bold</b> claim ![a chart](https://x.test/c.png)\n\n```\nnpm i\n```'
    }
  </Answer>
);
LinksHtmlImagesAndCode.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  // Links are Blade's Link; code blocks are GenUI's, with a copy button
  const link = canvas.getByRole('link', { name: 'the docs' });
  await expect(link).toHaveAttribute('data-blade-component', 'link');
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(canvasElement.querySelector('em, i, b, img')).toBeNull();
  await expect(canvas.getByTestId('answer')).toHaveTextContent(
    'usually fine. A bold claim a chart',
  );

  const blocks = blocksOf(canvasElement);
  await expect(blocks.map((block) => block.tagName)).toEqual(['P', 'DIV']);
  await expect(blocks[1].querySelector('pre code')).toHaveTextContent('npm i');
  await expect(canvas.getByRole('button', { name: 'Copy code block' })).toBeInTheDocument();
  await expect(marginsTop(blocks)).toEqual(['0px', '16px']);
};

export const TableInText: StoryFn = () => (
  <Answer>
    {'Your payments:\n\n| Date | Amount |\n|---|---:|\n| 21 Sep | **₹500** |\n| 22 Sep | ₹1,200 |'}
  </Answer>
);
TableInText.play = async ({ canvasElement }) => {
  // Tables are drawn as cards; in the chat text one becomes an aligned block, not rows of pipes.
  const blocks = blocksOf(canvasElement);
  await expect(blocks.map((block) => block.tagName)).toEqual(['P', 'DIV']);
  // (a code block's text ends with its newline)
  await expect(blocks[1].querySelector('pre code')?.textContent?.trimEnd()).toBe(
    'Date     Amount\n21 Sep     ₹500\n22 Sep   ₹1,200',
  );
  await expect(marginsTop(blocks)).toEqual(['0px', '16px']);
};

const STREAMED_REPLY = [
  'For an Indian investing in US stocks, the real costs are FX spread and tax.',
  '',
  '### First: what really costs you money',
  'For a **resident Indian** buying US stocks directly, think of four buckets.',
  '',
  '1. Getting money out',
  '2. Trading costs',
  '',
  '**Important nuance:**',
  'You can remit up to **$250,000** a year.',
  '',
  '| Route | Fee |',
  '|---|---:|',
  '| Direct | ₹500 |',
  '',
  '---',
  '',
  'Anything else?',
].join('\n');

// Word by word, as a model streams: each chunk is a word with the whitespace before it.
const STREAM_CHUNKS = STREAMED_REPLY.match(/\s*\S+/g) ?? [];

const StreamingAnswer = () => {
  const [chunks, setChunks] = React.useState(0);
  return (
    <>
      <button type="button" data-testid="next-chunk" onClick={() => setChunks((n) => n + 1)}>
        Next chunk
      </button>
      <Answer>{STREAM_CHUNKS.slice(0, chunks).join('')}</Answer>
    </>
  );
};

export const StreamsWithoutJumps: StoryFn = () => <StreamingAnswer />;
StreamsWithoutJumps.play = async ({ canvasElement }) => {
  // How a block looks: type, colour and its gap. A block that has appeared must keep it.
  const look = (block: Element) => {
    const s = style(block);
    return [
      s.fontFamily.split(',')[0],
      s.fontSize,
      s.lineHeight,
      s.fontWeight,
      s.color,
      s.marginTop,
    ].join(' ');
  };
  const nextChunk = within(canvasElement).getByTestId('next-chunk');
  const firstLooks: string[] = [];
  const changes: string[] = [];
  // Chunks arrive one after another, so each waits for the last one to be drawn.
  for (let chunk = 1; chunk <= STREAM_CHUNKS.length; chunk++) {
    nextChunk.click();
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => requestAnimationFrame(resolve));
    blocksOf(canvasElement).forEach((block, index) => {
      const now = look(block);
      firstLooks[index] = firstLooks[index] ?? now;
      if (now !== firstLooks[index]) {
        changes.push(`chunk ${chunk}, block ${index}: ${firstLooks[index]} → ${now}`);
        firstLooks[index] = now;
      }
    });
  }
  await expect(changes.join('\n')).toBe('');
};

const GENUI_REPLY = [
  {
    component: 'TEXT',
    content: 'Your payouts are on time.\n\n### Settled this week\nTwo reached your bank.',
  },
  { component: 'CARD', title: 'Settlement', children: [{ component: 'AMOUNT', value: 48200 }] },
  { component: 'TEXT', content: '### What next\nAsk me about any payment ID.' },
] as GenUIComponent[];

export const InGenUI: StoryFn = () => (
  <Unstyled>
    <Box width="752px">
      <GenUIProvider config={{ components: { TEXT: rayChatOutputGenUI } }}>
        <GenUISchemaRenderer components={GENUI_REPLY} />
      </GenUIProvider>
    </Box>
  </Unstyled>
);
InGenUI.play = async ({ canvasElement }) => {
  const [before, after] = Array.from(
    canvasElement.querySelectorAll('[data-blade-component="ray-chat-output"]'),
  );
  const blocks = Array.from(before.children);
  await expect(blocks.map((block) => block.tagName)).toEqual(['P', 'H3', 'P']);
  await expect(blocks[0]).toHaveAttribute('data-ray-chat-lead');

  // The chat's 24 between text and its card, on both sides (GenUI's ring margin included).
  const card = (canvasElement.querySelector(
    '[data-blade-component="card"]',
  ) as Element).getBoundingClientRect();
  await expect([
    Math.round(card.top - before.getBoundingClientRect().bottom),
    Math.round(after.getBoundingClientRect().top - card.bottom),
  ]).toEqual([24, 24]);
};

export default {
  title: 'Components/Interaction Tests/RayChatOutput',
  component: RayChatOutput,
  parameters: {
    controls: {
      disable: true,
    },
    a11y: { disable: true },
    essentials: { disable: true },
  },
};
