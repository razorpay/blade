import React from 'react';
import { render } from '@testing-library/react-native';

import Icon from '../index';

describe('Renders <Icon /> correctly', () => {
  it('snapshot testing', () => {
    const { container } = render(<Icon name="info">{'Click Me'}</Icon>);
    expect(container).toMatchSnapshot();
  });
});
