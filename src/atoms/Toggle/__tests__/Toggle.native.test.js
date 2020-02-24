import React from 'react';

import Toggle from '../index';
import { renderWithTheme } from '../../../_helpers/testing';

describe('Renders <Toggle /> correctly', () => {
  it('renders a default Toggle', () => {
    const { container } = renderWithTheme(<Toggle />);
    expect(container).toMatchSnapshot();
  });

  it('renders a disabled/OFF Toggle', () => {
    const { container } = renderWithTheme(<Toggle disabled />);
    expect(container).toMatchSnapshot();
  });

  it('renders a disabled/ON Toggle', () => {
    const { container } = renderWithTheme(<Toggle disabled value={true} />);
    expect(container).toMatchSnapshot();
  });

  it('renders a disabled/OFF Toggle', () => {
    const { container } = renderWithTheme(<Toggle disabled />);
    expect(container).toMatchSnapshot();
  });
});
