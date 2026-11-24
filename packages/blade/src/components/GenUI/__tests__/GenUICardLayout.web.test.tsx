/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { GenUIProvider } from '../GenUIProvider';
import { GenUISchemaRenderer } from '../GenUISchemaRenderer';
import type { GenUIComponent } from '../GenUIComponents';
import { getCompactGridTemplate } from '../GenUICardLayout';
import { getLongValueKind, middleTruncate } from '../longValueText';
import type { GenUIComponentActionsRegistry } from '../types';
import { cardLayoutSamples, tile } from './cardLayoutSamples';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

/** jsdom has no canvas: every character is 7px wide here. */
jest.mock('../longValueText.web', () => ({
  ...jest.requireActual('../longValueText.web'),
  measureTextWidth: (text: string) => text.length * 7,
  getLetterSpacingOf: () => 0,
}));

const renderCards = (components: GenUIComponent[], config?: Record<string, unknown>) =>
  renderWithTheme(
    <GenUIProvider config={config}>
      <GenUISchemaRenderer components={components} />
    </GenUIProvider>,
  );

describe('GenUI cardLayout', () => {
  describe('off (default)', () => {
    // These snapshots were written from master before `cardLayout` existed.
    // They must not change: GenUI also runs in apps that do not opt in.
    it.each(Object.keys(cardLayoutSamples))('renders %s as master does', (name) => {
      const { container } = renderCards([cardLayoutSamples[name]]);
      expect(container).toMatchSnapshot();
    });

    it("renders the same with cardLayout 'default' as with no setting", () => {
      const components = Object.values(cardLayoutSamples);
      const withoutSetting = renderCards(components).container.innerHTML;
      const withDefault = renderCards(components, { cardLayout: 'default' }).container.innerHTML;
      expect(withDefault).toBe(withoutSetting);
    });
  });
});

const PAYMENT_ID = 'pay_Rk3vXXXXXXZp2Lw';
/** The copy icon (12px) and the 4px gap take room from the text. */
const ICON_ROOM = 12 + 4;
/** A box with room for `chars` characters of text, the icon, and 1px for rounding. */
const roomFor = (chars: number): number => chars * 7 + 1 + ICON_ROOM;

/** jsdom has no layout. Every box measures `width`. */
const setBoxWidth = (width: number): void => {
  jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    width,
    height: 0,
    top: 0,
    left: 0,
    right: width,
    bottom: 0,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect);
};

const renderCompact = (
  components: GenUIComponent[],
  componentActions?: GenUIComponentActionsRegistry,
) => renderCards(components, { cardLayout: 'compact', componentActions });

const style = (element: Element | null | undefined) => window.getComputedStyle(element!);

/** The CARD body's rows, one per child, in order. */
const cardRows = (container: HTMLElement) =>
  Array.from(
    container.querySelector("[data-blade-component='card-body'] > div")?.children ?? [],
  ) as HTMLElement[];

const gridOf = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>('div')).find(
    (element) => style(element).display === 'grid',
  )!;

/** The first STACK tile of the first GRID. */
const firstTileOf = (container: HTMLElement) => gridOf(container).children[0] as HTMLElement;

/** The DIVIDER boxes of the schema, not the CARD header's own divider. */
const dividerBoxes = (container: HTMLElement) =>
  Array.from(container.querySelectorAll("[data-blade-component='divider']"))
    .filter((divider) => !divider.closest("[data-blade-component='card-header']"))
    .map((divider) => divider.parentElement!);

const withoutSpaces = (text: string) => text.replace(/\s/g, '');

describe('GenUI cardLayout compact', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: jest.fn(() => Promise.resolve()) },
      configurable: true,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('1. DIVIDER inside a CARD', () => {
    it('has 12px a side in a card, and keeps 24px outside a card', () => {
      const { container } = renderCompact([
        cardLayoutSamples.sections,
        { component: 'DIVIDER' } as GenUIComponent,
      ]);
      const [inCard, , outside] = dividerBoxes(container).map((box) => style(box));

      expect(inCard.paddingTop).toBe('12px');
      expect(inCard.paddingBottom).toBe('12px');
      expect(outside.paddingTop).toBe('24px');
    });

    it('counts the header divider: the first block adds no space under it', () => {
      const { container } = renderCompact([cardLayoutSamples.summary]);
      expect(style(cardRows(container)[0]).marginTop).toBe('0px');
      expect(style(gridOf(container)).marginTop).toBe('0px');
      expect(style(firstTileOf(container)).paddingTop).toBe('0px');
    });
  });

  describe('2. no stacked spacing next to a DIVIDER', () => {
    it('tiles to divider and divider to details are the divider 12px only', () => {
      const { container } = renderCompact([cardLayoutSamples.summary]);
      const [gridRow, dividerRow, detailsRow] = cardRows(container);

      // Tiles: no bottom padding. Grid: no bottom margin. Card row gap: none.
      expect(style(firstTileOf(container)).paddingBottom).toBe('0px');
      expect(style(gridOf(container)).marginBottom).toBe('0px');
      expect(style(gridRow).marginBottom).toBe('0px');
      expect(style(dividerRow).marginTop).toBe('0px');
      // Details: no top margin, and no row gap above it.
      expect(style(detailsRow).marginTop).toBe('0px');
      expect(style(container.querySelector("[data-blade-component='info-group']")).marginTop).toBe(
        '0px',
      );
    });

    it('drops the paragraph gap at the end of a TEXT in a card, so a tile label adds nothing', () => {
      const { container } = renderCompact([cardLayoutSamples.summary]);
      const labelText = firstTileOf(container).lastElementChild as HTMLElement;
      const css = Array.from(document.querySelectorAll('style'))
        .map((tag) => tag.textContent ?? '')
        .join('');
      const className = Array.from(labelText.classList).pop() ?? '';
      expect(withoutSpaces(css)).toContain(`.${className}>*:last-child{margin-bottom:0;}`);
    });

    it('keeps one 8px row gap between two blocks with no divider', () => {
      const { container } = renderCompact([
        {
          component: 'CARD',
          title: 'Two blocks',
          children: [
            { component: 'TEXT', content: 'First' },
            { component: 'TEXT', content: 'Second' },
          ],
        } as GenUIComponent,
      ]);
      expect(style(cardRows(container)[1]).marginTop).toBe('8px');
    });
  });

  describe('3. CARD bottom padding', () => {
    it('adds no space under the last block, so the card padding (16px) is the bottom', () => {
      const { container } = renderCompact([cardLayoutSamples.record]);
      expect(
        style(container.querySelector("[data-blade-component='info-group']")).marginBottom,
      ).toBe('0px');
    });

    it('passes the bottom edge through a STACK to its last block', () => {
      const { container } = renderCompact([cardLayoutSamples.stackedSettlement]);
      const stack = cardRows(container)[0].querySelector<HTMLElement>(
        "[data-blade-component='box']",
      );
      expect(style(stack).paddingBottom).toBe('0px');
      expect(
        style(container.querySelector("[data-blade-component='info-group']")).marginBottom,
      ).toBe('0px');
    });

    it('drops the bottom margin of a last ALERT', () => {
      const { container } = renderCompact([
        {
          component: 'CARD',
          title: 'Refund failed',
          children: [
            {
              component: 'ALERT',
              color: 'negative',
              description: 'The payment is older than 6 months.',
            },
          ],
        } as GenUIComponent,
      ]);
      expect(style(container.querySelector("[data-blade-component='alert']")).marginBottom).toBe(
        '0px',
      );
    });
  });

  describe('4. INFO_GROUP', () => {
    it('shows label and value on one row, small, values right-aligned', () => {
      const { container } = renderCompact([cardLayoutSamples.record]);
      const value = container.querySelector("[data-blade-component='info-item-value']");
      expect(style(value).justifyContent).toBe('flex-end');
      // InfoGroup size small: 12px value text (0.75rem).
      expect(style(screen.getByText('UPI')).fontSize).toBe('0.75rem');
    });
  });

  describe('5. long values', () => {
    it.each([
      [PAYMENT_ID, 'identifier'],
      ['customer@example.com', 'email'],
      ['customer@okexamplebank', 'email'],
      ['https://www.example.com/a', 'url'],
      ['UTIBR72026111200481516', 'identifier'],
      ['Captured', null],
      ['2026-11-12T14:05:00Z', null],
      ['12 Nov 2026', null],
    ])('treats %s as %s', (value, kind) => {
      expect(getLongValueKind(value)).toBe(kind);
    });

    it('cuts in the middle and keeps the domain of an email', () => {
      const measure = (text: string) => text.length * 7;
      expect(middleTruncate(PAYMENT_ID, 14 * 7, measure, 'identifier')).toBe('pay_Rk3v…Zp2Lw');
      expect(middleTruncate('customer.name@example.com', 16 * 7, measure, 'email')).toBe(
        'cus…@example.com',
      );
      expect(middleTruncate(PAYMENT_ID, 400, measure, 'identifier')).toBe(PAYMENT_ID);
    });

    it('keeps an INFO_GROUP value on one line, cut in the middle, with the whole value on hover', async () => {
      setBoxWidth(roomFor(14));
      renderCompact([cardLayoutSamples.sections]);

      const button = screen.getByRole('button', { name: `Copy ${PAYMENT_ID}` });
      expect(button).toHaveTextContent('pay_Rk3v…Zp2Lw');
      fireEvent.mouseEnter(button);
      await waitFor(() => expect(screen.getByRole('tooltip')).toHaveTextContent(PAYMENT_ID));
    });

    it('shows the whole value in a tooltip on keyboard focus', async () => {
      setBoxWidth(roomFor(14));
      renderCompact([cardLayoutSamples.sections]);

      const button = screen.getByRole('button', { name: `Copy ${PAYMENT_ID}` });
      act(() => button.focus());
      await waitFor(() => expect(screen.getByRole('tooltip')).toHaveTextContent(PAYMENT_ID));
    });

    it('copies the whole value on click', () => {
      setBoxWidth(roomFor(14));
      renderCompact([cardLayoutSamples.sections]);

      fireEvent.click(screen.getByRole('button', { name: `Copy ${PAYMENT_ID}` }));
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(PAYMENT_ID);
    });

    it('shows a value whole when it fits', () => {
      setBoxWidth(400);
      renderCompact([cardLayoutSamples.sections]);
      expect(screen.getByRole('button', { name: `Copy ${PAYMENT_ID}` })).toHaveTextContent(
        PAYMENT_ID,
      );
    });

    it('cuts a long value in a TABLE cell, with one copy button and no Blade copy icon', () => {
      setBoxWidth(roomFor(14));
      const { container } = renderCompact([
        {
          component: 'TABLE',
          headers: ['Payment', 'Method'],
          rows: [
            [
              { component: 'TEXT', value: PAYMENT_ID, copyable: true },
              { component: 'TEXT', value: 'UPI' },
            ],
          ],
        } as GenUIComponent,
      ]);

      const cell = screen.getAllByRole('cell')[0];
      expect(cell.querySelector('[data-genui-long-value]')).not.toBeNull();
      expect(screen.getAllByRole('button', { name: new RegExp(PAYMENT_ID) })).toHaveLength(1);
      expect(screen.getByRole('button', { name: `Copy ${PAYMENT_ID}` })).toHaveTextContent(
        'pay_Rk3v…Zp2Lw',
      );
      expect(container).toHaveTextContent('UPI');
    });

    it('cuts a long value in a CARD title, after a short label, with no copy when the card shows it with copy', () => {
      setBoxWidth(roomFor(14));
      renderCompact([
        {
          component: 'CARD',
          title: 'Payment pay_Rk3vXXXXXXZp2Lw',
          description: 'Order order_Rk3vXXXXXXAbC12',
          children: [
            {
              component: 'INFO_GROUP',
              items: [{ key: { children: 'Payment ID' }, value: { children: PAYMENT_ID } }],
            },
          ],
        } as GenUIComponent,
      ]);

      const header = document.querySelector("[data-blade-component='card-header']");
      expect(header?.querySelectorAll('[data-genui-long-value]')).toHaveLength(2);
      expect(header).toHaveTextContent('Payment');
      // The payment id copies from the details list, so the title has no copy for it.
      expect(screen.getAllByRole('button', { name: `Copy ${PAYMENT_ID}` })).toHaveLength(1);
      expect(
        screen.getByRole('button', { name: 'Copy order_Rk3vXXXXXXAbC12' }),
      ).toBeInTheDocument();
    });

    it('keeps an ordinary title and ordinary values as text', () => {
      renderCompact([cardLayoutSamples.summary]);
      expect(document.querySelector('[data-genui-long-value]')).toBeNull();
      expect(screen.getByText('Collections this week')).toBeInTheDocument();
    });

    it('cuts nothing with the setting off', () => {
      setBoxWidth(roomFor(14));
      renderCards([cardLayoutSamples.record, cardLayoutSamples.cardWithTable]);
      expect(document.querySelector('[data-genui-long-value]')).toBeNull();
    });
  });

  describe('6. GRID', () => {
    it('never makes a column under 120px, and never more columns than asked', () => {
      expect(getCompactGridTemplate(3, 4)).toBe(
        'repeat(auto-fill, minmax(max(120px, calc((100% - 8px) / 3 - 0.1px)), 1fr))',
      );
      const { container } = renderCompact([cardLayoutSamples.summary]);
      expect(withoutSpaces(style(gridOf(container)).gridTemplateColumns)).toBe(
        withoutSpaces(getCompactGridTemplate(3, 4)),
      );
    });

    it('moves the tile padding into the grid, so wrapped rows keep their space', () => {
      const { container } = renderCompact([
        {
          component: 'GRID',
          columns: 2,
          gap: 'small',
          children: [tile('₹1.00', 'One'), tile('₹2.00', 'Two')],
        } as GenUIComponent,
      ]);
      const grid = gridOf(container);
      // Outside a card: 8px margin + 8px tile padding, as before.
      expect(style(grid).marginTop).toBe('16px');
      expect(style(grid).rowGap).toBe('20px');
      expect(style(firstTileOf(container)).paddingTop).toBe('0px');
    });
  });

  describe('CHART inside a CARD', () => {
    const chartCard = {
      component: 'CARD',
      title: 'Payments by day',
      children: [
        {
          component: 'CHART',
          chartType: 'bar',
          xAxis: 'day',
          data: [
            { day: 'Mon', value: 12 },
            { day: 'Tue', value: 18 },
          ],
        },
      ],
    } as GenUIComponent;

    it('shows no divider under the header of a chart card', () => {
      const { container } = renderCompact([chartCard]);
      const header = container.querySelector("[data-blade-component='card-header']");
      expect(header?.querySelector("[data-blade-component='divider']")).toBeNull();
    });

    it('keeps the header divider with the setting off', () => {
      const { container } = renderCards([chartCard]);
      const header = container.querySelector("[data-blade-component='card-header']");
      expect(header?.querySelector("[data-blade-component='divider']")).not.toBeNull();
    });

    it('keeps the header divider when the card also holds a TABLE', () => {
      const { container } = renderCompact([
        {
          ...chartCard,
          children: [
            ...(chartCard as { children: GenUIComponent[] }).children,
            ...(cardLayoutSamples.cardWithTable as { children: GenUIComponent[] }).children,
          ],
        } as GenUIComponent,
      ]);
      const header = container.querySelector("[data-blade-component='card-header']");
      expect(header?.querySelector("[data-blade-component='divider']")).not.toBeNull();
    });
  });

  describe('7. TABLE inside a CARD', () => {
    it('sits flush to the card sides, drops its own frame, and the card clips it', () => {
      const { container } = renderCompact([cardLayoutSamples.cardWithTable]);
      const [tableRow] = cardRows(container);

      // Card padding 16px less its 1px edge.
      expect(style(tableRow).marginLeft).toBe('-15px');
      expect(style(tableRow).marginRight).toBe('-15px');
      // Last in a card with no footer: it meets the bottom edge.
      expect(style(tableRow).marginBottom).toBe('-27px');

      const surface = container.querySelector("[data-blade-component='table']")
        ?.parentElement as HTMLElement;
      expect(style(surface).borderRadius).toBe('0');
      expect(style(surface).boxShadow).toBe('none');

      const cardSurface = container.querySelector("[data-blade-component='card'] > div");
      expect(style(cardSurface).overflow).toBe('hidden');
    });

    it('keeps the bottom inside the card when a TABLE action slot shows under it', () => {
      const { container } = renderCompact([cardLayoutSamples.cardWithTable], {
        TABLE: () => <button type="button">Copy as CSV</button>,
      });
      expect(style(cardRows(container)[0]).marginBottom).toBe('0px');
      expect(screen.getByRole('button', { name: 'Copy as CSV' })).toBeInTheDocument();
    });

    it('meets the top edge in a card with no header', () => {
      const { container } = renderCompact([
        {
          ...cardLayoutSamples.cardWithTable,
          title: undefined,
          description: undefined,
        } as GenUIComponent,
      ]);
      expect(style(cardRows(container)[0]).marginTop).toBe('-27px');
    });

    it('keeps its frame outside a card', () => {
      const { container } = renderCompact([
        (cardLayoutSamples.cardWithTable as { children: GenUIComponent[] }).children[0],
      ]);
      const surface = container.querySelector("[data-blade-component='table']")
        ?.parentElement as HTMLElement;
      expect(style(surface).boxShadow).not.toBe('none');
    });
  });
});
