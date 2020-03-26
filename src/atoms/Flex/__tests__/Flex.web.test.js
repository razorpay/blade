import React from 'react';
import { render } from '@testing-library/react';

import View from '../../View';
import Flex from '../index';

describe('Renders <Flex /> correctly', () => {
  it('renders child of <Flex />(no styles) correctly', () => {
    const { container } = render(
      <Flex>
        <View />
      </Flex>,
    );
    expect(container).toMatchSnapshot();
  });
  it('renders an inline styled child of <Flex />(with styles) correctly', () => {
    const viewStyles = { backgroundColor: 'red', height: 100 };
    const { container } = render(
      <Flex flex={1} flexDirection="row">
        <View style={viewStyles} />
      </Flex>,
    );
    expect(container).toMatchSnapshot();
  });
  it('should throw error when more than one nodes are passed as children', () => {
    const expectedErrorMessage = 'Expected a single child for Space component';
    expect(() =>
      render(
        <Flex>
          <View />
          <View />
        </Flex>,
      ),
    ).toThrow(expectedErrorMessage);
  });
});
