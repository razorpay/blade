import React from 'react';
import { Code } from '../Code';
import { CodeTypesContainer } from './CodeTypesContainer';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<Code />', () => {
  it('should render Code with default properties', () => {
    const { container } = renderWithTheme(<Code>TEST_TOKEN</Code>);
    expect(container).toMatchSnapshot();
  });

  it('should render large Code with different types', () => {
    const { container } = renderWithTheme(<CodeTypesContainer size="large" />);
    expect(container).toMatchSnapshot();
  });

  it('should render medium Code with different types', () => {
    const { container } = renderWithTheme(<CodeTypesContainer size="medium" />);
    expect(container).toMatchSnapshot();
  });
});
