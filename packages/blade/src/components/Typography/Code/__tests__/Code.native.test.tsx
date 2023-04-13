import React from 'react';
import { Code } from '../Code';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';
import typography from '~tokens/global/typography';

describe('<Code />', () => {
  it('should render Code with default properties', () => {
    const { getByText, toJSON } = renderWithTheme(<Code>TEST_TOKEN</Code>);
    getByText('TEST_TOKEN');
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render small Code', () => {
    const { getByText, toJSON } = renderWithTheme(<Code size="small">SMALL</Code>);
    const renderedCode = getByText('SMALL');
    expect(renderedCode).toHaveStyle({ fontSize: typography.onMobile.fonts.size[25] });
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render medium Code', () => {
    const { getByText, toJSON } = renderWithTheme(<Code size="medium">MEDIUM</Code>);
    const renderedCode = getByText('MEDIUM');
    expect(renderedCode).toHaveStyle({ fontSize: typography.onMobile.fonts.size[75] });
    expect(toJSON()).toMatchSnapshot();
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(<Code testID="code-test">TEST_TOKEN</Code>);
    expect(getByTestId('code-test')).toBeTruthy();
  });
});
