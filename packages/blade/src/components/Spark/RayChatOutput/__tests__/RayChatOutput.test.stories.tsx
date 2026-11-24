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
  // none for the first, 24 before a section, 12 under a title, 16 between blocks, 24 after a divider
  await expect(marginsTop(blocks)).toEqual(['0px', '24px', '12px', '16px', '16px', '24px']);

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
    <Answer>{'**Important nuance:**\n\nYou can remit up to $250,000.'}</Answer>
    <Unstyled>
      <Box width="752px">
        <RayChatOutput testID="headings">{'# Big\n\nText'}</RayChatOutput>
      </Box>
    </Unstyled>
  </>
);
BoldLineAndHeadings.play = async ({ canvasElement }) => {
  const blocks = blocksOf(canvasElement);
  await expect(blocks.map((block) => block.tagName)).toEqual(['H3', 'P']);
  await expect(blocks[0]).toHaveTextContent('Important nuance:');
  await expect(marginsTop(blocks)).toEqual(['0px', '12px']);

  const headings = blocksOf(canvasElement, 'headings');
  await expect(headings.map((block) => block.tagName)).toEqual(['H1', 'P']);
  await expect(style(headings[0]).fontSize).toBe('20px');
};

export const NoSections: StoryFn = () => (
  <Answer>{'No paid orders were found on 21 Sep 2026.\n\nTry another date.'}</Answer>
);
NoSections.play = async ({ canvasElement }) => {
  const blocks = blocksOf(canvasElement);
  await expect(blocks.some((block) => block.hasAttribute('data-ray-chat-lead'))).toBe(false);
  await expect(style(blocks[0]).fontSize).toBe('14px');
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
  const link = canvas.getByRole('link', { name: 'the docs' });
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(canvasElement.querySelector('em, i, b, img')).toBeNull();
  await expect(canvas.getByTestId('answer')).toHaveTextContent(
    'usually fine. A bold claim a chart',
  );

  const blocks = blocksOf(canvasElement);
  await expect(blocks.map((block) => block.tagName)).toEqual(['P', 'PRE']);
  await expect(marginsTop(blocks)).toEqual(['0px', '16px']);
};

const GENUI_REPLY = [
  {
    component: 'TEXT',
    content: 'Your payouts are on time.\n\n### Settled this week\nTwo reached your bank.',
  },
  { component: 'CARD', title: 'Settlement', children: [{ component: 'AMOUNT', value: 48200 }] },
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
  const output = canvasElement.querySelector('[data-blade-component="ray-chat-output"]');
  await expect(output).not.toBeNull();
  const blocks = Array.from((output as Element).children);
  await expect(blocks.map((block) => block.tagName)).toEqual(['P', 'H3', 'P']);
  await expect(blocks[0]).toHaveAttribute('data-ray-chat-lead');
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
