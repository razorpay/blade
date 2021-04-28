import React from 'react';
import { render } from '@testing-library/react';

import { renderWithTheme } from '../../../_helpers/testing';
import View from '../../View';
import Text from '../../Text';
import Space from '../../Space';
import Flex from '../index';

describe('<Flex />', () => {
  describe('components composition', () => {
    it('should render a child by applying flex and space properties', () => {
      const { container } = render(
        <Space>
          <Flex>
            <View>
              <View as="span">Flex Item #1</View>
              <View as="span">Flex Item #2</View>
            </View>
          </Flex>
        </Space>,
      );
      expect(container).toMatchSnapshot();
    });
  });
  describe('flexDirection', () => {
    it('should render a child with flexDirection row', () => {
      const { container } = renderWithTheme(
        <Flex flexDirection="row">
          <View>
            <Space>
              <Text>Flex Item #1</Text>
            </Space>
            <Space>
              <Text>Flex Item #2</Text>
            </Space>
          </View>
        </Flex>,
      );
      expect(container).toMatchSnapshot();
    });
  });
  describe('flex', () => {
    it('should render a an inline styled child with flex property', () => {
      const viewStyles = {
        backgroundColor: 'red',
        height: 100,
      };
      const { container } = renderWithTheme(
        <Flex flex={1}>
          <Space>
            <View style={viewStyles}>
              <Text size="large">Flex Item #1</Text>
              <Text size="large">Flex Item #2</Text>
            </View>
          </Space>
        </Flex>,
      );
      expect(container).toMatchSnapshot();
    });
  });
  describe('error', () => {
    beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
    afterAll(() => jest.restoreAllMocks());
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
