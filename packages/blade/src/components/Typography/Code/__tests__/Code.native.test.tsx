import React from 'react';
import { Code } from '../Code';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<Code />', () => {
  it('should render Code with default properties', () => {
    const { getByText, toJSON } = renderWithTheme(<Code>TEST_TOKEN</Code>);
    expect(getByText('TEST_TOKEN')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render large Code with different types', () => {
    const { toJSON } = renderWithTheme(<Code size="small">SMALL</Code>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render medium Code with different types', () => {
    const { toJSON } = renderWithTheme(<Code size="medium">MEDIUM</Code>);
    expect(toJSON()).toMatchSnapshot();
  });
});
