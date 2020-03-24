import React from 'react';
import { renderWithTheme } from '../../../_helpers/testing';

import View from '../index';

describe('Renders with text ', () => {
  it('snapshot testing', () => {
    const { container } = renderWithTheme(<View>{'simple div'}</View>);
    expect(container).toMatchSnapshot();
  });
});
