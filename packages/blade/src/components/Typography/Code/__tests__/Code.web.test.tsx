import React from 'react';
import { Code } from '../Code';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<Code />', () => {
  it('should render Code with default properties', () => {
    const { container, getByText } = renderWithTheme(<Code>TEST_TOKEN</Code>);
    expect(getByText('TEST_TOKEN')).toHaveStyle('font-size: 0.75rem');
    expect(container.querySelector('span')).toHaveStyle('padding: 0px 4px');
    expect(container).toMatchSnapshot();
  });

  it('should render small Code with different types', () => {
    const { container, getByText } = renderWithTheme(<Code size="small">SMALL</Code>);
    expect(getByText('SMALL')).toHaveStyle('font-size: 0.75rem');
    expect(container.querySelector('span')).toHaveStyle('padding: 0px 4px');
    expect(container).toMatchSnapshot();
  });

  it('should render medium Code with different types', () => {
    const { container, getByText } = renderWithTheme(<Code size="medium">MEDIUM</Code>);
    expect(getByText('MEDIUM')).toHaveStyle('font-size: 0.875rem');
    expect(container.querySelector('span')).toHaveStyle('padding: 0px 4px');
    expect(container).toMatchSnapshot();
  });
});
