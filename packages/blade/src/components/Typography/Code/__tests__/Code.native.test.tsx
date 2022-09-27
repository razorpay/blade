import React from 'react';
import { Code } from '../Code';
import { CodeTypesContainer } from './CodeTypesContainer';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<Code />', () => {
  it('should render Code with default properties', () => {
    const { getByText, toJSON } = renderWithTheme(<Code>TEST_TOKEN</Code>);
    expect(getByText('TEST_TOKEN')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render large Code with different types', () => {
    const { toJSON } = renderWithTheme(<CodeTypesContainer size="large" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render medium Code with different types', () => {
    const { toJSON } = renderWithTheme(<CodeTypesContainer size="medium" />);
    expect(toJSON()).toMatchSnapshot();
  });
});
