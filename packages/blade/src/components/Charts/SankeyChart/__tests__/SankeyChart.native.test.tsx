/**
 * SankeyChart native tests
 *
 * Verifies that the native stub throws a Blade error when rendered,
 * since SankeyChart is a web-only component (SVG + d3-sankey).
 *
 * Run with: yarn test:native --testPathPattern=SankeyChart
 */
import React from 'react';
import { SankeyChart } from '../SankeyChart.native';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

const levels = [
  { id: 'source', nodes: [{ id: 'a', name: 'A' }] },
  { id: 'target', nodes: [{ id: 'b', name: 'B' }] },
];
const links = [{ from: 'a', to: 'b', value: 100 }];

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('SankeyChart (native)', () => {
  it('throws a Blade error when rendered on native', () => {
    expect(() => renderWithTheme(<SankeyChart levels={levels} links={links} />)).toThrow(
      '[Blade: SankeyChart]: SankeyChart is not yet implemented for native',
    );
  });
});
