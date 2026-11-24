import { remarkRayChat } from '../remarkRayChat';

/**
 * remarkRayChat runs on the Markdown tree (mdast). Jest can't load the ESM-only parser, so the
 * trees are built by hand here; the parsed path is covered in RayChatOutput.test.stories.tsx.
 */
type Node = {
  type: string;
  value?: string;
  depth?: number;
  children?: Node[];
  data?: { hProperties?: Record<string, unknown> };
};

const text = (value: string): Node => ({ type: 'text', value });
const strong = (...children: Node[]): Node => ({ type: 'strong', children });
const paragraph = (...children: Node[]): Node => ({ type: 'paragraph', children });
const heading = (depth: number, ...children: Node[]): Node => ({ type: 'heading', depth, children });
const list = (): Node => ({ type: 'list', children: [] });
const code = (value: string): Node => ({ type: 'code', value });
const divider = (): Node => ({ type: 'thematicBreak' });
const lineBreak = (): Node => ({ type: 'break' });

const run = (...children: Node[]): Node[] => {
  const tree: Node = { type: 'root', children };
  remarkRayChat()(tree);
  return tree.children ?? [];
};

const gaps = (blocks: Node[]): unknown[] =>
  blocks.map((block) => block.data?.hProperties?.dataRayChatGap);
const leads = (blocks: Node[]): unknown[] =>
  blocks.map((block) => block.data?.hProperties?.dataRayChatLead === true);
const types = (blocks: Node[]): string[] => blocks.map((block) => block.type);

describe('remarkRayChat', () => {
  it('gives each block its gap: 24 before a section, 12 under a title, 16 otherwise', () => {
    const blocks = run(
      paragraph(text('Costs are mostly FX and tax.')),
      heading(3, text('First')),
      paragraph(text('For a resident')),
      list(),
      code('npm i'),
      heading(3, text('Second')),
      list(),
    );
    expect(gaps(blocks)).toEqual([undefined, '24', '12', '16', '16', '24', '12']);
  });

  it('makes the first paragraph the main title when the reply has sections', () => {
    const blocks = run(paragraph(text('The answer.')), heading(3, text('First')));
    expect(leads(blocks)).toEqual([true, false]);
  });

  it('has no main title when the reply has no sections', () => {
    const blocks = run(paragraph(text('No paid orders.')), paragraph(text('Try another date.')));
    expect(leads(blocks)).toEqual([false, false]);
    expect(gaps(blocks)).toEqual([undefined, '16']);
  });

  it('has no main title when the reply opens with a title', () => {
    expect(leads(run(heading(3, text('First')), paragraph(text('Body'))))).toEqual([false, false]);
  });

  it('turns a bold line on its own into a title', () => {
    const blocks = run(paragraph(strong(text('Important nuance:'))), paragraph(text('You can remit.')));
    expect(types(blocks)).toEqual(['heading', 'paragraph']);
    expect(blocks[0].depth).toBe(3);
    expect(blocks[0].children).toEqual([text('Important nuance:')]);
    expect(gaps(blocks)).toEqual([undefined, '12']);
  });

  it('keeps bold inside a sentence as bold', () => {
    const blocks = run(paragraph(text('For a '), strong(text('resident')), text(' buyer')));
    expect(types(blocks)).toEqual(['paragraph']);
  });

  it('starts a new paragraph at each line break', () => {
    const blocks = run(
      paragraph(text('For a '), strong(text('resident')), text('\nbuy directly.'), lineBreak(), text('Then')),
    );
    expect(types(blocks)).toEqual(['paragraph', 'paragraph', 'paragraph']);
    expect(blocks[0].children).toEqual([text('For a '), strong(text('resident'))]);
    expect(blocks[1].children).toEqual([text('buy directly.')]);
    expect(gaps(blocks)).toEqual([undefined, '16', '16']);
  });

  it('turns a bold line split off by a line break into a title', () => {
    const blocks = run(paragraph(strong(text('Fees')), text('\nTwo kinds.')));
    expect(types(blocks)).toEqual(['heading', 'paragraph']);
    expect(gaps(blocks)).toEqual([undefined, '12']);
  });

  it('removes a divider and opens a section after it', () => {
    const blocks = run(paragraph(text('One')), divider(), paragraph(text('Two')));
    expect(types(blocks)).toEqual(['paragraph', 'paragraph']);
    expect(gaps(blocks)).toEqual([undefined, '24']);
  });

  it('ignores a divider before anything is drawn', () => {
    const blocks = run(divider(), paragraph(text('One')), paragraph(text('Two')));
    expect(gaps(blocks)).toEqual([undefined, '16']);
  });

  it('skips blocks that draw nothing when giving gaps', () => {
    const blocks = run(
      { type: 'html', value: '<div>' },
      paragraph(text('One')),
      { type: 'definition' },
      paragraph(text('Two')),
    );
    expect(types(blocks)).toEqual(['html', 'paragraph', 'definition', 'paragraph']);
    expect(gaps(blocks)).toEqual([undefined, undefined, undefined, '16']);
  });

  it('keeps properties a block already has', () => {
    const block = paragraph(text('Two'));
    block.data = { hProperties: { id: 'keep' } };
    const blocks = run(paragraph(text('One')), block);
    expect(blocks[1].data?.hProperties).toEqual({ id: 'keep', dataRayChatGap: '16' });
  });
});
