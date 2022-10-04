import React from 'react';
import { Code } from '../Code';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<Code />', () => {
  it('should render Code with default properties', () => {
    const { getByText, toJSON } = renderWithTheme(<Code>TEST_TOKEN</Code>);
    getByText('TEST_TOKEN');
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render large Code with different types', () => {
    const { getByText, toJSON } = renderWithTheme(<Code size="small">SMALL</Code>);
    const renderedCode = getByText('SMALL');
    expect(renderedCode).toHaveStyle({ fontSize: 12 });
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render medium Code with different types', () => {
    const { getByText, toJSON } = renderWithTheme(<Code size="medium">MEDIUM</Code>);
    const renderedCode = getByText('MEDIUM');
    expect(renderedCode).toHaveStyle({ fontSize: 15 });
    expect(toJSON()).toMatchSnapshot();
  });
});
