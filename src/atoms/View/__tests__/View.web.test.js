import React from 'react';
import { renderWithTheme } from '../../../_helpers/testing-web';

import View from '../index';

describe('Renders <View /> correctly', () => {
  it('snapshot testing', () => {
    const { container } = renderWithTheme(<View>{'simple div'}</View>);
    expect(container).toMatchSnapshot();
  });
});
