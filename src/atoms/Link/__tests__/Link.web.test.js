import React from 'react';
import Link from '../index';
import { renderWithTheme } from '../../../_helpers/testing';

describe('<Link />', () => {
  it('renders a link', () => {
    const displayText = 'Displaying some link';
    const { container } = renderWithTheme(<Link>{displayText}</Link>);
    expect(container).toMatchSnapshot();
  });

  it('renders a component by applying small', () => {
    const displayText = 'Displaying some link';
    const { container } = renderWithTheme(<Link size="small">{displayText}</Link>);
    expect(container).toMatchSnapshot();
  });

  it('renders a component by applying medium', () => {
    const displayText = 'Displaying some link';
    const { container } = renderWithTheme(<Link size="medium">{displayText}</Link>);
    expect(container).toMatchSnapshot();
  });

  it('renders a component by applying large', () => {
    const displayText = 'Displaying some link';
    const { container } = renderWithTheme(<Link size="large">{displayText}</Link>);
    expect(container).toMatchSnapshot();
  });
});
