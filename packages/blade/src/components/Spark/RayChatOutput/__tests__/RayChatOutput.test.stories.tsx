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
  // A short reply stays body text: only an opening paragraph followed by a title is the main title.
  const blocks = blocksOf(canvasElement);
  await expect(blocks.some((block) => block.hasAttribute('data-ray-chat-lead'))).toBe(false);
  await expect([style(blocks[0]).fontSize, style(blocks[1]).fontSize]).toEqual(['14px', '14px']);
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
const chunksOf = (reply: string): string[] => reply.match(/\s*\S+/g) ?? [];

const StreamingAnswer = ({ reply }: { reply: string }) => {
  const chunks = chunksOf(reply);
  const [shown, setShown] = React.useState(0);
  return (
    <>
      <button type="button" data-testid="next-chunk" onClick={() => setShown((n) => n + 1)}>
        Next chunk
      </button>
      <Answer>{chunks.slice(0, shown).join('')}</Answer>
    </>
  );
};

const isMainTitle = (block?: Element) => Boolean(block?.hasAttribute('data-ray-chat-lead'));

/**
 * Streams the story's reply chunk by chunk and watches every drawn block. A block's look (type,
 * colour, gap) must never change, except the opening paragraph growing into the main title: that
 * may happen once, with a crossfade copy over it while it grows.
 */
const streamReply = async (canvasElement: HTMLElement, reply: string) => {
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
  const grewAt: number[] = [];
  let wasCrossfaded = false;
  let drawnWhileStreaming = 0;
  // Chunks arrive one after another, so each waits for the last one to be drawn.
  for (let chunk = 1; chunk <= chunksOf(reply).length; chunk++) {
    const openingWasMainTitle = isMainTitle(blocksOf(canvasElement)[0]);
    nextChunk.click();
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const blocks = blocksOf(canvasElement);
    if (chunk === 1) drawnWhileStreaming = blocks.length;
    if (isMainTitle(blocks[0]) !== openingWasMainTitle) {
      grewAt.push(chunk);
      wasCrossfaded = Boolean(blocks[0].querySelector('[data-ray-chat-was]'));
    }
    blocks.forEach((block, index) => {
      // the opening paragraph is judged by its growing, not its look, once it's the main title
      if (index === 0 && isMainTitle(block)) return;
      const now = look(block);
      firstLooks[index] = firstLooks[index] ?? now;
      if (now !== firstLooks[index]) {
        changes.push(`chunk ${chunk}, block ${index}: ${firstLooks[index]} → ${now}`);
        firstLooks[index] = now;
      }
    });
  }
  // let a grow finish
  await new Promise((resolve) => setTimeout(resolve, 400));
  return { changes, grewAt, wasCrossfaded, drawnWhileStreaming };
};

export const StreamsWithoutJumps: StoryFn = () => <StreamingAnswer reply={STREAMED_REPLY} />;
StreamsWithoutJumps.play = async ({ canvasElement }) => {
  const { changes, grewAt, wasCrossfaded, drawnWhileStreaming } = await streamReply(
    canvasElement,
    STREAMED_REPLY,
  );
  await expect(changes.join('\n')).toBe('');
  // drawn straight away, then grown once into the main title, crossfading
  await expect(drawnWhileStreaming).toBe(1);
  await expect(grewAt).toHaveLength(1);
  await expect(wasCrossfaded).toBe(true);
  const opening = blocksOf(canvasElement)[0];
  await expect(isMainTitle(opening)).toBe(true);
  await expect([style(opening).fontFamily.split(',')[0], style(opening).fontSize]).toEqual([
    '"TASA Orbiter"',
    '20px',
  ]);
  await expect(opening.querySelector('[data-ray-chat-was]')).toBeNull();
};

const SHORT_REPLY = 'No paid orders were found on 21 Sep 2026.';

export const ShortReplyEndsAsBody: StoryFn = () => <StreamingAnswer reply={SHORT_REPLY} />;
ShortReplyEndsAsBody.play = async ({ canvasElement }) => {
  const { changes, grewAt, drawnWhileStreaming } = await streamReply(canvasElement, SHORT_REPLY);
  await expect(changes.join('\n')).toBe('');
  // shown while it streamed, never grown, ends as body text
  await expect(drawnWhileStreaming).toBe(1);
  await expect(grewAt).toEqual([]);
  const blocks = blocksOf(canvasElement);
  await expect(blocks).toHaveLength(1);
  await expect(isMainTitle(blocks[0])).toBe(false);
  await expect(style(blocks[0]).fontSize).toBe('14px');
};

export const TitleKeepsRupee: StoryFn = () => (
  <Answer>{'Your settlement of ₹48,200 reached your bank.\n\n### Fees of ₹12'}</Answer>
);
TitleKeepsRupee.play = async ({ canvasElement }) => {
  // TASA Orbiter has no ₹: titles fall back to Blade's text font (Inter), which has it. Checked
  // on the main title; the ### title shares its CSS rule, but Storybook's preview-head forces its
  // own font stack on h3 even inside .sb-unstyled (its rule excludes `.sb-unstyled h4` there).
  const [mainTitle] = blocksOf(canvasElement);
  const families = style(mainTitle)
    .fontFamily.split(',')
    .map((family) => family.trim().replace(/"/g, ''));
  await expect(families.indexOf('Inter')).toBeGreaterThan(families.indexOf('TASA Orbiter'));
  await document.fonts.load('20px "Inter"', '₹');
  await expect(document.fonts.check('20px "Inter"', '₹')).toBe(true);
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

const TITLE_THEN_CARD = [
  { component: 'TEXT', content: 'Your payouts are on time.\n\n### Settled this week' },
  { component: 'CARD', title: 'Settlement', children: [{ component: 'AMOUNT', value: 48200 }] },
] as GenUIComponent[];

export const TitleThenCardInGenUI: StoryFn = () => (
  <Unstyled>
    <Box width="752px">
      <GenUIProvider config={{ components: { TEXT: rayChatOutputGenUI } }}>
        <GenUISchemaRenderer components={TITLE_THEN_CARD} />
      </GenUIProvider>
    </Box>
  </Unstyled>
);
TitleThenCardInGenUI.play = async ({ canvasElement }) => {
  // A TEXT that ends in a title sits 24 from its card too.
  const output = canvasElement.querySelector('[data-blade-component="ray-chat-output"]') as Element;
  const card = canvasElement.querySelector('[data-blade-component="card"]') as Element;
  await expect(
    Math.round(card.getBoundingClientRect().top - output.getBoundingClientRect().bottom),
  ).toBe(24);
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
