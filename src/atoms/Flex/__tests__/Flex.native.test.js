import React from 'react';
import { render } from '@testing-library/react-native';
import { View } from 'react-native';
import Flex from '../index';

describe('Renders <Flex /> correctly', () => {
  it('snapshot testing', () => {
    const { container } = render(
      <Flex>
        <View />
      </Flex>,
    );
    expect(container).toMatchSnapshot();
  });
});
