import React from 'react';
import { render } from '@testing-library/react-native';
import View from '../../View';

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

  it('should throw error when more than one nodes are passed as children', () => {
    const expectedErrorMessage = 'Expected a single child for Space component';
    try {
      render(
        <Space margin={[5, 5]}>
          <View />
          <View />
        </Space>,
      );
    } catch (e) {
      expect(typeof e).toEqual('object');
      expect(e.name).toEqual('Error');
      expect(e.message).toEqual(expectedErrorMessage);
    }
  });
});
