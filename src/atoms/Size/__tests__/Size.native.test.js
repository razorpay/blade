import React from 'react';
import { render } from '@testing-library/react-native';
import View from '../../View';
import Size from '../index';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('Renders <Size /> correctly', () => {
  it('should apply all specified props to child component', () => {
    const { container } = render(
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

  it('should throw error when more than one nodes are passed as children', () => {
    const expectedErrorMessage = 'Expected a single child for Size component';
    expect(() =>
      render(
        <Size height="10px" width="10px">
          <View />
          <View />
        </Size>,
      ),
    ).toThrow(expectedErrorMessage);
  });
});
