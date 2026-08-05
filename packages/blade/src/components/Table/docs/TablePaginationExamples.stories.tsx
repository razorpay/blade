import React from 'react';
import type { Meta } from '@storybook/react-vite';
import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableToolbar,
  TableToolbarActions,
  TablePagination,
} from '../../Table';
import type { TableData } from '../types';
import { createTableData, formatDate, getStatusColor } from './exampleData';
import { Box } from '~components/Box';
import { Code, Heading, Text } from '~components/Typography';
import { Amount } from '~components/Amount';
import { Badge } from '~components/Badge';
import { Button } from '~components/Button';
import { useTheme } from '~components/BladeProvider';

const TableMeta: Meta = {
  title: 'Components/Table/Examples/Pagination',
  component: Table,
  parameters: {
    viewMode: 'story',
    options: {
      showPanel: false,
    },
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true,
      },
    },
    chromatic: { disableSnapshot: true },
  },
};

const clientSidePaginationTableData = createTableData(100);

export const TableWithClientSidePagination = (): React.ReactElement => {
  const { platform } = useTheme();
  const onMobile = platform === 'onMobile';

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Table with Client Side Pagination</Heading>
        <Text>
          (Tip: Expand the window width. It shows a minimalistic version of pagination on mWeb and a
          full fledged version on dWeb.)
        </Text>
      </Box>
      <Table
        data={clientSidePaginationTableData}
        selectionType="multiple"
        showStripedRows={true}
        toolbar={
          <TableToolbar>
            <TableToolbarActions>
              <Button variant="secondary" marginRight="spacing.3" isFullWidth={onMobile}>
                Export
              </Button>
              <Button isFullWidth={onMobile}>Refund</Button>
            </TableToolbarActions>
          </TableToolbar>
        }
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
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow key={index} item={tableItem}>
                  <TableCell>
                    <Code size="medium">{tableItem.paymentId}</Code>
                  </TableCell>
                  <TableCell>{formatDate(tableItem.date)}</TableCell>
                  <TableCell>
                    <Badge size="medium" color={getStatusColor(tableItem.status)}>
                      {tableItem.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Amount value={tableItem.amount} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>
    </Box>
  );
};

type Character = {
  id: number;
  name: string;
  species: string;
  status: string;
  origin: { name: string };
};

type CharacterAPIResult = {
  info: { count: number };
  results: Character[];
};

const fetchCharacters = async ({ page }: { page: number }): Promise<CharacterAPIResult> => {
  const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`, {
    method: 'GET',
    redirect: 'follow',
  });
  return (await response.json()) as CharacterAPIResult;
};

export const TableWithServerSidePagination = (): React.ReactElement => {
  const [apiData, setApiData] = React.useState<TableData<Character>>({ nodes: [] });
  const [dataCount, setDataCount] = React.useState(0);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // The rick & morty api always returns 20 items per page and that is not configurable. We slice the
  // response to 10 items (and halve the count) to simulate an API with `limit` & `offset` support.
  const loadPage = React.useCallback((page: number) => {
    return fetchCharacters({ page }).then((result) => {
      setApiData({ nodes: result.results.slice(0, 10) });
      setDataCount(result.info.count / 2);
    });
  }, []);

  React.useEffect(() => {
    void loadPage(1);
  }, [loadPage]);

  const handlePageChange = ({ page }: { page: number }): void => {
    setIsRefreshing(true);
    void loadPage(page + 1).finally(() => setIsRefreshing(false));
  };

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Table with Server Side Pagination</Heading>
      </Box>
      <Table
        data={apiData}
        isRefreshing={isRefreshing}
        pagination={
          <TablePagination
            showPageNumberSelector={true}
            showPageSizePicker={false}
            paginationType="server"
            onPageChange={handlePageChange}
            totalItemCount={dataCount}
          />
        }
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Origin</TableHeaderCell>
                <TableHeaderCell>Species</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow key={index} item={tableItem}>
                  <TableCell>{tableItem.name}</TableCell>
                  <TableCell>{tableItem.origin.name}</TableCell>
                  <TableCell>{tableItem.species}</TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>
    </Box>
  );
};

export default TableMeta;
