import React from 'react';
import { renderWithTheme } from '../../../_helpers/testing';

import Button from '../index';

describe('Renders <Button /> correctly', () => {
  it('snapshot testing', () => {
    const { container } = renderWithTheme(<Button onClick={() => {}}>{'Click Me'}</Button>);
    expect(container).toMatchSnapshot();
  });
});
