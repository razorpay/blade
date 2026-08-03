import React from 'react';
import userEvent from '@testing-library/user-event';
import { waitFor, fireEvent } from '@testing-library/react';
import { GenUIProvider } from '../GenUIProvider';
import { GenUISchemaRenderer } from '../GenUISchemaRenderer';
import type { GenUIComponent } from '../GenUIComponents';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

const mockToBlob = jest.fn();

jest.mock('html-to-image', () => ({
  toBlob: (...args: unknown[]) => mockToBlob(...args),
}));

const tableComponents: GenUIComponent[] = [
  {
    component: 'TABLE',
    headers: ['Name', 'Amount'],
    rows: [
      [
        { component: 'TEXT', value: 'Alice' },
        { component: 'AMOUNT', value: 1500, currency: 'INR' },
      ],
      [
        { component: 'TEXT', value: 'Bob, Jr' },
        { component: 'AMOUNT', value: 2500, currency: 'INR' },
      ],
    ],
  },
];

const cardComponents: GenUIComponent[] = [
  {
    component: 'CARD',
    title: 'Revenue Summary',
    description: 'Q1 overview',
    children: [{ component: 'TEXT', content: 'Body' }],
  },
];

// The button carries a unique `data-analytics-name`; querying by it targets the
// actual <button> deterministically (the accessible label is rendered on more
// than one node by IconButton + Tooltip).
const getActionButton = (container: HTMLElement, analyticsName: string): HTMLElement => {
  const button = container.querySelector<HTMLElement>(
    `button[data-analytics-name="${analyticsName}"]`,
  );
  if (!button) {
    throw new Error(`Action button not found: ${analyticsName}`);
  }
  return button;
};

describe('<GenUI /> export actions', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: jest.fn().mockResolvedValue(undefined) },
      configurable: true,
    });
    Object.defineProperty(URL, 'createObjectURL', {
      value: jest.fn().mockReturnValue('blob:mock'),
      configurable: true,
    });
    Object.defineProperty(URL, 'revokeObjectURL', { value: jest.fn(), configurable: true });
    jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Table', () => {
    it('copies display-formatted CSV to the clipboard and dispatches telemetry', async () => {
      const onActionClick = jest.fn();
      // Uses fireEvent (not userEvent) so the beforeEach clipboard mock isn't
      // shadowed by userEvent.setup()'s own clipboard stub.
      const { container } = renderWithTheme(
        <GenUIProvider config={{ onActionClick }}>
          <GenUISchemaRenderer components={tableComponents} />
        </GenUIProvider>,
      );

      fireEvent.click(getActionButton(container, 'genui-table-copy-button'));

      // Telemetry dispatches after the clipboard write resolves — wait on it.
      await waitFor(() => {
        expect(onActionClick).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'COPY',
            eventName: 'table_copy',
            data: expect.objectContaining({ status: 'success' }),
          }),
        );
      });

      expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
      const copiedCsv = (navigator.clipboard.writeText as jest.Mock).mock.calls[0][0] as string;
      expect(copiedCsv).toContain('Name,Amount');
      // Comma-containing field is quoted; amount is display-formatted (grouped digits).
      expect(copiedCsv).toContain('"Bob, Jr"');
      expect(copiedCsv).toMatch(/1[,.]?500/);
    });

    it('dispatches an error telemetry event when copy fails', async () => {
      const onActionClick = jest.fn();
      // Clipboard write rejects → copyToClipboard returns false → handler throws.
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: jest.fn().mockRejectedValue(new Error('denied')) },
        configurable: true,
      });
      const { container } = renderWithTheme(
        <GenUIProvider config={{ onActionClick }}>
          <GenUISchemaRenderer components={tableComponents} />
        </GenUIProvider>,
      );

      fireEvent.click(getActionButton(container, 'genui-table-copy-button'));

      await waitFor(() => {
        expect(onActionClick).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'COPY',
            eventName: 'table_copy',
            data: expect.objectContaining({ status: 'error' }),
          }),
        );
      });
    });

    it('downloads a CSV file and dispatches telemetry', async () => {
      const onActionClick = jest.fn();
      const user = userEvent.setup();
      const { container } = renderWithTheme(
        <GenUIProvider config={{ onActionClick }}>
          <GenUISchemaRenderer components={tableComponents} />
        </GenUIProvider>,
      );

      await user.click(getActionButton(container, 'genui-table-download-button'));

      await waitFor(() => {
        expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
      });
      const blobArg = (URL.createObjectURL as jest.Mock).mock.calls[0][0] as Blob;
      expect(blobArg.type).toContain('text/csv');
      expect(onActionClick).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'DOWNLOAD', eventName: 'table_download' }),
      );
    });
  });

  describe('Card', () => {
    it('captures the card as a PNG, downloads it, and dispatches telemetry', async () => {
      const onActionClick = jest.fn();
      const pngBlob = new Blob(['png'], { type: 'image/png' });
      mockToBlob.mockResolvedValue(pngBlob);
      const user = userEvent.setup();

      const { container } = renderWithTheme(
        <GenUIProvider config={{ onActionClick }}>
          <GenUISchemaRenderer components={cardComponents} />
        </GenUIProvider>,
      );

      await user.click(getActionButton(container, 'genui-card-download-button'));

      await waitFor(() => {
        expect(mockToBlob).toHaveBeenCalledTimes(1);
      });
      expect(URL.createObjectURL).toHaveBeenCalledWith(pngBlob);
      expect(onActionClick).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'DOWNLOAD', eventName: 'card_download' }),
      );
    });
  });
});
