import React from 'react';
import { renderWithTheme } from '../../../_helpers/testing';
import View from '../../View';
import Size from '../index';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Size />', () => {
  it('renders a child by applying height, width, maxHeight, maxWidth, minWidth, minHeight', () => {
    const { container } = renderWithTheme(
      <Size
        height="100%"
        width="10px"
        maxHeight="20px"
        maxWidth="20px"
        minHeight="5px"
        minWidth="5px"
      >
        <View />
      </Size>,
    );
    expect(container).toMatchSnapshot();
  });
  it('renders a child component without any sizing properties being applied', () => {
    const { container } = renderWithTheme(
      <Size>
        <View testID="size-view" />
      </Size>,
    );
    expect(container).toMatchSnapshot();
  });

  describe('error', () => {
    it('should throw error when more than one nodes are passed as children', () => {
      const expectedErrorMessage = 'Expected a single child for Size component';
      expect(() =>
        renderWithTheme(
          <Size height="10px" width="10px">
            <View />
            <View />
          </Size>,
        ),
      ).toThrow(expectedErrorMessage);
    });
  });
});
