import React from 'react';
import { render } from '@testing-library/react';

import { renderWithTheme } from '../../../_helpers/testing';
import View from '../../View';
import Text from '../../Text';
import Space from '../../Space';
import Flex from '../index';

describe('<Flex />', () => {
  it('renders child by applying flex and space to it', () => {
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
  describe('flexDirection', () => {
    it('renders a child with flexDirection row', () => {
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
    it('renders an inline styled child with flex property', () => {
      const viewStyles = { backgroundColor: 'red', height: 100 };
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
