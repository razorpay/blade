import React from 'react';
import { Code } from '../Code';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<Code />', () => {
  it('should render Code with default properties', () => {
    const { container } = renderWithTheme(<Code>TEST_TOKEN</Code>);
    expect(container).toMatchSnapshot();
  });

  it('should render small Code with different types', () => {
    const { container } = renderWithTheme(<Code size="small">SMALL</Code>);
    expect(container).toMatchSnapshot();
  });

  it('should render medium Code with different types', () => {
    const { container } = renderWithTheme(<Code size="medium">MEDIUM</Code>);
    expect(container).toMatchSnapshot();
  });
});
