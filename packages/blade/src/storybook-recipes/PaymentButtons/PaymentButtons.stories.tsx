/**
 * App/PaymentButtons — Payment Buttons List Page
 *
 * Demonstrates a real-world "Payment Buttons" list view migrated from a raw
 * Table-with-manual-filters approach to the Blade ListView + ListViewFilters
 * (EntityListViewFilter) pattern.
 *
 * References:
 *   - ListView pattern: packages/blade/src/components/ListView/docs/ListView.stories.tsx
 *   - ListViewFigmaExample: packages/blade/src/components/ListView/docs/ListViewFigmaExample.stories.tsx
 */

import type { Meta, StoryFn } from '@storybook/react';
import React, { useState } from 'react';
import { ListView } from '~components/ListView/ListView';
import { ListViewFilters } from '~components/ListView/ListViewFilters';
import type { TableData } from '~components/Table/types';
import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TableFooterRow,
  TableFooterCell,
  TablePagination,
} from '~components/Table';
import { QuickFilter, QuickFilterGroup } from '~components/QuickFilters';
import { Counter } from '~components/Counter';
import {
  FilterChipGroup,
  FilterChipSelectInput,
  Dropdown,
  DropdownOverlay,
} from '~components/Dropdown';
import { ActionList, ActionListItem } from '~components/ActionList';
import type { DatesRangeValue } from '~components/DatePicker';
import { FilterChipDatePicker } from '~components/DatePicker';
import { Box } from '~components/Box';
import { Badge } from '~components/Badge';
import { Code } from '~components/Typography/Code';
import { Link } from '~components/Link';
import { Button } from '~components/Button';
import { IconButton } from '~components/Button/IconButton';
import { ButtonGroup } from '~components/ButtonGroup';
import { Tooltip } from '~components/Tooltip';
import { SearchInput } from '~components/Input/SearchInput';
import { DownloadIcon, CopyIcon, TrashIcon, ExternalLinkIcon } from '~components/Icons';
import { BaseBox } from '~components/Box/BaseBox';
import { Text } from '~components/Typography';

// ─── Types ────────────────────────────────────────────────────────────────────

type ButtonType = 'checkout' | 'subscription' | 'donation';
type ButtonStatus = 'active' | 'inactive' | 'expired';

type PaymentButtonItem = {
  id: string;
  buttonId: string;
  name: string;
  type: ButtonType;
  status: ButtonStatus;
  amount: number;
  currency: string;
  clicks: number;
  createdAt: Date;
};

// ─── Static Data ──────────────────────────────────────────────────────────────

const BUTTON_TYPES: { key: ButtonType; title: string }[] = [
  { key: 'checkout', title: 'Checkout' },
  { key: 'subscription', title: 'Subscription' },
  { key: 'donation', title: 'Donation' },
];

const BUTTON_STATUSES: ButtonStatus[] = ['active', 'inactive', 'expired'];
const QUICK_FILTER_STATUSES = ['All', 'Active', 'Inactive', 'Expired'];
const FILTER_CHIP_STATUSES = ['Active', 'Inactive', 'Expired'];

const NAMES = [
  'Buy Now – Pro Plan',
  'Monthly Subscription',
  'Annual Membership',
  'Donate to NGO',
  'One-time Setup Fee',
  'Enterprise License',
  'Starter Pack',
  'Premium Support',
  'Course Enrollment',
  'Yearly SaaS Plan',
];

const allNodes: PaymentButtonItem[] = Array.from({ length: 30 }, (_, i) => ({
  id: String(i + 1),
  buttonId: `btn_${Math.random().toString(36).slice(2, 10)}`,
  name: NAMES[i % NAMES.length],
  type: BUTTON_TYPES[i % BUTTON_TYPES.length].key,
  status: BUTTON_STATUSES[i % BUTTON_STATUSES.length],
  amount: Number((Math.random() * 50000 + 500).toFixed(2)),
  currency: 'INR',
  clicks: Math.floor(Math.random() * 5000),
  createdAt: new Date(
    2025,
    Math.floor(Math.random() * 12),
    Math.floor(Math.random() * 28) + 1,
  ),
}));

const allData: TableData<PaymentButtonItem> = { nodes: allNodes };

// ─── Filter Helpers ────────────────────────────────────────────────────────────

const filterByStatus = (
  data: TableData<PaymentButtonItem>,
  status?: string,
): TableData<PaymentButtonItem> => {
  if (!status || status === 'All') return data;
  return { nodes: data.nodes.filter((n) => n.status === status.toLowerCase()) };
};

const filterBySearch = (
  data: TableData<PaymentButtonItem>,
  query?: string,
): TableData<PaymentButtonItem> => {
  if (!query) return data;
  const q = query.toLowerCase();
  return { nodes: data.nodes.filter((n) => n.name.toLowerCase().includes(q) || n.buttonId.includes(q)) };
};

const filterByType = (
  data: TableData<PaymentButtonItem>,
  type?: string,
): TableData<PaymentButtonItem> => {
  if (!type) return data;
  return { nodes: data.nodes.filter((n) => n.type === type) };
};

const filterByDateRange = (
  data: TableData<PaymentButtonItem>,
  range?: DatesRangeValue,
): TableData<PaymentButtonItem> => {
  if (!range?.[0]) return data;
  return {
    nodes: data.nodes.filter((n) => {
      if (!range[0] || !range[1]) return false;
      return n.createdAt >= range[0] && n.createdAt <= range[1];
    }),
  };
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: ButtonStatus }): React.ReactElement => {
  const colorMap: Record<ButtonStatus, 'positive' | 'neutral' | 'negative'> = {
    active: 'positive',
    inactive: 'neutral',
    expired: 'negative',
  };
  return (
    <Badge size="xsmall" color={colorMap[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

// ─── Main Story Component ──────────────────────────────────────────────────────

const PaymentButtonsListView = (): React.ReactElement => {
  const [tableData, setTableData] = useState<TableData<PaymentButtonItem>>(allData);
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<string>('All');
  const [searchValue, setSearchValue] = useState<string | undefined>('');
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<DatesRangeValue | undefined>(undefined);

  // Re-apply all active filters chained together
  const applyFilters = ({
    quickFilter = selectedQuickFilter,
    search = searchValue,
    type = typeFilter,
    range = dateRange,
  }: {
    quickFilter?: string;
    search?: string;
    type?: string | undefined;
    range?: DatesRangeValue | undefined;
  }): void => {
    let result = allData;
    result = filterByStatus(result, quickFilter);
    result = filterBySearch(result, search);
    result = filterByType(result, type);
    result = filterByDateRange(result, range);
    setTableData(result);
  };

  const getCountForStatus = (status: string): number => {
    if (status === 'All') return allNodes.length;
    return allNodes.filter((n) => n.status === status.toLowerCase()).length;
  };

  const activeFilterCount =
    (typeFilter ? 1 : 0) +
    (Array.isArray(dateRange) && dateRange[0] ? 1 : 0) +
    (selectedQuickFilter !== 'All' ? 1 : 0);

  return (
    <BaseBox
      backgroundColor="surface.background.gray.moderate"
      padding="spacing.8"
      minHeight="600px"
    >
      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="spacing.6"
      >
        <Text size="large" weight="semibold">
          Payment Buttons
        </Text>
        <Button icon={ExternalLinkIcon} iconPosition="right" size="medium">
          Create Button
        </Button>
      </Box>

      {/* ── ListView with ListViewFilters (EntityListViewFilter pattern) ──── */}
      <ListView>
        <ListViewFilters
          quickFilters={
            <QuickFilterGroup
              selectionType="single"
              value={selectedQuickFilter}
              defaultValue="All"
              onChange={({ values }) => {
                const qf = values[0];
                setSelectedQuickFilter(qf);
                applyFilters({ quickFilter: qf });
              }}
            >
              {QUICK_FILTER_STATUSES.map((status) => (
                <QuickFilter
                  key={status}
                  title={status}
                  value={status}
                  trailing={
                    <Counter value={getCountForStatus(status)} color="neutral" />
                  }
                />
              ))}
            </QuickFilterGroup>
          }
          selectedFiltersCount={activeFilterCount}
          actions={
            <Box display="flex" gap="spacing.4" alignItems="center">
              <Box width="220px">
                <SearchInput
                  label=""
                  value={searchValue}
                  placeholder="Search by name or button ID"
                  onChange={({ value }) => {
                    setSearchValue(value);
                    applyFilters({ search: value });
                  }}
                  onClearButtonClick={() => {
                    setSearchValue('');
                    applyFilters({ search: '' });
                  }}
                />
              </Box>
              <ButtonGroup variant="tertiary">
                <Tooltip content="Download CSV">
                  <Button icon={DownloadIcon} />
                </Tooltip>
              </ButtonGroup>
            </Box>
          }
        >
          {/* Filter Chips Row */}
          <FilterChipGroup
            onClearButtonClick={() => {
              setTypeFilter(undefined);
              setDateRange(undefined);
              setSelectedQuickFilter('All');
              setTableData(filterBySearch(allData, searchValue));
            }}
          >
            {/* Button Type filter */}
            <Dropdown selectionType="single">
              <FilterChipSelectInput
                label="Type"
                onChange={({ values }) => {
                  const t = values[0];
                  setTypeFilter(t);
                  applyFilters({ type: t });
                }}
              />
              <DropdownOverlay>
                <ActionList>
                  {BUTTON_TYPES.map((bt) => (
                    <ActionListItem key={bt.key} title={bt.title} value={bt.key} />
                  ))}
                </ActionList>
              </DropdownOverlay>
            </Dropdown>

            {/* Created Date Range filter */}
            <FilterChipDatePicker
              label="Created Date"
              selectionType="range"
              onChange={(value) => {
                const range = Array.isArray(value) ? (value as DatesRangeValue) : undefined;
                setDateRange(range);
                applyFilters({ range });
              }}
            />

            {/* Status filter chip — mirrors quick filter selection */}
            <Dropdown selectionType="single">
              <FilterChipSelectInput
                label="Status"
                value={selectedQuickFilter !== 'All' ? selectedQuickFilter : undefined}
                onChange={({ values }) => {
                  const v = values[0] ?? 'All';
                  setSelectedQuickFilter(v);
                  applyFilters({ quickFilter: v });
                }}
                onClearButtonClick={() => {
                  setSelectedQuickFilter('All');
                  applyFilters({ quickFilter: 'All' });
                }}
              />
              <DropdownOverlay>
                <ActionList>
                  {FILTER_CHIP_STATUSES.map((s) => (
                    <ActionListItem
                      key={s}
                      title={s}
                      value={s}
                      isSelected={selectedQuickFilter === s}
                    />
                  ))}
                </ActionList>
              </DropdownOverlay>
            </Dropdown>
          </FilterChipGroup>
        </ListViewFilters>

        {/* ── Table ──────────────────────────────────────────────────────── */}
        <Table
          data={tableData}
          rowDensity="compact"
          isFirstColumnSticky
          pagination={
            <TablePagination
              onPageChange={console.log}
              defaultPageSize={10}
              onPageSizeChange={console.log}
              showPageSizePicker
              showPageNumberSelector
            />
          }
        >
          {(rows) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell headerKey="BUTTON_ID">Button ID</TableHeaderCell>
                  <TableHeaderCell headerKey="NAME">Name</TableHeaderCell>
                  <TableHeaderCell headerKey="TYPE">Type</TableHeaderCell>
                  <TableHeaderCell headerKey="AMOUNT">Amount</TableHeaderCell>
                  <TableHeaderCell headerKey="CLICKS">Clicks</TableHeaderCell>
                  <TableHeaderCell headerKey="CREATED_AT">Created</TableHeaderCell>
                  <TableHeaderCell headerKey="STATUS">Status</TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>

              <TableBody>
                {rows.map((item, index) => (
                  <TableRow
                    key={index}
                    item={item}
                    hoverActions={
                      <>
                        <Button variant="tertiary" size="xsmall">
                          View
                        </Button>
                        <Tooltip content="Copy embed code">
                          <IconButton
                            icon={CopyIcon}
                            isHighlighted
                            accessibilityLabel="Copy embed code"
                          />
                        </Tooltip>
                        <Tooltip content="Delete">
                          <IconButton
                            icon={TrashIcon}
                            isHighlighted
                            accessibilityLabel="Delete payment button"
                          />
                        </Tooltip>
                      </>
                    }
                  >
                    <TableCell>
                      <Code size="small">{item.buttonId}</Code>
                    </TableCell>
                    <TableCell>
                      <Link size="small" color="neutral" href="/" target="_blank">
                        {item.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {BUTTON_TYPES.find((bt) => bt.key === item.type)?.title ?? item.type}
                    </TableCell>
                    <TableCell>
                      ₹{item.amount.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell>{item.clicks.toLocaleString()}</TableCell>
                    <TableCell>
                      {item.createdAt.toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={item.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

              <TableFooter>
                <TableFooterRow>
                  <TableFooterCell>Total</TableFooterCell>
                  <TableFooterCell>—</TableFooterCell>
                  <TableFooterCell>—</TableFooterCell>
                  <TableFooterCell>
                    ₹
                    {rows
                      .reduce((sum, r) => sum + r.amount, 0)
                      .toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </TableFooterCell>
                  <TableFooterCell>
                    {rows.reduce((sum, r) => sum + r.clicks, 0).toLocaleString()}
                  </TableFooterCell>
                  <TableFooterCell>—</TableFooterCell>
                  <TableFooterCell>—</TableFooterCell>
                </TableFooterRow>
              </TableFooter>
            </>
          )}
        </Table>
      </ListView>
    </BaseBox>
  );
};

// ─── Storybook Meta & Export ───────────────────────────────────────────────────

export default {
  title: 'App/PaymentButtons',
  component: PaymentButtonsListView,
  parameters: {
    viewMode: 'story',
    options: { showPanel: false },
    previewTabs: {
      'storybook/docs/panel': { hidden: true },
    },
    chromatic: { disableSnapshot: true },
  },
} as Meta;

export const PaymentButtonsList: StoryFn = () => <PaymentButtonsListView />;
PaymentButtonsList.storyName = 'Payment Buttons List';
