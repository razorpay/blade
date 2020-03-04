import React from 'react';
import { renderWithTheme } from '../../../_helpers/testing';

import Text from '../index';

describe('Renders Text', () => {
  it('snapshot testing', () => {
    const { container } = renderWithTheme(<Text>{'simple text'}</Text>);
    expect(container).toMatchSnapshot();
  });
});
