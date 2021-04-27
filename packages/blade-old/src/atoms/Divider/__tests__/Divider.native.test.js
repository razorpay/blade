import React from 'react';
import Divider from '../index';
import { renderWithTheme } from '../../../_helpers/testing';

describe('<Divider />', () => {
  it('renders a horizontal Divider', () => {
    const { container } = renderWithTheme(<Divider />);
    expect(container).toMatchSnapshot();
  });

  it('renders a vertical Divider', () => {
    const { container } = renderWithTheme(<Divider direction="vertical" />);
    expect(container).toMatchSnapshot();
  });
});
