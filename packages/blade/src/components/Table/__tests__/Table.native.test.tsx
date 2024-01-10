/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { Table } from '../Table';
import type { TableProps } from '../types';
import { TableBody, TableRow, TableCell } from '../TableBody';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

const data: TableProps<{ name: string; id: string }>['data'] = {
  nodes: [
    {
      name: 'John Doe',
      id: '1',
    },
  ],
};

describe('Table', () => {
  it('renders proper information on unavailability of Table on native', () => {
    const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();

    const { getByText } = renderWithTheme(
      <Table data={data}>
        {(tableData) => (
          <TableBody>
            <TableRow item={tableData[0]}>
              <TableCell>Cell 1</TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>,
    );
    expect(getByText('Table Component is not available for Native mobile apps.')).toBeTruthy();
    expect(console.warn).toHaveBeenCalledWith(
      '[Blade: Table]: Table Component is not available for Native mobile apps.',
    );
    mockConsoleWarn.mockRestore();
  });
});
