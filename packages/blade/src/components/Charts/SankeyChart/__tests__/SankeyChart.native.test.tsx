/**
 * SankeyChart native tests
 *
 * Verifies that the native stub throws a Blade error when rendered,
 * since SankeyChart is a web-only component (Recharts/SVG-based).
 *
 * Run with: yarn test:native --testPathPattern=SankeyChart
 */
import React from 'react';
import { SankeyChart } from '../SankeyChart.native';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

const data = {
  nodes: [
    { id: 'a', name: 'A' },
    { id: 'b', name: 'B' },
  ],
  links: [{ source: 'a', target: 'b', value: 100 }],
};

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('SankeyChart (native)', () => {
  it('throws a Blade error when rendered on native', () => {
    expect(() => renderWithTheme(<SankeyChart data={data} />)).toThrow(
      '[Blade: SankeyChart]: SankeyChart is not yet implemented for native',
    );
  });
});
