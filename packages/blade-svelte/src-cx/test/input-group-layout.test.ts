import { describe, it, expect } from 'vitest';
import { placeMembers } from '../runes/input-group/layout';

const held = (corners: Record<string, boolean>): string =>
  Object.keys(corners)
    .filter((corner) => corners[corner])
    .join(' ');

describe('placeMembers', () => {
  it('one member holds every corner; none hold none', () => {
    expect(placeMembers(['full']).map(held)).toEqual(['tl tr bl br']);
    expect(placeMembers([])).toEqual([]);
  });

  it('gives the top corners to the first row and the bottom ones to the last', () => {
    expect(placeMembers(['full', '2/3', '1/3']).map(held)).toEqual(['tl tr', 'bl', 'br']);
    expect(placeMembers(['1/2', '1/2', '1/2', '1/2']).map(held)).toEqual(['tl', 'tr', 'bl', 'br']);
    expect(placeMembers(['1/4', '3/4']).map(held)).toEqual(['tl bl', 'tr br']);
  });

  it('a member that does not fit the rest of its row starts the next, as the grid does', () => {
    expect(placeMembers(['2/3', 'full']).map(held)).toEqual(['tl tr', 'bl br']);
    expect(placeMembers(['1/2', '2/3', '1/3']).map(held)).toEqual(['tl tr', 'bl', 'br']);
  });

  it('a short last row still takes the bottom corners', () => {
    expect(placeMembers(['full', '1/2']).map(held)).toEqual(['tl tr', 'bl br']);
  });
});
