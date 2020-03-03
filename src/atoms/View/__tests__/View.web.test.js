import React from 'react';
import { render } from '@testing-library/react';

import View from '../index';

describe('Renders <View /> correctly', () => {
  it('snapshot testing', () => {
    const { container } = render(<View>{'simple div'}</View>);
    expect(container).toMatchSnapshot();
  });
});
