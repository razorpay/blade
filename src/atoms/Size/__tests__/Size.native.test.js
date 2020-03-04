import React from 'react';
import { render } from '@testing-library/react-native';
import { View } from 'react-native';
import Size from '../index';

describe('Renders <Size /> correctly', () => {
  it('snapshot testing', () => {
    const { container } = render(
      <Size>
        <View />
      </Size>,
    );
    expect(container).toMatchSnapshot();
  });
});
