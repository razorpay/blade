import React from 'react';
import { render } from '@testing-library/react';

import View from '../../View';
import Flex from '../index';

describe('<Flex />', () => {
  describe('flexDirection', () => {
    it('renders a child with flexDirection attribute and flex properties correctly', () => {
      const { container } = render(
        <Flex flexDirection="row">
          <View />
        </Flex>,
      );
      expect(container).toMatchSnapshot();
    });
  });
  describe('flex', () => {
    it('renders an inline styled child with flex attribute and flex properties correctly', () => {
      const viewStyles = { backgroundColor: 'red', height: 100 };
      const { container } = render(
        <Flex flex={1}>
          <View style={viewStyles} />
        </Flex>,
      );
      expect(container).toMatchSnapshot();
    });
  });
  describe('error', () => {
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
});
