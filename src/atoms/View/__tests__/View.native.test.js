import React from 'react';
import { render } from '@testing-library/react-native';
import View from '../index';

describe('<View />', () => {
  test('should match snapshot for View', () => {
    const { container } = render(<View />);
    expect(container).toMatchSnapshot();
  });
});
