import React from 'react';
import { render } from '@testing-library/react-native';

import TextInput from '../index';

describe('Renders <TextInput /> correctly', () => {
  it('snapshot testing', () => {
    const { container } = render(<TextInput />);
    expect(container).toMatchSnapshot();
  });
});
