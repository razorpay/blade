/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { ListViewSkeleton } from '../ListViewSkeleton';
import { ListView } from '../ListView.web';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ListViewSkeleton />', () => {
  // ── Rendering ──────────────────────────────────────────────────────────

  it('renders without crashing with default props', () => {
    const { getByTestId } = renderWithTheme(<ListViewSkeleton />);
    expect(getByTestId('list-view-skeleton')).toBeInTheDocument();
  });

  it('renders filter bar by default', () => {
    const { getByTestId } = renderWithTheme(<ListViewSkeleton />);
    expect(getByTestId('list-view-skeleton-filters')).toBeInTheDocument();
  });

  it('renders table header by default', () => {
    const { getByTestId } = renderWithTheme(<ListViewSkeleton />);
    expect(getByTestId('list-view-skeleton-header')).toBeInTheDocument();
  });

  it('renders pagination bar by default', () => {
    const { getByTestId } = renderWithTheme(<ListViewSkeleton />);
    expect(getByTestId('list-view-skeleton-pagination')).toBeInTheDocument();
  });

  // ── rows prop ───────────────────────────────────────────────────────────

  it('renders 7 rows by default', () => {
    const { getAllByTestId } = renderWithTheme(<ListViewSkeleton />);
    expect(getAllByTestId(/^list-view-skeleton-row-\d+$/)).toHaveLength(7);
  });

  it('renders correct number of rows when rows=3', () => {
    const { getAllByTestId } = renderWithTheme(<ListViewSkeleton rows={3} />);
    expect(getAllByTestId(/^list-view-skeleton-row-\d+$/)).toHaveLength(3);
  });

  it('renders correct number of rows when rows=1', () => {
    const { getByTestId } = renderWithTheme(<ListViewSkeleton rows={1} />);
    expect(getByTestId('list-view-skeleton-row-0')).toBeInTheDocument();
  });

  // ── columns — context-driven (inside ListView) ──────────────────────────

  it('inherits columns from ListView context when no columns prop is given', () => {
    const { getAllByTestId } = renderWithTheme(
      <ListView columns={3}>
        <ListViewSkeleton rows={1} showFilters={false} showPagination={false} />
      </ListView>,
    );
    // 1 header row + 1 data row = 2 rows total, each with 3 skeleton cells
    const headerCells = getAllByTestId('list-view-skeleton-header')[0].querySelectorAll(
      '[data-blade-component="skeleton"]',
    );
    expect(headerCells).toHaveLength(3);
  });

  it('explicit columns prop overrides ListView context', () => {
    const { getAllByTestId } = renderWithTheme(
      <ListView columns={3}>
        <ListViewSkeleton rows={1} columns={2} showFilters={false} showPagination={false} />
      </ListView>,
    );
    const headerCells = getAllByTestId('list-view-skeleton-header')[0].querySelectorAll(
      '[data-blade-component="skeleton"]',
    );
    expect(headerCells).toHaveLength(2);
  });

  it('falls back to default 5 columns when outside ListView and no columns prop', () => {
    const { getByTestId } = renderWithTheme(
      <ListViewSkeleton rows={1} showFilters={false} showPagination={false} />,
    );
    const headerCells = getByTestId('list-view-skeleton-header').querySelectorAll(
      '[data-blade-component="skeleton"]',
    );
    expect(headerCells).toHaveLength(5);
  });

  // ── showFilters prop ────────────────────────────────────────────────────

  it('hides filter bar when showFilters=false', () => {
    const { queryByTestId } = renderWithTheme(<ListViewSkeleton showFilters={false} />);
    expect(queryByTestId('list-view-skeleton-filters')).not.toBeInTheDocument();
  });

  it('shows filter bar when showFilters=true', () => {
    const { getByTestId } = renderWithTheme(<ListViewSkeleton showFilters={true} />);
    expect(getByTestId('list-view-skeleton-filters')).toBeInTheDocument();
  });

  // ── showPagination prop ─────────────────────────────────────────────────

  it('hides pagination when showPagination=false', () => {
    const { queryByTestId } = renderWithTheme(<ListViewSkeleton showPagination={false} />);
    expect(queryByTestId('list-view-skeleton-pagination')).not.toBeInTheDocument();
  });

  it('shows pagination when showPagination=true', () => {
    const { getByTestId } = renderWithTheme(<ListViewSkeleton showPagination={true} />);
    expect(getByTestId('list-view-skeleton-pagination')).toBeInTheDocument();
  });

  // ── Combined props ──────────────────────────────────────────────────────

  it('renders only table when showFilters and showPagination are false', () => {
    const { queryByTestId, getByTestId } = renderWithTheme(
      <ListViewSkeleton showFilters={false} showPagination={false} />,
    );
    expect(queryByTestId('list-view-skeleton-filters')).not.toBeInTheDocument();
    expect(queryByTestId('list-view-skeleton-pagination')).not.toBeInTheDocument();
    expect(getByTestId('list-view-skeleton-header')).toBeInTheDocument();
    expect(getByTestId('list-view-skeleton-rows')).toBeInTheDocument();
  });

  it('renders correct rows with non-default rows and columns props', () => {
    const { getAllByTestId } = renderWithTheme(<ListViewSkeleton rows={5} columns={3} />);
    expect(getAllByTestId(/^list-view-skeleton-row-\d+$/)).toHaveLength(5);
  });

  // ── Snapshots ───────────────────────────────────────────────────────────

  it('matches snapshot with default props', () => {
    const { container } = renderWithTheme(<ListViewSkeleton />);
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot inside ListView with columns from context', () => {
    const { container } = renderWithTheme(
      <ListView columns={3}>
        <ListViewSkeleton showFilters={false} showPagination={false} rows={2} />
      </ListView>,
    );
    expect(container).toMatchSnapshot();
  });
});
