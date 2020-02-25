import React from 'react';
import { render } from '@testing-library/react-native';
import { View } from 'react-native';

import Space from '../index';

describe('Renders <Space /> correctly', () => {
  it('should apply padding to child component', () => {
    const { container } = render(
      <Space padding={[1, 2]}>
        <View />
      </Space>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should apply margin to child component', () => {
    const { container } = render(
      <Space margin={[5, 5]}>
        <View />
      </Space>,
    );
    expect(container).toMatchSnapshot();
  });
});
