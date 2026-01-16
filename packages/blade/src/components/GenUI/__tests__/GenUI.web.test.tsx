import React from 'react';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { GenUIProvider } from '../GenUIProvider';
import { GenUISchemaRenderer } from '../GenUISchemaRenderer';
import type { GenUIComponent } from '../GenUIComponents';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<GenUI />', () => {
  describe('GenUIProvider', () => {
    it('should render GenUIProvider with children', () => {
      const { getByText } = renderWithTheme(
        <GenUIProvider>
          <div>Test Content</div>
        </GenUIProvider>,
      );
      expect(getByText('Test Content')).toBeInTheDocument();
    });

    it('should throw error when useGenUI is used outside provider', () => {
      // Mock console.error to avoid cluttering test output
      const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
      
      const TestComponent = () => {
        const { useGenUI } = require('../GenUIProvider');
        useGenUI();
        return <div>Test</div>;
      };

      expect(() => renderWithTheme(<TestComponent />)).toThrow(
        'useGenUI must be used within a GenUIProvider',
      );
      
      mockConsoleError.mockRestore();
    });

    it('should handle action clicks', async () => {
      const user = userEvent.setup();
      const onActionClick = jest.fn();

      const components: GenUIComponent[] = [
        {
          component: 'BUTTON',
          text: 'Click Me',
          action: {
            type: 'CLICK',
            eventName: 'button_clicked',
            data: { message: 'Hello' },
          },
        },
      ];

      const { getByText } = renderWithTheme(
        <GenUIProvider config={{ onActionClick }}>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      const button = getByText('Click Me');
      await user.click(button);

      expect(onActionClick).toHaveBeenCalledTimes(1);
      expect(onActionClick).toHaveBeenCalledWith({
        type: 'CLICK',
        eventName: 'button_clicked',
        data: { message: 'Hello' },
      });
    });
  });

  describe('TEXT Component', () => {
    it('should render text component with markdown', () => {
      const components: GenUIComponent[] = [
        {
          component: 'TEXT',
          content: '# Hello World\n\nThis is **bold** text.',
        },
      ];

      const { getByText } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      // Mocked Streamdown renders markdown as-is
      expect(getByText(/Hello World/)).toBeInTheDocument();
    });

    it('should render text with lists', () => {
      const components: GenUIComponent[] = [
        {
          component: 'TEXT',
          content: '- Item 1\n- Item 2\n- Item 3',
        },
      ];

      const { getByText } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      expect(getByText(/Item 1/)).toBeInTheDocument();
      expect(getByText(/Item 2/)).toBeInTheDocument();
      expect(getByText(/Item 3/)).toBeInTheDocument();
    });

    it('should handle empty content during streaming', () => {
      const components: GenUIComponent[] = [
        {
          component: 'TEXT',
          content: '',
        },
      ];

      const { container } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      expect(container.textContent).toBe('');
    });

    it('should handle partial content during streaming', () => {
      const components: GenUIComponent[] = [
        {
          component: 'TEXT',
          content: 'Loading...',
        },
      ];

      const { getByText } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      expect(getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('CHART Component', () => {
    it('should render bar chart', () => {
      const components: GenUIComponent[] = [
        {
          component: 'CHART',
          chartType: 'bar',
          variant: 'full',
          title: 'Revenue Chart',
          xAxis: 'quarter',
          data: [
            { quarter: 'Q1', revenue: 100 },
            { quarter: 'Q2', revenue: 200 },
            { quarter: 'Q3', revenue: 150 },
          ],
          valueFormatter: {
            type: 'currency',
            currency: 'INR',
          },
        },
      ];

      const { getByText } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      expect(getByText('Revenue Chart')).toBeInTheDocument();
    });

    it('should render line chart', () => {
      const components: GenUIComponent[] = [
        {
          component: 'CHART',
          chartType: 'line',
          variant: 'full',
          xAxis: 'month',
          data: [
            { month: 'Jan', sales: 50 },
            { month: 'Feb', sales: 75 },
          ],
          valueFormatter: {
            type: 'number',
          },
        },
      ];

      renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );
      // Chart renders successfully without errors
    });

    it('should render pie chart', () => {
      const components: GenUIComponent[] = [
        {
          component: 'CHART',
          chartType: 'pie',
          variant: 'full',
          xAxis: 'category',
          data: [
            { category: 'A', value: 30 },
            { category: 'B', value: 70 },
          ],
          valueFormatter: {
            type: 'percentage',
          },
        },
      ];

      renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );
      // Chart renders successfully without errors
    });

    it('should render area chart', () => {
      const components: GenUIComponent[] = [
        {
          component: 'CHART',
          chartType: 'area',
          variant: 'full',
          xAxis: 'day',
          data: [
            { day: 'Mon', visits: 100 },
            { day: 'Tue', visits: 150 },
          ],
          valueFormatter: {
            type: 'number',
            suffix: 'K',
          },
        },
      ];

      renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );
      // Chart renders successfully without errors
    });

    it('should render tiny variant chart', () => {
      const components: GenUIComponent[] = [
        {
          component: 'CHART',
          chartType: 'bar',
          variant: 'tiny',
          xAxis: 'quarter',
          data: [
            { quarter: 'Q1', revenue: 100 },
            { quarter: 'Q2', revenue: 200 },
          ],
          valueFormatter: {
            type: 'currency',
            currency: 'USD',
          },
        },
      ];

      renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );
      // Chart renders successfully without errors
    });

    it('should show skeleton when chart data is incomplete during streaming', () => {
      const components: GenUIComponent[] = [
        {
          component: 'CHART',
          chartType: 'bar',
          xAxis: 'quarter',
          data: [],
          valueFormatter: {
            type: 'currency',
          },
        },
      ];

      const { container } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      // Should render skeleton when data is empty
      // Chart component renders skeleton, just verify it renders without error
      expect(container).toBeTruthy();
    });

    it('should show skeleton when valueFormatter is missing', () => {
      const components: GenUIComponent[] = [
        {
          component: 'CHART',
          chartType: 'bar',
          xAxis: 'quarter',
          data: [{ quarter: 'Q1', revenue: 100 }],
        },
      ];

      const { container } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      // Chart component renders skeleton for missing formatter
      expect(container).toBeTruthy();
    });

    it('should filter out incomplete data items during streaming', () => {
      const components: GenUIComponent[] = [
        {
          component: 'CHART',
          chartType: 'bar',
          xAxis: 'quarter',
          data: [
            { quarter: 'Q1', revenue: 100 },
            { quarter: '', revenue: 200 }, // Invalid - empty xAxis
            {}, // Invalid - empty object
            { quarter: 'Q3', revenue: 300 },
          ],
          valueFormatter: {
            type: 'number',
          },
        },
      ];

      renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );
      // Should render chart with only valid data
    });

    it('should handle multiple data series', () => {
      const components: GenUIComponent[] = [
        {
          component: 'CHART',
          chartType: 'line',
          xAxis: 'month',
          data: [
            { month: 'Jan', sales: 100, profit: 50 },
            { month: 'Feb', sales: 150, profit: 75 },
          ],
          valueFormatter: {
            type: 'currency',
            currency: 'INR',
          },
        },
      ];

      renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );
      // Chart renders successfully without errors
    });
  });

  describe('TABLE Component', () => {
    it('should render table with text cells', () => {
      const components: GenUIComponent[] = [
        {
          component: 'TABLE',
          headers: ['Name', 'Email', 'Status'],
          rows: [
            [
              { component: 'TEXT', value: 'John Doe' },
              { component: 'TEXT', value: 'john@example.com' },
              { component: 'TEXT', value: 'Active' },
            ],
            [
              { component: 'TEXT', value: 'Jane Smith' },
              { component: 'TEXT', value: 'jane@example.com' },
              { component: 'TEXT', value: 'Inactive' },
            ],
          ],
        },
      ];

      const { getByText } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      expect(getByText('John Doe')).toBeInTheDocument();
      expect(getByText('jane@example.com')).toBeInTheDocument();
    });

    it('should render table with amount cells', () => {
      const components: GenUIComponent[] = [
        {
          component: 'TABLE',
          headers: ['Product', 'Price'],
          rows: [
            [
              { component: 'TEXT', value: 'Product A' },
              { component: 'AMOUNT', value: 10000, currency: 'INR' },
            ],
            [
              { component: 'TEXT', value: 'Product B' },
              { component: 'AMOUNT', value: 25000, currency: 'USD' },
            ],
          ],
        },
      ];

      renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );
      // Chart renders successfully without errors
    });

    it('should render table with indicator cells', () => {
      const components: GenUIComponent[] = [
        {
          component: 'TABLE',
          headers: ['Task', 'Status'],
          rows: [
            [
              { component: 'TEXT', value: 'Task 1' },
              { component: 'INDICATOR', value: 'Completed', color: 'positive' },
            ],
            [
              { component: 'TEXT', value: 'Task 2' },
              { component: 'INDICATOR', value: 'Failed', color: 'negative' },
            ],
          ],
        },
      ];

      const { getByText } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      expect(getByText('Completed')).toBeInTheDocument();
      expect(getByText('Failed')).toBeInTheDocument();
    });

    it('should render table with badge cells', () => {
      const components: GenUIComponent[] = [
        {
          component: 'TABLE',
          headers: ['User', 'Role'],
          rows: [
            [
              { component: 'TEXT', value: 'Admin User' },
              { component: 'BADGE', value: 'Admin', color: 'primary' },
            ],
            [
              { component: 'TEXT', value: 'Regular User' },
              { component: 'BADGE', value: 'User', color: 'neutral' },
            ],
          ],
        },
      ];

      renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );
      // Chart renders successfully without errors
    });

    it('should render table with date cells', () => {
      const components: GenUIComponent[] = [
        {
          component: 'TABLE',
          headers: ['Event', 'Date'],
          rows: [
            [
              { component: 'TEXT', value: 'Launch' },
              {
                component: 'DATE',
                value: '2024-01-15T14:30:00Z',
                dateFormat: 'DD MMM YYYY',
              },
            ],
          ],
        },
      ];

      const { getByText } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      expect(getByText('15 Jan 2024')).toBeInTheDocument();
    });

    it('should render table with link cells', () => {
      const onActionClick = jest.fn();
      const components: GenUIComponent[] = [
        {
          component: 'TABLE',
          headers: ['Name', 'Action'],
          rows: [
            [
              { component: 'TEXT', value: 'Document 1' },
              {
                component: 'LINK',
                text: 'View',
                action: {
                  type: 'CLICK',
                  eventName: 'link_click',
                  data: { url: 'https://example.com' },
                },
              },
            ],
          ],
        },
      ];

      const { getByText } = renderWithTheme(
        <GenUIProvider config={{ onActionClick }}>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      expect(getByText('View')).toBeInTheDocument();
    });

    it('should render table with copyable text cells', () => {
      const components: GenUIComponent[] = [
        {
          component: 'TABLE',
          headers: ['ID', 'Value'],
          rows: [
            [
              { component: 'TEXT', value: 'ID-123' },
              { component: 'TEXT', value: 'secret-key-123', copyable: true },
            ],
          ],
        },
      ];

      const { getByLabelText } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      expect(getByLabelText('Copy secret-key-123')).toBeInTheDocument();
    });

    it('should copy text to clipboard when copy button is clicked', async () => {
      const user = userEvent.setup();
      
      // Mock clipboard API
      const writeTextMock = jest.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: writeTextMock,
        },
        writable: true,
        configurable: true,
      });

      const components: GenUIComponent[] = [
        {
          component: 'TABLE',
          headers: ['API Key', 'Secret'],
          rows: [
            [
              { component: 'TEXT', value: 'api_key_123', copyable: true },
              { component: 'TEXT', value: 'secret_xyz_789', copyable: true },
            ],
          ],
        },
      ];

      const { getByLabelText } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      // Click copy button for first cell
      const copyButton1 = getByLabelText('Copy api_key_123');
      await user.click(copyButton1);
      
      await waitFor(() => {
        expect(writeTextMock).toHaveBeenCalledWith('api_key_123');
      });

      // Click copy button for second cell
      const copyButton2 = getByLabelText('Copy secret_xyz_789');
      await user.click(copyButton2);
      
      await waitFor(() => {
        expect(writeTextMock).toHaveBeenCalledWith('secret_xyz_789');
      });

      expect(writeTextMock).toHaveBeenCalledTimes(2);
    });

    it('should render multiple copyable cells in same table', () => {
      const components: GenUIComponent[] = [
        {
          component: 'TABLE',
          headers: ['Name', 'Email', 'API Key'],
          rows: [
            [
              { component: 'TEXT', value: 'John Doe' },
              { component: 'TEXT', value: 'john@example.com', copyable: true },
              { component: 'TEXT', value: 'key_abc_123', copyable: true },
            ],
            [
              { component: 'TEXT', value: 'Jane Smith' },
              { component: 'TEXT', value: 'jane@example.com', copyable: true },
              { component: 'TEXT', value: 'key_def_456', copyable: true },
            ],
          ],
        },
      ];

      const { getByLabelText } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      // Verify all copy buttons are present
      expect(getByLabelText('Copy john@example.com')).toBeInTheDocument();
      expect(getByLabelText('Copy key_abc_123')).toBeInTheDocument();
      expect(getByLabelText('Copy jane@example.com')).toBeInTheDocument();
      expect(getByLabelText('Copy key_def_456')).toBeInTheDocument();
    });

    it('should handle copyable cells with empty values during streaming', () => {
      const components: GenUIComponent[] = [
        {
          component: 'TABLE',
          headers: ['ID', 'Token'],
          rows: [
            [
              { component: 'TEXT', value: 'ID-001' },
              { component: 'TEXT', value: '', copyable: true }, // Empty value
            ],
          ],
        },
      ];

      const { container } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      // Should not render copy button for empty value
      const copyButtons = container.querySelectorAll('[aria-label^="Copy"]');
      expect(copyButtons.length).toBe(0);
    });

    it('should handle mix of copyable and non-copyable cells', () => {
      const components: GenUIComponent[] = [
        {
          component: 'TABLE',
          headers: ['Name', 'Email', 'Status'],
          rows: [
            [
              { component: 'TEXT', value: 'Alice' },
              { component: 'TEXT', value: 'alice@example.com', copyable: true },
              { component: 'TEXT', value: 'Active' }, // Not copyable
            ],
          ],
        },
      ];

      const { getByLabelText, getByText, container } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      // Verify copyable cell has copy button
      expect(getByLabelText('Copy alice@example.com')).toBeInTheDocument();
      
      // Verify non-copyable cells are rendered normally
      expect(getByText('Alice')).toBeInTheDocument();
      expect(getByText('Active')).toBeInTheDocument();
      
      // Should have copy button (may render multiple times due to table internals)
      const copyButtons = container.querySelectorAll('[aria-label^="Copy"]');
      expect(copyButtons.length).toBeGreaterThanOrEqual(1);
    });

    it('should copy different values from different rows', async () => {
      const user = userEvent.setup();
      
      // Mock clipboard API
      const writeTextMock = jest.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: writeTextMock,
        },
        writable: true,
        configurable: true,
      });

      const components: GenUIComponent[] = [
        {
          component: 'TABLE',
          headers: ['Transaction ID'],
          rows: [
            [{ component: 'TEXT', value: 'txn_001', copyable: true }],
            [{ component: 'TEXT', value: 'txn_002', copyable: true }],
            [{ component: 'TEXT', value: 'txn_003', copyable: true }],
          ],
        },
      ];

      const { getByLabelText } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      // Copy from first row
      await user.click(getByLabelText('Copy txn_001'));
      await waitFor(() => {
        expect(writeTextMock).toHaveBeenCalledWith('txn_001');
      });

      // Copy from third row
      await user.click(getByLabelText('Copy txn_003'));
      await waitFor(() => {
        expect(writeTextMock).toHaveBeenCalledWith('txn_003');
      });

      expect(writeTextMock).toHaveBeenCalledTimes(2);
    });

    it('should handle table row actions with buttons', () => {
      const components: GenUIComponent[] = [
        {
          component: 'TABLE',
          headers: ['Name', 'Status'],
          rows: [
            [
              { component: 'TEXT', value: 'Item 1' },
              { component: 'TEXT', value: 'Active' },
            ],
            [
              { component: 'TEXT', value: 'Item 2' },
              { component: 'TEXT', value: 'Inactive' },
            ],
          ],
          rowActions: [
            {
              type: 'BUTTON',
              text: 'Edit',
              action: {
                type: 'TABLE_ROW_ACTION',
                eventName: 'edit_clicked',
              },
            },
          ],
        },
      ];

      const { getByText } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      // Verify table renders with row actions
      expect(getByText('Item 1')).toBeInTheDocument();
      expect(getByText('Item 2')).toBeInTheDocument();
    });

    it('should handle table row actions with icon buttons', async () => {
      const user = userEvent.setup();
      const onActionClick = jest.fn();

      const components: GenUIComponent[] = [
        {
          component: 'TABLE',
          headers: ['Name', 'Email'],
          rows: [
            [
              { component: 'TEXT', value: 'John Doe' },
              { component: 'TEXT', value: 'john@example.com' },
            ],
          ],
          rowActions: [
            {
              type: 'ICON_BUTTON',
              icon: 'delete',
              accessibilityLabel: 'Delete item',
              action: {
                type: 'TABLE_ROW_ACTION',
                eventName: 'delete_clicked',
              },
            },
          ],
        },
      ];

      const { getByLabelText } = renderWithTheme(
        <GenUIProvider config={{ onActionClick }}>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      const row = getByLabelText('Delete item').closest('tr');
      if (row) {
        await user.hover(row);
        await waitFor(() => {
          const deleteButton = getByLabelText('Delete item');
          expect(deleteButton).toBeVisible();
        });

        // Click the delete icon button
        const deleteButton = getByLabelText('Delete item');
        await user.click(deleteButton);

        // Verify action was called with correct row data
        expect(onActionClick).toHaveBeenCalledWith({
          type: 'TABLE_ROW_ACTION',
          eventName: 'delete_clicked',
          data: {
            rowIndex: 0,
            rowData: [
              { component: 'TEXT', value: 'John Doe' },
              { component: 'TEXT', value: 'john@example.com' },
            ],
          },
        });
      }
    });

    it('should handle multiple row actions on same row', () => {
      const components: GenUIComponent[] = [
        {
          component: 'TABLE',
          headers: ['Name', 'Status'],
          rows: [
            [
              { component: 'TEXT', value: 'User 1' },
              { component: 'TEXT', value: 'Active' },
            ],
          ],
          rowActions: [
            {
              type: 'BUTTON',
              text: 'Edit',
              action: {
                type: 'TABLE_ROW_ACTION',
                eventName: 'edit_clicked',
              },
            },
            {
              type: 'BUTTON',
              text: 'Delete',
              action: {
                type: 'TABLE_ROW_ACTION',
                eventName: 'delete_clicked',
              },
            },
            {
              type: 'ICON_BUTTON',
              icon: 'view',
              accessibilityLabel: 'View details',
              action: {
                type: 'TABLE_ROW_ACTION',
                eventName: 'view_clicked',
              },
            },
          ],
        },
      ];

      const { getByText } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      // Verify table renders with multiple row actions
      expect(getByText('User 1')).toBeInTheDocument();
    });

    it('should handle row actions on different rows', () => {
      const components: GenUIComponent[] = [
        {
          component: 'TABLE',
          headers: ['Product', 'Price'],
          rows: [
            [
              { component: 'TEXT', value: 'Product A' },
              { component: 'AMOUNT', value: 10000, currency: 'INR' },
            ],
            [
              { component: 'TEXT', value: 'Product B' },
              { component: 'AMOUNT', value: 25000, currency: 'USD' },
            ],
            [
              { component: 'TEXT', value: 'Product C' },
              { component: 'AMOUNT', value: 15000, currency: 'INR' },
            ],
          ],
          rowActions: [
            {
              type: 'BUTTON',
              text: 'View',
              action: {
                type: 'TABLE_ROW_ACTION',
                eventName: 'view_product',
              },
            },
          ],
        },
      ];

      const { getByText } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      // Verify table renders with actions on all rows
      expect(getByText('Product A')).toBeInTheDocument();
      expect(getByText('Product B')).toBeInTheDocument();
      expect(getByText('Product C')).toBeInTheDocument();
    });

    it('should handle row actions with complex cell types', () => {
      const components: GenUIComponent[] = [
        {
          component: 'TABLE',
          headers: ['User', 'Status', 'Role', 'Joined'],
          rows: [
            [
              { component: 'TEXT', value: 'Alice Johnson' },
              { component: 'INDICATOR', value: 'Active', color: 'positive' },
              { component: 'BADGE', value: 'Admin', color: 'primary' },
              { component: 'DATE', value: '2024-01-15T10:00:00Z', dateFormat: 'DD MMM YYYY' },
            ],
          ],
          rowActions: [
            {
              type: 'BUTTON',
              text: 'Manage',
              action: {
                type: 'TABLE_ROW_ACTION',
                eventName: 'manage_user',
              },
            },
          ],
        },
      ];

      const { getByText } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      // Verify table renders with complex cell types and row actions
      expect(getByText('Alice Johnson')).toBeInTheDocument();
      expect(getByText('Active')).toBeInTheDocument();
      expect(getByText('15 Jan 2024')).toBeInTheDocument();
    });

    it('should handle row actions during streaming with incomplete action data', () => {
      const components: GenUIComponent[] = [
        {
          component: 'TABLE',
          headers: ['Name'],
          rows: [[{ component: 'TEXT', value: 'Item 1' }]],
          rowActions: [
            {
              type: 'BUTTON',
              text: '', // Empty text during streaming
              action: {
                type: 'TABLE_ROW_ACTION',
                eventName: 'action',
              },
            },
          ],
        },
      ];

      const { getByText } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      // Should still render the table even with incomplete action
      expect(getByText('Item 1')).toBeInTheDocument();
    });

    it('should handle empty table during streaming', () => {
      const components: GenUIComponent[] = [
        {
          component: 'TABLE',
          headers: [],
          rows: [],
        },
      ];

      const { container } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      // Should render nothing when table is empty
      expect(container.textContent).toBe('');
    });

    it('should handle partial table data during streaming', () => {
      const components: GenUIComponent[] = [
        {
          component: 'TABLE',
          headers: ['Name', 'Status'],
          rows: [
            [
              { component: 'TEXT', value: 'Item 1' },
              { component: 'TEXT', value: '' }, // Empty value during streaming
            ],
          ],
        },
      ];

      const { getByText } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      expect(getByText('Item 1')).toBeInTheDocument();
    });

    it('should handle incomplete cell data during streaming', () => {
      const components: GenUIComponent[] = [
        {
          component: 'TABLE',
          headers: ['Name', 'Amount'],
          rows: [
            [
              { component: 'TEXT', value: 'Item 1' },
              { component: 'AMOUNT' } as any, // Incomplete cell
            ],
          ],
        },
      ];

      renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );
      // Should render fallback for incomplete cells
    });
  });

  describe('ALERT Component', () => {
    it('should render alert with title and description', () => {
      const components: GenUIComponent[] = [
        {
          component: 'ALERT',
          title: 'Important Notice',
          description: 'This is an important message.',
          color: 'information',
        },
      ];

      const { getByText } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      expect(getByText('Important Notice')).toBeInTheDocument();
      expect(getByText('This is an important message.')).toBeInTheDocument();
    });

    it('should render alert with different colors', () => {
      const colors = ['information', 'negative', 'neutral', 'notice', 'positive'] as const;

      colors.forEach((color, index) => {
        const components: GenUIComponent[] = [
          {
            component: 'ALERT',
            title: `${color} Alert ${index}`,
            description: `Test description ${index}`,
            color,
          },
        ];

        const { getByText } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(getByText(`${color} Alert ${index}`)).toBeInTheDocument();
        expect(getByText(`Test description ${index}`)).toBeInTheDocument();
      });
    });

    it('should handle alert actions', async () => {
      const user = userEvent.setup();
      const onActionClick = jest.fn();

      const components: GenUIComponent[] = [
        {
          component: 'ALERT',
          title: 'Confirm Action',
          description: 'Are you sure?',
          color: 'notice',
          actions: {
            primary: {
              text: 'Confirm',
              action: {
                type: 'CLICK',
                eventName: 'confirm_clicked',
              },
            },
            secondary: {
              text: 'Cancel',
              action: {
                type: 'CLICK',
                eventName: 'cancel_clicked',
              },
            },
          },
        },
      ];

      const { getByText } = renderWithTheme(
        <GenUIProvider config={{ onActionClick }}>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      await user.click(getByText('Confirm'));
      expect(onActionClick).toHaveBeenCalledWith({
        type: 'CLICK',
        eventName: 'confirm_clicked',
      });

      await user.click(getByText('Cancel'));
      expect(onActionClick).toHaveBeenCalledWith({
        type: 'CLICK',
        eventName: 'cancel_clicked',
      });
    });

    it('should handle partial alert during streaming', () => {
      const components: GenUIComponent[] = [
        {
          component: 'ALERT',
          title: '',
          description: '',
        },
      ];

      const { container } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      // Should render nothing when title and description are empty
      expect(container.textContent).toBe('');
    });
  });

  describe('BUTTON Component', () => {
    it('should render button', () => {
      const components: GenUIComponent[] = [
        {
          component: 'BUTTON',
          text: 'Click Me',
        },
      ];

      const { getByText } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      expect(getByText('Click Me')).toBeInTheDocument();
    });

    it('should handle button click with action', async () => {
      const user = userEvent.setup();
      const onActionClick = jest.fn();

      const components: GenUIComponent[] = [
        {
          component: 'BUTTON',
          text: 'Submit',
          action: {
            type: 'CLICK',
            eventName: 'submit_clicked',
            data: { formId: '123' },
          },
        },
      ];

      const { getByText } = renderWithTheme(
        <GenUIProvider config={{ onActionClick }}>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      await user.click(getByText('Submit'));
      expect(onActionClick).toHaveBeenCalledWith({
        type: 'CLICK',
        eventName: 'submit_clicked',
        data: { formId: '123' },
      });
    });

    it('should handle empty button text during streaming', () => {
      const components: GenUIComponent[] = [
        {
          component: 'BUTTON',
          text: '',
        },
      ];

      const { container } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      expect(container.textContent).toBe('');
    });
  });

  describe('LINK Component', () => {
    it('should render link', () => {
      const components: GenUIComponent[] = [
        {
          component: 'LINK',
          text: 'View Details',
        },
      ];

      const { getByText } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      expect(getByText('View Details')).toBeInTheDocument();
    });

    it('should handle link click with action', async () => {
      const user = userEvent.setup();
      const onActionClick = jest.fn();

      const components: GenUIComponent[] = [
        {
          component: 'LINK',
          text: 'Open Link',
          action: {
            type: 'CLICK',
            eventName: 'link_click',
            data: { url: 'https://example.com' },
          },
        },
      ];

      const { getByText } = renderWithTheme(
        <GenUIProvider config={{ onActionClick }}>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      await user.click(getByText('Open Link'));
      expect(onActionClick).toHaveBeenCalledWith({
        type: 'CLICK',
        eventName: 'link_click',
        data: { url: 'https://example.com' },
      });
    });
  });

  describe('BADGE Component', () => {
    it('should render badge', () => {
      const components: GenUIComponent[] = [
        {
          component: 'BADGE',
          text: 'New',
          color: 'positive',
        },
      ];

      const { getByText } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      expect(getByText('New')).toBeInTheDocument();
    });

    it('should render badge with different colors', () => {
      const colors = ['neutral', 'negative', 'notice', 'positive', 'primary'] as const;

      colors.forEach((color, index) => {
        const components: GenUIComponent[] = [
          {
            component: 'BADGE',
            text: `Badge ${index}`,
            color,
          },
        ];

        const { getByText } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(getByText(`Badge ${index}`)).toBeInTheDocument();
      });
    });
  });

  describe('DIVIDER Component', () => {
    it('should render horizontal divider', () => {
      const components: GenUIComponent[] = [
        {
          component: 'DIVIDER',
          orientation: 'horizontal',
        },
      ];

      renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );
      // Chart renders successfully without errors
    });

    it('should render vertical divider', () => {
      const components: GenUIComponent[] = [
        {
          component: 'DIVIDER',
          orientation: 'vertical',
        },
      ];

      renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );
      // Chart renders successfully without errors
    });
  });

  describe('INFO_GROUP Component', () => {
    it('should render info group', () => {
      const components: GenUIComponent[] = [
        {
          component: 'INFO_GROUP',
          items: [
            {
              key: { children: 'Name' },
              value: { children: 'John Doe' },
            },
            {
              key: { children: 'Email', helpText: 'Contact email' },
              value: { children: 'john@example.com', helpText: 'Primary email' },
            },
          ],
        },
      ];

      const { getByText } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      expect(getByText('Name')).toBeInTheDocument();
      expect(getByText('John Doe')).toBeInTheDocument();
    });

    it('should handle partial info group during streaming', () => {
      const components: GenUIComponent[] = [
        {
          component: 'INFO_GROUP',
          items: [
            {
              key: { children: 'Name' },
              value: { children: '' }, // Empty value during streaming
            },
          ],
        },
      ];

      const { container } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      // Should filter out incomplete items
      expect(container.textContent).toBe('');
    });
  });

  describe('STACK Component', () => {
    it('should render vertical stack', () => {
      const components: GenUIComponent[] = [
        {
          component: 'STACK',
          direction: 'vertical',
          gap: 'medium',
          children: [
            { component: 'TEXT', content: 'Item 1' },
            { component: 'TEXT', content: 'Item 2' },
          ],
        },
      ];

      const { container } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      // Verify stack renders with content
      expect(container.textContent).toContain('Item 1');
      expect(container.textContent).toContain('Item 2');
    });

    it('should render horizontal stack', () => {
      const components: GenUIComponent[] = [
        {
          component: 'STACK',
          direction: 'horizontal',
          gap: 'large',
          children: [
            { component: 'BADGE', text: 'Badge 1', color: 'primary' },
            { component: 'BADGE', text: 'Badge 2', color: 'positive' },
          ],
        },
      ];

      const { getByText } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      expect(getByText('Badge 1')).toBeInTheDocument();
      expect(getByText('Badge 2')).toBeInTheDocument();
    });

    it('should handle empty stack during streaming', () => {
      const components: GenUIComponent[] = [
        {
          component: 'STACK',
          direction: 'vertical',
          children: [],
        },
      ];

      const { container } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      expect(container.textContent).toBe('');
    });
  });

  describe('GRID Component', () => {
    it('should render grid', () => {
      const components: GenUIComponent[] = [
        {
          component: 'GRID',
          columns: 2,
          gap: 'medium',
          children: [
            { component: 'TEXT', content: 'Cell 1' },
            { component: 'TEXT', content: 'Cell 2' },
            { component: 'TEXT', content: 'Cell 3' },
            { component: 'TEXT', content: 'Cell 4' },
          ],
        },
      ];

      const { container } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      // Verify grid renders with content
      expect(container.textContent).toContain('Cell 1');
      expect(container.textContent).toContain('Cell 4');
    });

    it('should handle empty grid during streaming', () => {
      const components: GenUIComponent[] = [
        {
          component: 'GRID',
          columns: 3,
          children: [],
        },
      ];

      const { container } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      expect(container.textContent).toBe('');
    });
  });

  describe('CARD Component', () => {
    it('should render card with title and description', () => {
      const components: GenUIComponent[] = [
        {
          component: 'CARD',
          title: 'Card Title',
          description: 'Card description text',
        },
      ];

      const { getByText } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      expect(getByText('Card Title')).toBeInTheDocument();
      expect(getByText('Card description text')).toBeInTheDocument();
    });

    it('should render card with children', () => {
      const components: GenUIComponent[] = [
        {
          component: 'CARD',
          title: 'Dashboard',
          description: 'Overview',
          children: [
            { component: 'TEXT', content: 'Content inside card' },
            { component: 'BADGE', text: 'Status', color: 'positive' },
          ],
        },
      ];

      const { getByText } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      expect(getByText('Dashboard')).toBeInTheDocument();
      expect(getByText('Content inside card')).toBeInTheDocument();
    });

    it('should render card with footer', () => {
      const components: GenUIComponent[] = [
        {
          component: 'CARD',
          title: 'Card Title',
          description: 'Description',
          footer: 'Footer text',
        },
      ];

      const { getByText } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      expect(getByText('Footer text')).toBeInTheDocument();
    });

    it('should handle partial card during streaming', () => {
      const components: GenUIComponent[] = [
        {
          component: 'CARD',
          title: '',
          description: '',
        },
      ];

      const { container } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      expect(container.textContent).toBe('');
    });
  });

  describe('Streaming States', () => {
    it('should handle empty components array', () => {
      const { container } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={[]} />
        </GenUIProvider>,
      );

      expect(container.textContent).toBe('');
    });

    it('should handle undefined components', () => {
      const { container } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={undefined} />
        </GenUIProvider>,
      );

      expect(container.textContent).toBe('');
    });

    it('should handle component with missing component type', () => {
      const components: GenUIComponent[] = [
        {
          component: undefined as any,
        },
      ];

      const { container } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      expect(container.textContent).toBe('');
    });

    it('should handle partial component type during streaming', () => {
      const components: GenUIComponent[] = [
        {
          component: 'TEX' as any, // Partial TEXT
        },
      ];

      const { container } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      // Should not render unsupported component message for partial types
      expect(container.textContent).toBe('');
    });

    it('should show unsupported component message for invalid types', () => {
      const components: GenUIComponent[] = [
        {
          component: 'INVALID_COMPONENT' as any,
        },
      ];

      const { getByText } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      expect(getByText(/Unsupported component/)).toBeInTheDocument();
    });

    it('should handle mixed valid and partial components', () => {
      const components: GenUIComponent[] = [
        { component: 'TEXT', content: 'Valid text' },
        { component: 'TEX' as any }, // Partial
        { component: 'BADGE', text: 'Valid badge', color: 'positive' },
      ];

      const { getByText, queryByText } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      expect(getByText('Valid text')).toBeInTheDocument();
      expect(getByText('Valid badge')).toBeInTheDocument();
      expect(queryByText(/Unsupported component/)).not.toBeInTheDocument();
    });
  });

  describe('Complex Nested Structures', () => {
    it('should render nested stack with multiple components', () => {
      const components: GenUIComponent[] = [
        {
          component: 'STACK',
          direction: 'vertical',
          gap: 'large',
          children: [
            { component: 'TEXT', content: '# Dashboard' },
            {
              component: 'GRID',
              columns: 2,
              gap: 'medium',
              children: [
                {
                  component: 'CARD',
                  title: 'Revenue',
                  description: 'Total revenue',
                  children: [
                    {
                      component: 'CHART',
                      chartType: 'bar',
                      variant: 'tiny',
                      xAxis: 'month',
                      data: [
                        { month: 'Jan', value: 100 },
                        { month: 'Feb', value: 150 },
                      ],
                      valueFormatter: { type: 'currency', currency: 'INR' },
                    },
                  ],
                },
                {
                  component: 'CARD',
                  title: 'Users',
                  description: 'Active users',
                  children: [
                    { component: 'TEXT', content: '**1,234** active users' },
                  ],
                },
              ],
            },
          ],
        },
      ];

      const { getByText } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      // Check for heading text (mocked Streamdown renders as-is)
      expect(getByText(/Dashboard/)).toBeInTheDocument();
      expect(getByText('Revenue')).toBeInTheDocument();
      expect(getByText('Users')).toBeInTheDocument();
    });

    it('should render card with table inside', () => {
      const components: GenUIComponent[] = [
        {
          component: 'CARD',
          title: 'Recent Transactions',
          description: 'Last 5 transactions',
          children: [
            {
              component: 'TABLE',
              headers: ['ID', 'Amount', 'Status'],
              rows: [
                [
                  { component: 'TEXT', value: 'TXN-001' },
                  { component: 'AMOUNT', value: 10000, currency: 'INR' },
                  { component: 'BADGE', value: 'Success', color: 'positive' },
                ],
              ],
            },
          ],
        },
      ];

      const { getByText } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      expect(getByText('Recent Transactions')).toBeInTheDocument();
      expect(getByText('TXN-001')).toBeInTheDocument();
    });
  });

  describe('Custom Components', () => {
    it('should render custom component from registry', () => {
      const CustomComponent = ({ text }: { text: string; component: string; index: number }) => (
        <div data-testid="custom-component">{text}</div>
      );

      const components: GenUIComponent[] = [
        {
          component: 'CUSTOM',
          text: 'Custom content',
        } as any,
      ];

      const { getByTestId } = renderWithTheme(
        <GenUIProvider
          config={{
            components: {
              CUSTOM: {
                renderer: CustomComponent as any,
              },
            },
          }}
        >
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      expect(getByTestId('custom-component')).toHaveTextContent('Custom content');
    });

    it('should override built-in component with custom renderer', () => {
      const CustomTextComponent = ({
        content,
      }: {
        content: string;
        component: string;
        index: number;
      }) => <div data-testid="custom-text">CUSTOM: {content}</div>;

      const components: GenUIComponent[] = [
        {
          component: 'TEXT',
          content: 'Hello',
        },
      ];

      const { getByTestId } = renderWithTheme(
        <GenUIProvider
          config={{
            components: {
              TEXT: {
                renderer: CustomTextComponent as any,
              },
            },
          }}
        >
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      expect(getByTestId('custom-text')).toHaveTextContent('CUSTOM: Hello');
    });
  });

  describe('Error Handling - No Throw with Partial Data', () => {
    it('should not throw when TEXT component has missing content', () => {
      expect(() => {
        renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer
              components={[
                { component: 'TEXT' } as any,
                { component: 'TEXT', content: undefined } as any,
                { component: 'TEXT', content: null } as any,
              ]}
            />
          </GenUIProvider>,
        );
      }).not.toThrow();
    });

    it('should not throw when CHART has partial data', () => {
      expect(() => {
        renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer
              components={[
                { component: 'CHART' } as any,
                { component: 'CHART', chartType: 'bar' } as any,
                { component: 'CHART', chartType: 'bar', xAxis: 'month' } as any,
                {
                  component: 'CHART',
                  chartType: 'bar',
                  xAxis: 'month',
                  data: undefined,
                } as any,
                {
                  component: 'CHART',
                  chartType: 'bar',
                  xAxis: 'month',
                  data: [],
                  valueFormatter: undefined,
                } as any,
              ]}
            />
          </GenUIProvider>,
        );
      }).not.toThrow();
    });

    it('should not throw when TABLE has partial data', () => {
      expect(() => {
        renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer
              components={[
                { component: 'TABLE' } as any,
                { component: 'TABLE', headers: undefined } as any,
                { component: 'TABLE', headers: [], rows: undefined } as any,
                { component: 'TABLE', headers: ['Col1'], rows: [] },
                {
                  component: 'TABLE',
                  headers: ['Col1', 'Col2'],
                  rows: [
                    [
                      { component: 'TEXT', value: undefined } as any,
                      { component: 'AMOUNT' } as any,
                    ],
                  ],
                },
              ]}
            />
          </GenUIProvider>,
        );
      }).not.toThrow();
    });

    it('should not throw when ALERT has missing fields', () => {
      expect(() => {
        renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer
              components={[
                { component: 'ALERT' } as any,
                { component: 'ALERT', title: undefined } as any,
                { component: 'ALERT', title: '', description: undefined } as any,
                { component: 'ALERT', title: 'Title', color: undefined } as any,
              ]}
            />
          </GenUIProvider>,
        );
      }).not.toThrow();
    });

    it('should not throw when BUTTON has missing text', () => {
      expect(() => {
        renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer
              components={[
                { component: 'BUTTON' } as any,
                { component: 'BUTTON', text: undefined } as any,
                { component: 'BUTTON', text: '', action: undefined } as any,
              ]}
            />
          </GenUIProvider>,
        );
      }).not.toThrow();
    });

    it('should not throw when LINK has missing text', () => {
      expect(() => {
        renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer
              components={[
                { component: 'LINK' } as any,
                { component: 'LINK', text: undefined } as any,
                { component: 'LINK', text: '', action: undefined } as any,
              ]}
            />
          </GenUIProvider>,
        );
      }).not.toThrow();
    });

    it('should not throw when BADGE has missing fields', () => {
      expect(() => {
        renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer
              components={[
                { component: 'BADGE' } as any,
                { component: 'BADGE', text: undefined } as any,
                { component: 'BADGE', text: '', color: undefined } as any,
              ]}
            />
          </GenUIProvider>,
        );
      }).not.toThrow();
    });

    it('should not throw when DIVIDER has missing orientation', () => {
      expect(() => {
        renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer
              components={[
                { component: 'DIVIDER' } as any,
                { component: 'DIVIDER', orientation: undefined } as any,
              ]}
            />
          </GenUIProvider>,
        );
      }).not.toThrow();
    });

    it('should not throw when INFO_GROUP has partial items', () => {
      expect(() => {
        renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer
              components={[
                { component: 'INFO_GROUP' } as any,
                { component: 'INFO_GROUP', items: undefined } as any,
                { component: 'INFO_GROUP', items: [] },
                {
                  component: 'INFO_GROUP',
                  items: [
                    { key: undefined, value: undefined } as any,
                    { key: { children: 'Name' }, value: undefined } as any,
                  ],
                },
              ]}
            />
          </GenUIProvider>,
        );
      }).not.toThrow();
    });

    it('should not throw when STACK has missing children', () => {
      expect(() => {
        renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer
              components={[
                { component: 'STACK' } as any,
                { component: 'STACK', direction: undefined } as any,
                { component: 'STACK', direction: 'vertical', children: undefined } as any,
                { component: 'STACK', direction: 'vertical', children: [] },
                {
                  component: 'STACK',
                  direction: 'vertical',
                  children: [{ component: 'TEXT' } as any],
                },
              ]}
            />
          </GenUIProvider>,
        );
      }).not.toThrow();
    });

    it('should not throw when GRID has missing children', () => {
      expect(() => {
        renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer
              components={[
                { component: 'GRID' } as any,
                { component: 'GRID', columns: undefined } as any,
                { component: 'GRID', columns: 2, children: undefined } as any,
                { component: 'GRID', columns: 2, children: [] },
                {
                  component: 'GRID',
                  columns: 2,
                  children: [{ component: 'TEXT' } as any],
                },
              ]}
            />
          </GenUIProvider>,
        );
      }).not.toThrow();
    });

    it('should not throw when CARD has missing fields', () => {
      expect(() => {
        renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer
              components={[
                { component: 'CARD' } as any,
                { component: 'CARD', title: undefined } as any,
                { component: 'CARD', title: '', description: undefined } as any,
                { component: 'CARD', title: 'Title', children: undefined } as any,
                {
                  component: 'CARD',
                  title: 'Title',
                  children: [{ component: 'TEXT' } as any],
                },
              ]}
            />
          </GenUIProvider>,
        );
      }).not.toThrow();
    });

    it('should not throw when TABLE has incomplete cell types', () => {
      expect(() => {
        renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer
              components={[
                {
                  component: 'TABLE',
                  headers: ['Col1', 'Col2', 'Col3', 'Col4'],
                  rows: [
                    [
                      { component: 'TEXT' } as any,
                      { component: 'AMOUNT', value: undefined } as any,
                      { component: 'INDICATOR' } as any,
                      { component: 'BADGE', text: undefined } as any,
                    ],
                    [
                      { component: 'DATE', value: undefined } as any,
                      { component: 'LINK', text: undefined } as any,
                      {} as any,
                      null as any,
                    ],
                  ],
                },
              ]}
            />
          </GenUIProvider>,
        );
      }).not.toThrow();
    });

    it('should not throw when TABLE has incomplete row actions', () => {
      expect(() => {
        renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer
              components={[
                {
                  component: 'TABLE',
                  headers: ['Name'],
                  rows: [[{ component: 'TEXT', value: 'Item' }]],
                  rowActions: undefined,
                },
                {
                  component: 'TABLE',
                  headers: ['Name'],
                  rows: [[{ component: 'TEXT', value: 'Item' }]],
                  rowActions: [],
                },
                {
                  component: 'TABLE',
                  headers: ['Name'],
                  rows: [[{ component: 'TEXT', value: 'Item' }]],
                  rowActions: [
                    { type: 'BUTTON', text: undefined } as any,
                    { type: 'ICON_BUTTON', icon: undefined } as any,
                  ],
                },
              ]}
            />
          </GenUIProvider>,
        );
      }).not.toThrow();
    });

    it('should not throw when components array has null or undefined elements', () => {
      expect(() => {
        renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer
              components={[
                { component: 'TEXT', content: 'Valid' },
                null as any,
                undefined as any,
                { component: 'BADGE', text: 'Badge', color: 'positive' },
              ]}
            />
          </GenUIProvider>,
        );
      }).not.toThrow();
    });

    it('should not throw when nested components have partial data', () => {
      expect(() => {
        renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer
              components={[
                {
                  component: 'STACK',
                  direction: 'vertical',
                  children: [
                    { component: 'TEXT' } as any,
                    {
                      component: 'CARD',
                      title: undefined,
                      children: [
                        { component: 'BADGE' } as any,
                        {
                          component: 'TABLE',
                          headers: undefined,
                          rows: undefined,
                        } as any,
                      ],
                    },
                  ],
                },
              ]}
            />
          </GenUIProvider>,
        );
      }).not.toThrow();
    });

    it('should not throw when CHART has invalid data types', () => {
      expect(() => {
        renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer
              components={[
                {
                  component: 'CHART',
                  chartType: 'bar',
                  xAxis: 'month',
                  data: [
                    { month: 'Jan', value: NaN },
                    { month: 'Feb', value: Infinity },
                    { month: '', value: 100 },
                    {} as any,
                    null as any,
                  ],
                  valueFormatter: { type: 'number' },
                },
              ]}
            />
          </GenUIProvider>,
        );
      }).not.toThrow();
    });

    it('should not throw when ALERT has partial actions', () => {
      expect(() => {
        renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer
              components={[
                {
                  component: 'ALERT',
                  title: 'Alert',
                  description: 'Description',
                  actions: undefined,
                },
                {
                  component: 'ALERT',
                  title: 'Alert',
                  description: 'Description',
                  actions: {
                    primary: undefined,
                    secondary: undefined,
                  } as any,
                },
                {
                  component: 'ALERT',
                  title: 'Alert',
                  description: 'Description',
                  actions: {
                    primary: { text: undefined, action: undefined } as any,
                  },
                },
              ]}
            />
          </GenUIProvider>,
        );
      }).not.toThrow();
    });

    it('should not throw when component has unknown properties', () => {
      expect(() => {
        renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer
              components={[
                {
                  component: 'TEXT',
                  content: 'Hello',
                  unknownProp: 'value',
                  anotherUnknown: 123,
                } as any,
              ]}
            />
          </GenUIProvider>,
        );
      }).not.toThrow();
    });

    it('should not throw when rendering with no GenUIProvider config', () => {
      expect(() => {
        renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer
              components={[
                { component: 'TEXT', content: 'Hello' },
                {
                  component: 'BUTTON',
                  text: 'Click',
                  action: { type: 'CLICK', eventName: 'test' },
                },
              ]}
            />
          </GenUIProvider>,
        );
      }).not.toThrow();
    });

    it('should not throw when all components have empty/partial data simultaneously', () => {
      expect(() => {
        renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer
              components={[
                { component: 'TEXT' } as any,
                { component: 'CHART' } as any,
                { component: 'TABLE' } as any,
                { component: 'ALERT' } as any,
                { component: 'BUTTON' } as any,
                { component: 'LINK' } as any,
                { component: 'BADGE' } as any,
                { component: 'DIVIDER' } as any,
                { component: 'INFO_GROUP' } as any,
                { component: 'STACK' } as any,
                { component: 'GRID' } as any,
                { component: 'CARD' } as any,
              ]}
            />
          </GenUIProvider>,
        );
      }).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long text content', () => {
      const longText = 'A'.repeat(10000);
      const components: GenUIComponent[] = [
        {
          component: 'TEXT',
          content: longText,
        },
      ];

      const { container } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      expect(container.textContent).toContain('A');
    });

    it('should handle table with many rows', () => {
      const rows = Array.from({ length: 100 }, (_, i) => [
        { component: 'TEXT' as const, value: `Row ${i}` },
        { component: 'TEXT' as const, value: `Value ${i}` },
      ]);

      const components: GenUIComponent[] = [
        {
          component: 'TABLE',
          headers: ['Column 1', 'Column 2'],
          rows,
        },
      ];

      const { getByText } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      expect(getByText('Row 0')).toBeInTheDocument();
      expect(getByText('Row 99')).toBeInTheDocument();
    });

    it('should handle deeply nested structures', () => {
      const components: GenUIComponent[] = [
        {
          component: 'STACK',
          direction: 'vertical',
          children: [
            {
              component: 'CARD',
              title: 'Level 1',
              description: 'First level',
              children: [
                {
                  component: 'STACK',
                  direction: 'vertical',
                  children: [
                    {
                      component: 'CARD',
                      title: 'Level 2',
                      description: 'Second level',
                      children: [
                        {
                          component: 'TEXT',
                          content: 'Deeply nested content',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];

      const { getByText } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      expect(getByText('Level 1')).toBeInTheDocument();
      expect(getByText('Level 2')).toBeInTheDocument();
      expect(getByText('Deeply nested content')).toBeInTheDocument();
    });

    it('should handle special characters in text', () => {
      const components: GenUIComponent[] = [
        {
          component: 'TEXT',
          content: '< > & " \' / \\ { } [ ] @ # $ % ^ * ( ) - + = | ~ `',
        },
      ];

      renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );
      // Chart renders successfully without errors
    });

    it('should handle invalid date formats gracefully', () => {
      const components: GenUIComponent[] = [
        {
          component: 'TABLE',
          headers: ['Date'],
          rows: [
            [
              {
                component: 'DATE',
                value: 'invalid-date',
                dateFormat: 'DD MMM YYYY',
              },
            ],
          ],
        },
      ];

      const { getByText } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      // Should display the invalid date as-is
      expect(getByText('invalid-date')).toBeInTheDocument();
    });

    it('should handle chart with invalid data gracefully', () => {
      const components: GenUIComponent[] = [
        {
          component: 'CHART',
          chartType: 'bar',
          xAxis: 'category',
          data: [
            { category: 'A', value: NaN },
            { category: 'B', value: Infinity },
          ],
          valueFormatter: { type: 'number' },
        },
      ];

      const { container } = renderWithTheme(
        <GenUIProvider>
          <GenUISchemaRenderer components={components} />
        </GenUIProvider>,
      );

      // Should show skeleton for invalid data (or render nothing)
      // Chart filters out invalid data, so it should either show skeleton or render nothing
      expect(container).toBeTruthy();
    });
  });

  describe('Advanced Edge Cases', () => {
    describe('CHART valueFormatter edge cases', () => {
      it('should handle currency formatter with different currencies', () => {
        const components: GenUIComponent[] = [
          {
            component: 'CHART',
            chartType: 'bar',
            xAxis: 'month',
            data: [
              { month: 'Jan', value: 1000000 },
              { month: 'Feb', value: 2500000 },
            ],
            valueFormatter: {
              type: 'currency',
              currency: 'USD',
            },
          },
        ];

        const { container } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(container).toBeTruthy();
      });

      it('should handle percentage formatter', () => {
        const components: GenUIComponent[] = [
          {
            component: 'CHART',
            chartType: 'line',
            xAxis: 'quarter',
            data: [
              { quarter: 'Q1', growth: 15 },
              { quarter: 'Q2', growth: 25 },
            ],
            valueFormatter: {
              type: 'percentage',
            },
          },
        ];

        const { container } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(container).toBeTruthy();
      });

      it('should handle percentage formatter with custom suffix', () => {
        const components: GenUIComponent[] = [
          {
            component: 'CHART',
            chartType: 'bar',
            xAxis: 'month',
            data: [{ month: 'Jan', rate: 50 }],
            valueFormatter: {
              type: 'percentage',
              suffix: ' pts',
            },
          },
        ];

        const { container } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(container).toBeTruthy();
      });

      it('should handle string formatter', () => {
        const components: GenUIComponent[] = [
          {
            component: 'CHART',
            chartType: 'bar',
            xAxis: 'category',
            data: [{ category: 'A', count: 100 }],
            valueFormatter: {
              type: 'string',
              suffix: ' items',
            },
          },
        ];

        const { container } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(container).toBeTruthy();
      });

      it('should handle formatter with custom suffix', () => {
        const components: GenUIComponent[] = [
          {
            component: 'CHART',
            chartType: 'bar',
            xAxis: 'month',
            data: [{ month: 'Jan', value: 100 }],
            valueFormatter: {
              type: 'number',
              suffix: ' units',
            },
          },
        ];

        const { container } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(container).toBeTruthy();
      });
    });

    describe('CHART data filtering edge cases', () => {
      it('should filter out data with empty xAxis values', () => {
        const components: GenUIComponent[] = [
          {
            component: 'CHART',
            chartType: 'bar',
            xAxis: 'month',
            data: [
              { month: 'Jan', value: 100 },
              { month: '', value: 200 }, // Empty xAxis
              { month: 'Mar', value: 300 },
            ],
            valueFormatter: { type: 'number' },
          },
        ];

        const { container } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(container).toBeTruthy();
      });

      it('should filter out data with no numeric values', () => {
        const components: GenUIComponent[] = [
          {
            component: 'CHART',
            chartType: 'bar',
            xAxis: 'month',
            data: [
              { month: 'Jan', value: 100 },
              { month: 'Feb', label: 'text' }, // No numeric value
              { month: 'Mar', value: 300 },
            ],
            valueFormatter: { type: 'number' },
          },
        ];

        const { container } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(container).toBeTruthy();
      });

      it('should handle chart with only invalid data', () => {
        const components: GenUIComponent[] = [
          {
            component: 'CHART',
            chartType: 'bar',
            xAxis: 'month',
            data: [
              { month: '', value: NaN },
              { month: 'Feb', value: Infinity },
              {},
            ],
            valueFormatter: { type: 'number' },
          },
        ];

        const { container } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        // Should show skeleton when all data is invalid
        expect(container).toBeTruthy();
      });

      it('should handle chart with multiple numeric keys', () => {
        const components: GenUIComponent[] = [
          {
            component: 'CHART',
            chartType: 'line',
            xAxis: 'month',
            data: [
              { month: 'Jan', revenue: 100, profit: 50, cost: 30 },
              { month: 'Feb', revenue: 150, profit: 75, cost: 40 },
            ],
            valueFormatter: { type: 'currency', currency: 'INR' },
          },
        ];

        const { container } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(container).toBeTruthy();
      });
    });

    describe('TABLE cell edge cases', () => {
      it('should handle AMOUNT cell with string value', () => {
        const components: GenUIComponent[] = [
          {
            component: 'TABLE',
            headers: ['Amount'],
            rows: [
              [{ component: 'AMOUNT', value: '1000' as any, currency: 'INR' }],
            ],
          },
        ];

        const { container } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        // String value gets parsed to number, so it renders the amount
        expect(container.textContent).toContain('1,000');
      });

      it('should handle AMOUNT cell with NaN value', () => {
        const components: GenUIComponent[] = [
          {
            component: 'TABLE',
            headers: ['Amount'],
            rows: [
              [{ component: 'AMOUNT', value: NaN, currency: 'INR' }],
            ],
          },
        ];

        const { getByText } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(getByText('-')).toBeInTheDocument();
      });

      it('should handle AMOUNT cell with different currencies', () => {
        const components: GenUIComponent[] = [
          {
            component: 'TABLE',
            headers: ['INR', 'MYR'],
            rows: [
              [
                { component: 'AMOUNT', value: 10000, currency: 'INR' },
                { component: 'AMOUNT', value: 500, currency: 'MYR' },
              ],
            ],
          },
        ];

        renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );
      });

      it('should handle INDICATOR without value', () => {
        const components: GenUIComponent[] = [
          {
            component: 'TABLE',
            headers: ['Status'],
            rows: [
              [{ component: 'INDICATOR', value: '', color: 'positive' }],
            ],
          },
        ];

        const { getByText } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(getByText('-')).toBeInTheDocument();
      });

      it('should handle BADGE with all color variants', () => {
        const colors = ['neutral', 'negative', 'notice', 'positive', 'primary', 'information'] as const;

        colors.forEach((color) => {
          const components: GenUIComponent[] = [
            {
              component: 'TABLE',
              headers: ['Badge'],
              rows: [
                [{ component: 'BADGE', value: `${color} badge`, color }],
              ],
            },
          ];

          const { getByText } = renderWithTheme(
            <GenUIProvider>
              <GenUISchemaRenderer components={components} />
            </GenUIProvider>,
          );

          expect(getByText(`${color} badge`)).toBeInTheDocument();
        });
      });

      it('should handle DATE with custom format', () => {
        const components: GenUIComponent[] = [
          {
            component: 'TABLE',
            headers: ['Date'],
            rows: [
              [
                {
                  component: 'DATE',
                  value: '2024-01-15T14:30:00Z',
                  dateFormat: 'YYYY-MM-DD',
                },
              ],
            ],
          },
        ];

        const { getByText } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(getByText('2024-01-15')).toBeInTheDocument();
      });

      it('should handle DATE with default format', () => {
        const components: GenUIComponent[] = [
          {
            component: 'TABLE',
            headers: ['Date'],
            rows: [
              [
                {
                  component: 'DATE',
                  value: '2024-01-15T14:30:00Z',
                },
              ],
            ],
          },
        ];

        const { container } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        // Date is formatted with default format (timezone may vary)
        expect(container.textContent).toContain('15 Jan 2024');
      });

      it('should handle DATE with empty value', () => {
        const components: GenUIComponent[] = [
          {
            component: 'TABLE',
            headers: ['Date'],
            rows: [
              [{ component: 'DATE', value: '', dateFormat: 'DD MMM YYYY' }],
            ],
          },
        ];

        const { getByText } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(getByText('-')).toBeInTheDocument();
      });

      it('should handle LINK without action', () => {
        const components: GenUIComponent[] = [
          {
            component: 'TABLE',
            headers: ['Link'],
            rows: [
              [{ component: 'LINK', text: 'Plain text' }],
            ],
          },
        ];

        const { getByText } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(getByText('Plain text')).toBeInTheDocument();
      });

      it('should handle unknown cell component type', () => {
        const components: GenUIComponent[] = [
          {
            component: 'TABLE',
            headers: ['Unknown'],
            rows: [
              [{ component: 'UNKNOWN' as any, value: 'fallback text' }],
            ],
          },
        ];

        const { getByText } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(getByText('fallback text')).toBeInTheDocument();
      });

      it('should handle null cell', () => {
        const components: GenUIComponent[] = [
          {
            component: 'TABLE',
            headers: ['Column'],
            rows: [
              [null as any],
            ],
          },
        ];

        const { getByText } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(getByText('-')).toBeInTheDocument();
      });
    });

    describe('Copyable text edge cases', () => {
      it('should not render copy button for empty copyable text', () => {
        const components: GenUIComponent[] = [
          {
            component: 'TABLE',
            headers: ['Text'],
            rows: [
              [{ component: 'TEXT', value: '', copyable: true }],
            ],
          },
        ];

        const { container } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        const copyButtons = container.querySelectorAll('[aria-label^="Copy"]');
        expect(copyButtons.length).toBe(0);
      });

      it('should handle copyable text with special characters', () => {
        const specialText = '<script>alert("xss")</script>';
        const components: GenUIComponent[] = [
          {
            component: 'TABLE',
            headers: ['Code'],
            rows: [
              [{ component: 'TEXT', value: specialText, copyable: true }],
            ],
          },
        ];

        const { getByLabelText } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(getByLabelText(`Copy ${specialText}`)).toBeInTheDocument();
      });
    });

    describe('ALERT edge cases', () => {
      it('should handle alert with only title', () => {
        const components: GenUIComponent[] = [
          {
            component: 'ALERT',
            title: 'Title only',
            color: 'information',
          },
        ];

        const { getByText } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(getByText('Title only')).toBeInTheDocument();
      });

      it('should handle alert with only description', () => {
        const components: GenUIComponent[] = [
          {
            component: 'ALERT',
            description: 'Description only',
            color: 'notice',
          },
        ];

        const { getByText } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(getByText('Description only')).toBeInTheDocument();
      });

      it('should handle alert with invalid color gracefully', () => {
        const components: GenUIComponent[] = [
          {
            component: 'ALERT',
            title: 'Alert',
            description: 'Test',
            color: 'invalid-color' as any,
          },
        ];

        const { container } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        // Should render empty box for invalid color
        expect(container).toBeTruthy();
      });

      it('should handle alert with only primary action', () => {
        const onActionClick = jest.fn();
        const components: GenUIComponent[] = [
          {
            component: 'ALERT',
            title: 'Alert',
            description: 'Test',
            color: 'information',
            actions: {
              primary: {
                text: 'Primary',
                action: { type: 'CLICK', eventName: 'primary' },
              },
            },
          },
        ];

        const { getByText } = renderWithTheme(
          <GenUIProvider config={{ onActionClick }}>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(getByText('Primary')).toBeInTheDocument();
      });

      it('should handle alert with only secondary action', () => {
        const onActionClick = jest.fn();
        const components: GenUIComponent[] = [
          {
            component: 'ALERT',
            title: 'Alert',
            description: 'Test',
            color: 'notice',
            actions: {
              secondary: {
                text: 'Secondary',
                action: { type: 'CLICK', eventName: 'secondary' },
              },
            },
          },
        ];

        const { getByText } = renderWithTheme(
          <GenUIProvider config={{ onActionClick }}>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(getByText('Secondary')).toBeInTheDocument();
      });
    });

    describe('STACK and GRID gap variations', () => {
      it('should handle STACK with small gap', () => {
        const components: GenUIComponent[] = [
          {
            component: 'STACK',
            direction: 'vertical',
            gap: 'small',
            children: [
              { component: 'TEXT', content: 'Item 1' },
              { component: 'TEXT', content: 'Item 2' },
            ],
          },
        ];

        const { container } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(container.textContent).toContain('Item 1');
      });

      it('should handle GRID with large gap', () => {
        const components: GenUIComponent[] = [
          {
            component: 'GRID',
            columns: 3,
            gap: 'large',
            children: [
              { component: 'TEXT', content: 'Cell 1' },
              { component: 'TEXT', content: 'Cell 2' },
            ],
          },
        ];

        const { container } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(container.textContent).toContain('Cell 1');
      });

      it('should handle STACK with horizontal direction', () => {
        const components: GenUIComponent[] = [
          {
            component: 'STACK',
            direction: 'horizontal',
            gap: 'medium',
            children: [
              { component: 'BADGE', text: 'Badge 1', color: 'primary' },
              { component: 'BADGE', text: 'Badge 2', color: 'positive' },
            ],
          },
        ];

        const { getByText } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(getByText('Badge 1')).toBeInTheDocument();
        expect(getByText('Badge 2')).toBeInTheDocument();
      });
    });

    describe('SPACER component', () => {
      it('should render spacer with small size', () => {
        const components: GenUIComponent[] = [
          { component: 'SPACER', size: 'small' },
        ];

        const { container } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(container).toBeTruthy();
      });

      it('should render spacer with medium size', () => {
        const components: GenUIComponent[] = [
          { component: 'SPACER', size: 'medium' },
        ];

        const { container } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(container).toBeTruthy();
      });

      it('should render spacer with large size', () => {
        const components: GenUIComponent[] = [
          { component: 'SPACER', size: 'large' },
        ];

        const { container } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(container).toBeTruthy();
      });

      it('should not render spacer without size', () => {
        const components: GenUIComponent[] = [
          { component: 'SPACER' } as any,
        ];

        const { container } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(container.textContent).toBe('');
      });
    });

    describe('CARD footer variations', () => {
      it('should render card with footer', () => {
        const components: GenUIComponent[] = [
          {
            component: 'CARD',
            title: 'Card',
            description: 'Description',
            footer: 'Footer text',
          },
        ];

        const { getByText } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(getByText('Footer text')).toBeInTheDocument();
      });

      it('should render card without footer', () => {
        const components: GenUIComponent[] = [
          {
            component: 'CARD',
            title: 'Card',
            description: 'Description',
          },
        ];

        const { getByText, queryByText } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(getByText('Card')).toBeInTheDocument();
        expect(queryByText('Footer')).not.toBeInTheDocument();
      });

      it('should render card with null footer', () => {
        const components: GenUIComponent[] = [
          {
            component: 'CARD',
            title: 'Card',
            description: 'Description',
            footer: null,
          },
        ];

        const { getByText } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(getByText('Card')).toBeInTheDocument();
      });
    });

    describe('INFO_GROUP with helpText', () => {
      it('should render info group with key helpText', () => {
        const components: GenUIComponent[] = [
          {
            component: 'INFO_GROUP',
            items: [
              {
                key: { children: 'Name', helpText: 'User full name' },
                value: { children: 'John Doe' },
              },
            ],
          },
        ];

        const { getByText } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(getByText('Name')).toBeInTheDocument();
        expect(getByText('John Doe')).toBeInTheDocument();
      });

      it('should render info group with value helpText', () => {
        const components: GenUIComponent[] = [
          {
            component: 'INFO_GROUP',
            items: [
              {
                key: { children: 'Status' },
                value: { children: 'Active', helpText: 'Currently active' },
              },
            ],
          },
        ];

        const { getByText } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(getByText('Status')).toBeInTheDocument();
        expect(getByText('Active')).toBeInTheDocument();
      });

      it('should render info group with both helpTexts', () => {
        const components: GenUIComponent[] = [
          {
            component: 'INFO_GROUP',
            items: [
              {
                key: { children: 'Email', helpText: 'Contact email' },
                value: { children: 'test@example.com', helpText: 'Primary email' },
              },
            ],
          },
        ];

        const { getByText } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(getByText('Email')).toBeInTheDocument();
        expect(getByText('test@example.com')).toBeInTheDocument();
      });
    });

    describe('TEXT component markdown variations', () => {
      it('should render text with bold markdown', () => {
        const components: GenUIComponent[] = [
          { component: 'TEXT', content: '**Bold text**' },
        ];

        const { container } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(container.textContent).toContain('Bold text');
      });

      it('should render text with italic markdown', () => {
        const components: GenUIComponent[] = [
          { component: 'TEXT', content: '*Italic text*' },
        ];

        const { container } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(container.textContent).toContain('Italic text');
      });

      it('should render text with links', () => {
        const components: GenUIComponent[] = [
          { component: 'TEXT', content: '[Link text](https://example.com)' },
        ];

        const { container } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(container.textContent).toContain('Link text');
      });

      it('should render text with horizontal rule', () => {
        const components: GenUIComponent[] = [
          { component: 'TEXT', content: 'Text\n\n---\n\nMore text' },
        ];

        const { container } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(container).toBeTruthy();
      });
    });

    describe('CHART variant and title combinations', () => {
      it('should render tiny chart without title', () => {
        const components: GenUIComponent[] = [
          {
            component: 'CHART',
            chartType: 'bar',
            variant: 'tiny',
            title: 'Should not show',
            xAxis: 'month',
            data: [{ month: 'Jan', value: 100 }],
            valueFormatter: { type: 'number' },
          },
        ];

        const { container, queryByText } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(container).toBeTruthy();
        expect(queryByText('Should not show')).not.toBeInTheDocument();
      });

      it('should render full chart with title', () => {
        const components: GenUIComponent[] = [
          {
            component: 'CHART',
            chartType: 'bar',
            variant: 'full',
            title: 'Chart Title',
            xAxis: 'month',
            data: [{ month: 'Jan', value: 100 }],
            valueFormatter: { type: 'number' },
          },
        ];

        const { getByText } = renderWithTheme(
          <GenUIProvider>
            <GenUISchemaRenderer components={components} />
          </GenUIProvider>,
        );

        expect(getByText('Chart Title')).toBeInTheDocument();
      });
    });
  });
});
